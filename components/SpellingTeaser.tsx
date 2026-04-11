'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import wordsJson from '@/lib/words.json'

type WordEntry = {
  word: string
  difficulty: 'easy' | 'medium' | 'hard'
  tip: string | null
}

const allWords: WordEntry[] = (wordsJson as any).words
  .filter((w: any) => w.word && w.difficulty && w.word.length >= 4)
  .map((w: any) => ({ word: w.word.toLowerCase(), difficulty: w.difficulty, tip: w.tip || null }))

const EASY = allWords.filter(w => w.difficulty === 'easy')
const MEDIUM = allWords.filter(w => w.difficulty === 'medium')
const HARD = allWords.filter(w => w.difficulty === 'hard')

function pickWord(difficulty: 'easy' | 'medium' | 'hard', exclude?: string): WordEntry {
  const pool = difficulty === 'easy' ? EASY : difficulty === 'medium' ? MEDIUM : HARD
  let entry = pool[Math.floor(Math.random() * pool.length)]
  let tries = 0
  while (entry.word === exclude && tries < 20) {
    entry = pool[Math.floor(Math.random() * pool.length)]
    tries++
  }
  return entry
}

function generateBlanks(word: string): boolean[] {
  const blanks = new Array(word.length).fill(false)
  const indices = Array.from({ length: word.length }, (_, i) => i)
  // Shuffle indices
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]]
  }
  // Remove roughly half
  const removeCount = Math.ceil(word.length / 2)
  for (let i = 0; i < removeCount; i++) {
    blanks[indices[i]] = true
  }
  return blanks
}

function getTimeLimit(word: string): number {
  const len = word.length
  if (len <= 5) return 10
  if (len <= 7) return 15
  if (len <= 9) return 20
  return 25
}

function getDifficulty(round: number): 'easy' | 'medium' | 'hard' {
  if (round <= 3) return 'easy'
  if (round <= 7) return 'medium'
  return 'hard'
}

