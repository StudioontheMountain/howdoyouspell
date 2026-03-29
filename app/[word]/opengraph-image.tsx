import { ImageResponse } from 'next/og'
import { getAllSlugs } from '@/lib/words-data'

export const dynamic = 'force-static'
export const alt = 'How Do You Spell'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ word: slug }))
}

export default async function Image({ params }: { params: Promise<{ word: string }> }) {
  const { word: slug } = await params
  const word = slug.replace(/-/g, ' ')
  const displayWord = word.charAt(0).toUpperCase() + word.slice(1)
  const firstLetter = word.charAt(0).toUpperCase()
  const letterUrl = `https://www.howdoyouspell.app/letters/${firstLetter}.png`

  return new ImageResponse(
    (
      <div style={{ width: '1200px', height: '630px', background: '#000000', display: 'flex', flexDirection: 'row' }}>
        <div style={{ width: '700px', display: 'flex', flexDirection: 'column', padding: '60px 40px 60px 80px' }}>
          <div style={{ display: 'flex', fontSize: '18px', fontWeight: 'bold', color: '#6e6e73', letterSpacing: '6px', marginBottom: '40px' }}>HOW DO YOU SPELL</div>
          <div style={{ display: 'flex', fontSize: '120px', fontWeight: 'bold', color: '#f5f5f7', letterSpacing: '-4px', lineHeight: '1', marginBottom: '24px' }}>{displayWord}</div>
          <div style={{ display: 'flex', fontSize: '28px', color: '#30d158', fontWeight: 'bold' }}>Correct spelling</div>
          <div style={{ flex: '1' }}></div>
          <div style={{ display: 'flex', fontSize: '18px', color: '#3a3a3c' }}>howdoyouspell.app</div>
        </div>
        <div style={{ width: '500px', height: '630px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src={letterUrl} width={500} height={500} style={{ display: 'flex' }} />
        </div>
      </div>
    ),
    { ...size }
  )
}
