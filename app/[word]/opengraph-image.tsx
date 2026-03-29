import { ImageResponse } from 'next/og'
import { getWordBySlug, getAllSlugs } from '@/lib/words-data'


export const alt = 'How Do You Spell'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ word: slug }))
}

export default async function Image({ params }: { params: { word: string } }) {
  const entry = getWordBySlug(params.word)
  const word = entry?.word ?? params.word
  const displayWord = word.charAt(0).toUpperCase() + word.slice(1)
  const misspelling = entry?.misspellings?.[0] ?? null
  const tip = entry?.tip ?? null

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
        }}
      >
        {/* Brand label */}
        <div
          style={{
            fontSize: '22px',
            fontWeight: '600',
            color: '#6e6e73',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            marginBottom: '32px',
            display: 'flex',
          }}
        >
          HOW DO YOU SPELL
        </div>

        {/* The word — large */}
        <div
          style={{
            fontSize: '120px',
            fontWeight: '700',
            color: '#1d1d1f',
            letterSpacing: '-0.04em',
            lineHeight: '1',
            marginBottom: '24px',
            display: 'flex',
          }}
        >
          {displayWord}
        </div>

        {/* Correct spelling badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: misspelling ? '20px' : '0',
          }}
        >
          <div
            style={{
              background: '#34c759',
              borderRadius: '100px',
              padding: '8px 20px',
              fontSize: '20px',
              fontWeight: '600',
              color: '#fff',
              display: 'flex',
            }}
          >
            ✓ Correct spelling
          </div>
        </div>

        {/* Misspelling if available */}
        {misspelling && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: tip ? '20px' : '0',
            }}
          >
            <div
              style={{
                background: '#fff0ee',
                border: '1.5px solid #ffd0c8',
                borderRadius: '100px',
                padding: '8px 20px',
                fontSize: '20px',
                fontWeight: '500',
                color: '#c0392b',
                textDecoration: 'line-through',
                display: 'flex',
              }}
            >
              {misspelling}
            </div>
            <div
              style={{
                fontSize: '18px',
                color: '#6e6e73',
                display: 'flex',
              }}
            >
              ← common misspelling
            </div>
          </div>
        )}

        {/* Tip if available */}
        {tip && (
          <div
            style={{
              fontSize: '22px',
              color: '#6e6e73',
              fontStyle: 'italic',
              marginTop: '8px',
              maxWidth: '900px',
              display: 'flex',
            }}
          >
            {tip}
          </div>
        )}

        {/* Bottom right — URL */}
        <div
          style={{
            position: 'absolute',
            bottom: '60px',
            right: '100px',
            fontSize: '20px',
            color: '#aeaeb2',
            fontWeight: '500',
            display: 'flex',
          }}
        >
          howdoyouspell.app
        </div>

        {/* Decorative right side — large faded letter */}
        <div
          style={{
            position: 'absolute',
            right: '80px',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '400px',
            fontWeight: '700',
            color: '#e8e8ed',
            letterSpacing: '-0.04em',
            lineHeight: '1',
            display: 'flex',
            userSelect: 'none',
          }}
        >
          {word.charAt(0).toUpperCase()}
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
