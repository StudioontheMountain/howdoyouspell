'use client'
import { useState, useEffect, useRef } from 'react'

const WORDS = [
  { word: 'necessary', definition: 'Something you cannot do without; absolutely required.' },
  { word: 'definitely', definition: 'Without any doubt; used to emphasize certainty.' },
  { word: 'accommodate', definition: 'To provide space or to adapt to someone\'s needs.' },
  { word: 'occurrence', definition: 'An incident or event; the fact of something happening.' },
  { word: 'embarrass', definition: 'To cause someone to feel awkward or self-conscious.' },
  { word: 'maintenance', definition: 'The process of keeping something in good condition.' },
  { word: 'separate', definition: 'To cause to move apart; not joined or touching.' },
  { word: 'beginning', definition: 'The point in time at which something starts.' },
  { word: 'beautiful', definition: 'Pleasing to the senses; having qualities that delight.' },
  { word: 'receive', definition: 'To be given, presented with, or paid something.' },
  { word: 'achieve', definition: 'To successfully bring about a desired result.' },
  { word: 'believe', definition: 'To accept something as true or real.' },
  { word: 'colleague', definition: 'A person with whom one works in a profession.' },
  { word: 'occasion', definition: 'A particular time or instance of an event.' },
  { word: 'recommend', definition: 'To put forward with approval as being suitable.' },
]

function pick(exclude?: string) {
  const pool = exclude ? WORDS.filter(w => w.word !== exclude) : WORDS
  return pool[Math.floor(Math.random() * pool.length)]
}

export default function SpellingTeaser() {
  const [current, setCurrent] = useState(() => pick())
  const [input, setInput] = useState('')
  const [state, setState] = useState<'idle'|'correct'|'wrong'>('idle')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (state !== 'idle') {
      const t = setTimeout(() => {
        setCurrent(pick(current.word))
        setInput('')
        setState('idle')
        inputRef.current?.focus()
      }, 2500)
      return () => clearTimeout(t)
    }
  }, [state])

  const check = () => {
    if (!input.trim()) return
    if (input.trim().toLowerCase() === current.word) {
      setState('correct')
    } else {
      setState('wrong')
    }
  }

  return (
    <div style={{ background: '#fff', border: '0.5px solid #d2d2d7', borderRadius: 16, padding: '20px 24px', marginBottom: 24 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: '#aeaeb2', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>Can you spell it?</div>
      <p style={{ fontSize: 15, color: '#6e6e73', lineHeight: 1.6, marginBottom: 16, minHeight: 48 }}>{current.definition}</p>
      {state === 'idle' && (
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && check()}
            placeholder="Type your answer..."
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            style={{ flex: 1, height: 44, borderRadius: 22, border: '1px solid #d2d2d7', padding: '0 16px', fontSize: 16, outline: 'none', background: '#f5f5f7', fontFamily: 'inherit' }}
          />
          <button onClick={check} style={{ height: 44, padding: '0 20px', borderRadius: 22, border: '1px solid #0071e3', background: '#0071e3', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Go</button>
        </div>
      )}
      {state === 'correct' && (
        <div style={{ textAlign: 'center', padding: '8px 0' }}>
          <span style={{ fontSize: 15, color: '#34c759', fontWeight: 600 }}>✓ Correct! Next word in a moment...</span>
        </div>
      )}
      {state === 'wrong' && (
        <div style={{ textAlign: 'center', padding: '8px 0' }}>
          <span style={{ fontSize: 15, color: '#ff3b30', fontWeight: 500 }}>The correct spelling is <strong>"{current.word}"</strong> — next word coming up...</span>
        </div>
      )}
    </div>
  )
}
