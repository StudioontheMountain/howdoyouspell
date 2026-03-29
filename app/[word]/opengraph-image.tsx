import { ImageResponse } from 'next/og'
import { getAllSlugs } from '@/lib/words-data'
import * as fs from 'fs'
import * as path from 'path'

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

  // Load the neon letter PNG
  const letterPath = path.join(process.cwd(), 'public', 'letters', `${firstLetter}.png`)
  const letterData = fs.readFileSync(letterPath)
  const letterBase64 = `data:image/png;base64,${letterData.toString('base64')}`

  return new ImageResponse(
    (
      <div style={{ width: '1200px', height: '630px', background: '#000000', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '60px 80px' }}>
        
        {/* Top — brand + neon letter side by side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <img src={letterBase64} width={100} height={100} style={{ display: 'flex' }} />
          <div style={{ display: 'flex', fontSize: '22px', fontWeight: 'bold', color: '#6e6e73', letterSpacing: '6px' }}>
            HOW DO YOU SPELL
          </div>
        </div>

        {/* Middle — the word */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', fontSize: '108px', fontWeight: 'bold', color: '#f5f5f7', letterSpacing: '-3px', lineHeight: '1' }}>
            {displayWord}
          </div>
          <div style={{ display: 'flex', fontSize: '28px', color: '#30d158', fontWeight: 'bold' }}>
            ✓  Correct spelling
          </div>
        </div>

        {/* Bottom — url */}
        <div style={{ display: 'flex', fontSize: '20px', color: '#3a3a3c' }}>
          howdoyouspell.app
        </div>

      </div>
    ),
    { ...size }
  )
}
