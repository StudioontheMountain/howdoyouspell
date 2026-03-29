import { ImageResponse } from 'next/og'

import { getAllSlugs } from '@/lib/words-data'

export const dynamic = 'force-static'

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ word: slug }))
}
export const alt = 'How Do You Spell'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: { word: string } }) {
  const word = params.word.replace(/-/g, ' ')
  const displayWord = word.charAt(0).toUpperCase() + word.slice(1)
  const firstLetter = word.charAt(0).toUpperCase()

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: '#f5f5f7',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: '80px 100px',
          fontFamily: '-apple-system, Helvetica Neue, Arial, sans-serif',
          position: 'relative',
        }}
      >
        <div style={{ fontSize: '22px', fontWeight: '600', color: '#6e6e73', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '32px', display: 'flex' }}>
          HOW DO YOU SPELL
        </div>
        <div style={{ fontSize: '110px', fontWeight: '700', color: '#1d1d1f', letterSpacing: '-0.04em', lineHeight: '1', marginBottom: '32px', display: 'flex', maxWidth: '900px' }}>
          {displayWord}
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ background: '#34c759', borderRadius: '100px', padding: '10px 24px', fontSize: '22px', fontWeight: '600', color: '#fff', display: 'flex' }}>
            ✓ Correct spelling
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: '60px', right: '100px', fontSize: '20px', color: '#aeaeb2', fontWeight: '500', display: 'flex' }}>
          howdoyouspell.app
        </div>
        <div style={{ position: 'absolute', right: '60px', top: '50%', fontSize: '380px', fontWeight: '700', color: '#e8e8ed', letterSpacing: '-0.04em', lineHeight: '1', display: 'flex' }}>
          {firstLetter}
        </div>
      </div>
    ),
    { ...size }
  )
}