export default function SpellingTeaser() {
  const [round, setRound] = useState(1)
  const [score, setScore] = useState(0)
  const [roundsPlayed, setRoundsPlayed] = useState(0)
  const TOTAL_ROUNDS = 5
  const [word, setWord] = useState('')
  const [hint, setHint] = useState<string | null>(null)
  const [blanks, setBlanks] = useState<boolean[]>([])
  const [inputs, setInputs] = useState<string[]>([])
  const [timeLeft, setTimeLeft] = useState(0)
  const [timeLimit, setTimeLimit] = useState(0)
  const [state, setState] = useState<'ready' | 'playing' | 'correct' | 'wrong' | 'timeout' | 'trophy' | 'finished'>('ready')
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [showTrophy, setShowTrophy] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const startRound = useCallback((roundNum: number, excludeWord?: string) => {
    const diff = getDifficulty(roundNum)
    const entry = pickWord(diff, excludeWord)
    const w = entry.word
    const b = generateBlanks(w)
    const time = getTimeLimit(w)
    setWord(w)
    setHint(entry.tip)
    setBlanks(b)
    setInputs(new Array(w.length).fill(''))
    setTimeLeft(time)
    setTimeLimit(time)
    setState('playing')
    setTimeout(() => {
      const firstBlank = b.indexOf(true)
      if (firstBlank >= 0) inputRefs.current[firstBlank]?.focus()
    }, 50)
  }, [])



  const [tabVisible, setTabVisible] = useState(true)

  useEffect(() => {
    const handleVisibility = () => setTabVisible(document.visibilityState === 'visible')
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [])

  useEffect(() => {
    if (state !== 'playing' || timeLeft <= 0 || !tabVisible) return
    timerRef.current = setTimeout(() => {
      if (timeLeft <= 1) {
        setState('timeout')
        setStreak(0)
      } else {
        setTimeLeft(t => t - 1)
      }
    }, 1000)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [state, timeLeft, tabVisible])

  const checkAnswer = useCallback(() => {
    const attempt = word.split('').map((ch, i) => blanks[i] ? (inputs[i] || '').toLowerCase() : ch).join('')
    if (attempt === word) {
      const newStreak = streak + 1
      setScore(s => s + 1)
      setStreak(newStreak)
      if (newStreak > bestStreak) setBestStreak(newStreak)
      if (newStreak > 0 && newStreak % 5 === 0) {
        setState('trophy')
        setShowTrophy(true)
      } else {
        setState('correct')
      }
    } else {
      setState('wrong')
      setStreak(0)
    }
  }, [word, blanks, inputs, streak, bestStreak])

  const handleInput = useCallback((index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1)
    const letter = value.replace(/[^a-zA-Z]/g, '')
    const newInputs = [...inputs]
    newInputs[index] = letter
    setInputs(newInputs)

    if (letter) {
      // Find next blank
      for (let i = index + 1; i < blanks.length; i++) {
        if (blanks[i]) {
          inputRefs.current[i]?.focus()
          return
        }
      }
      // All blanks filled — auto-check
      const allFilled = blanks.every((isBlank, i) => !isBlank || newInputs[i])
      if (allFilled) {
        const attempt = word.split('').map((ch, i) => blanks[i] ? (newInputs[i] || '').toLowerCase() : ch).join('')
        if (attempt === word) {
          const newStreak = streak + 1
          setScore(s => s + 1)
          setStreak(newStreak)
          if (newStreak > bestStreak) setBestStreak(newStreak)
          if (newStreak > 0 && newStreak % 5 === 0) {
            setState('trophy')
            setShowTrophy(true)
          } else {
            setState('correct')
          }
        }
      }
    }
  }, [inputs, blanks, word, streak, bestStreak])

  const handleKeyDown = useCallback((index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !inputs[index]) {
      for (let i = index - 1; i >= 0; i--) {
        if (blanks[i]) {
          inputRefs.current[i]?.focus()
          return
        }
      }
    }
    if (e.key === 'Enter') {
      checkAnswer()
    }
  }, [inputs, blanks, checkAnswer])

  const nextRound = useCallback(() => {
    const played = roundsPlayed + 1
    setRoundsPlayed(played)
    if (played >= TOTAL_ROUNDS) {
      setState('finished')
      return
    }
    const next = round + 1
    setRound(next)
    setShowTrophy(false)
    startRound(next, word)
  }, [round, word, startRound, roundsPlayed, TOTAL_ROUNDS])

  const startGame = useCallback(() => {
    setRound(1)
    setScore(0)
    setStreak(0)
    setRoundsPlayed(0)
    setShowTrophy(false)
    startRound(1)
  }, [startRound])

  useEffect(() => {
    if ((state === 'correct' || state === 'wrong' || state === 'timeout') && tabVisible) {
      const t = setTimeout(nextRound, state === 'correct' ? 1500 : 2500)
      return () => clearTimeout(t)
    }
  }, [state, nextRound, tabVisible])

  const timerColor = timeLeft <= 3 ? '#ff3b30' : timeLeft <= 5 ? '#ff9500' : '#34c759'
  const timerPercent = timeLimit > 0 ? (timeLeft / timeLimit) * 100 : 100
  const diff = getDifficulty(round)

  if (!word && state !== 'ready') return null

  return (
    <div style={{ background: '#fff', border: '0.5px solid #d2d2d7', borderRadius: 16, padding: '20px 24px', marginBottom: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#aeaeb2', letterSpacing: '0.08em', textTransform: 'uppercase' }}>🏆 Spell It</div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {showTrophy && <span style={{ fontSize: 20 }}>🏆</span>}
          <span style={{ fontSize: 12, color: '#6e6e73', fontWeight: 500 }}>{score}/{TOTAL_ROUNDS}</span>
          {bestStreak >= 5 && <span style={{ fontSize: 12, color: '#ff9500', fontWeight: 600 }}>🔥 {bestStreak}</span>}
        </div>
      </div>

      {/* Difficulty badge */}
      {(state !== 'ready' && state !== 'finished') && <div style={{ marginBottom: 12 }}>
        <span style={{
          fontSize: 10, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase',
          padding: '3px 8px', borderRadius: 4,
          background: diff === 'easy' ? '#e8f5e9' : diff === 'medium' ? '#fff3e0' : '#fce4ec',
          color: diff === 'easy' ? '#2e7d32' : diff === 'medium' ? '#e65100' : '#c62828',
        }}>{diff}</span>
        <span style={{ fontSize: 11, color: '#aeaeb2', marginLeft: 8 }}>Round {round}/{TOTAL_ROUNDS}</span>
      </div>}

      {/* Ready state */}
      {state === 'ready' && (
        <div style={{ textAlign: 'center', padding: '16px 0' }}>
          <p style={{ fontSize: 15, color: '#6e6e73', marginBottom: 16, lineHeight: 1.5 }}>Fill in the missing letters before time runs out. 5 words, increasing difficulty.</p>
          <button onClick={startGame} style={{
            width: '100%', height: 48, borderRadius: 24, border: 'none',
            background: '#0071e3', color: '#fff', fontSize: 16, fontWeight: 600,
            cursor: 'pointer', fontFamily: 'inherit',
          }}>Start</button>
        </div>
      )}

      {/* Countdown clock */}
      {state === 'playing' && (
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <span style={{
            fontSize: 28, fontWeight: 700, fontFamily: 'monospace',
            color: timerColor,
            transition: 'color 0.3s',
          }}>{timeLeft}</span>
          <span style={{ fontSize: 12, color: '#aeaeb2', marginLeft: 4 }}>s</span>
        </div>
      )}

      {/* Hint */}
      {state === 'playing' && hint && (
        <p style={{ fontSize: 13, color: '#6e6e73', lineHeight: 1.5, marginBottom: 12, textAlign: 'center', fontStyle: 'italic' }}>{hint}</p>
      )}

      {/* Word display */}
      {state === 'playing' && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 4, flexWrap: 'wrap', marginBottom: 16 }}>
          {word.split('').map((ch, i) => (
            blanks[i] ? (
              <input
                key={i}
                ref={el => { inputRefs.current[i] = el }}
                value={inputs[i] || ''}
                onChange={e => handleInput(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
                maxLength={1}
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                style={{
                  width: 36, height: 44, textAlign: 'center', fontSize: 22, fontWeight: 600,
                  border: '2px solid #0071e3', borderRadius: 8, outline: 'none',
                  background: '#f5f5f7', fontFamily: 'monospace',
                  caretColor: '#0071e3',
                }}
              />
            ) : (
              <div key={i} style={{
                width: 36, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22, fontWeight: 600, color: '#1d1d1f', fontFamily: 'monospace',
                borderBottom: '2px solid #d2d2d7',
              }}>
                {ch}
              </div>
            )
          ))}
        </div>
      )}

      {/* Check button */}
      {state === 'playing' && (
        <button onClick={checkAnswer} style={{
          width: '100%', height: 44, borderRadius: 22, border: 'none',
          background: '#0071e3', color: '#fff', fontSize: 14, fontWeight: 600,
          cursor: 'pointer', fontFamily: 'inherit',
        }}>Check</button>
      )}

      {/* Correct */}
      {state === 'correct' && (
        <div style={{ textAlign: 'center', padding: '16px 0' }}>
          <span style={{ fontSize: 15, color: '#34c759', fontWeight: 600 }}>✓ Correct! +1</span>
          {streak >= 3 && <div style={{ fontSize: 13, color: '#ff9500', marginTop: 4 }}>🔥 {streak} streak</div>}
        </div>
      )}

      {/* Wrong */}
      {state === 'wrong' && (
        <div style={{ textAlign: 'center', padding: '16px 0' }}>
          <div style={{ fontSize: 15, color: '#ff3b30', fontWeight: 500 }}>The word was <strong>"{word}"</strong></div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 3, marginTop: 8 }}>
            {word.split('').map((ch, i) => (
              <span key={i} style={{
                fontSize: 20, fontWeight: 600, fontFamily: 'monospace',
                color: blanks[i] ? '#ff3b30' : '#1d1d1f',
              }}>{ch}</span>
            ))}
          </div>
        </div>
      )}

      {/* Timeout */}
      {state === 'timeout' && (
        <div style={{ textAlign: 'center', padding: '16px 0' }}>
          <div style={{ fontSize: 15, color: '#ff9500', fontWeight: 600 }}>⏰ Time's up!</div>
          <div style={{ fontSize: 14, color: '#6e6e73', marginTop: 4 }}>The word was <strong>"{word}"</strong></div>
        </div>
      )}

      {/* Finished */}
      {state === 'finished' && (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          {score >= 4 && (
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <div style={{ fontSize: 80 }}>🏆</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#b8860b', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 4 }}>Spelling Champion</div>
            </div>
          )}
          {score === 3 && <div style={{ fontSize: 64 }}>⭐</div>}
          {score <= 2 && <div style={{ fontSize: 64 }}>💪</div>}
          <div style={{ fontSize: 32, fontWeight: 700, color: '#1d1d1f', marginTop: 12 }}>{score}/{TOTAL_ROUNDS}</div>
          <div style={{ fontSize: 15, color: '#6e6e73', marginTop: 4 }}>
            {score === 5 ? 'Perfect score - flawless spelling' : score >= 4 ? 'Great job - almost perfect' : score >= 3 ? 'Not bad - keep going' : 'Keep practicing - you will get there'}
          </div>
          <button onClick={startGame} style={{
            marginTop: 20, width: '100%', height: 48, borderRadius: 24, border: 'none',
            background: '#0071e3', color: '#fff', fontSize: 16, fontWeight: 600,
            cursor: 'pointer', fontFamily: 'inherit',
          }}>Play Again</button>
        </div>
      )}

      {/* Trophy */}
      {state === 'trophy' && (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ fontSize: 56 }}>🏆</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#1d1d1f', marginTop: 8 }}>{streak} in a row!</div>
          <div style={{ fontSize: 14, color: '#6e6e73', marginTop: 4 }}>You're on fire</div>
          <button onClick={nextRound} style={{
            marginTop: 12, padding: '10px 32px', borderRadius: 22, border: 'none',
            background: '#0071e3', color: '#fff', fontSize: 14, fontWeight: 600,
            cursor: 'pointer', fontFamily: 'inherit',
          }}>Keep going</button>
        </div>
      )}
    </div>
  )
}
