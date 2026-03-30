// @ts-nocheck
'use client'
import MoneyBar from '@/components/MoneyBar'
import SpellingTeaser from '@/components/SpellingTeaser'
import { ArticlesSection } from '@/components/ArticleCard'
import articles from '@/public/articles.json'
import { useState, useEffect, useRef } from 'react'

export default function HomePage() {
  const [query, setQuery] = useState('')
  const [allWords, setAllWords] = useState([])
  const [result, setResult] = useState(null)
  const [notFound, setNotFound] = useState(false)
  const [totalWords, setTotalWords] = useState(2047)
  const inputRef = useRef(null)

  useEffect(() => {
    fetch('/words.json').then(r => r.json()).then(data => {
      setAllWords(data.words)
      setTotalWords(data.totalWords)
    })
  }, [])

  // Live search as user types — wait for 4+ characters
  useEffect(() => {
    if (query.trim().length < 4 || allWords.length === 0) return
    const timer = setTimeout(() => { handleSearch() }, 400)
    return () => clearTimeout(timer)
  }, [query, allWords])

  useEffect(() => { if (inputRef.current) inputRef.current.focus() }, [])

  const levenshtein = (a, b) => {
    const m = a.length, n = b.length
    const dp = Array.from({length: m+1}, (_, i) => Array.from({length: n+1}, (_, j) => i === 0 ? j : j === 0 ? i : 0))
    for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++)
      dp[i][j] = a[i-1] === b[j-1] ? dp[i-1][j-1] : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])
    return dp[m][n]
  }

  const handleSearch = () => {
    if (!query.trim()) return
    const q = query.trim().toLowerCase()

    // Exact match first
    const exact = allWords.find(w =>
      w.word.toLowerCase() === q ||
      w.slug === q ||
      (w.misspellings && w.misspellings.some(m => m.toLowerCase() === q))
    )
    if (exact) { setResult(exact); setNotFound(false); return }

    // Fuzzy match — find closest word within edit distance 3
    let best = null, bestDist = 3
    for (const w of allWords) {
      const d = levenshtein(q, w.word.toLowerCase())
      if (d < bestDist) { best = w; bestDist = d }
      if (w.misspellings) for (const m of w.misspellings) {
        const dm = levenshtein(q, m.toLowerCase())
        if (dm < bestDist) { best = w; bestDist = dm }
      }
    }
    if (best) { setResult(best); setNotFound(false) }
    else { setResult(null); setNotFound(true) }
  }

  const defaultDialects = { us: 'color', uk: 'colour', ie: 'colour', ca: 'colour', au: 'colour', nz: 'colour' }
  const showDefault = !result && !notFound
  const displayResult = result
  const activeDialects = displayResult && displayResult.dialects ? displayResult.dialects : (showDefault ? defaultDialects : { us: result ? result.word : '', uk: result ? result.word : '', ca: result ? result.word : '', au: result ? result.word : '', nz: result ? result.word : '' })
  const firstLetter = query.trim().toLowerCase().charAt(0)
  const filteredWords = firstLetter ? allWords.filter(w => w.word.toLowerCase().startsWith(firstLetter)) : allWords
  const suggestions = notFound ? allWords.filter(w => w.word.toLowerCase().startsWith(firstLetter)).slice(0, 6) : []

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f7', fontFamily: '-apple-system, Helvetica Neue, Arial, sans-serif' }}>
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', background: 'rgba(245,245,247,0.85)', backdropFilter: 'blur(20px)', borderBottom: '0.5px solid #d2d2d7' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: -0.3 }}>How Do You Spell</span>
          <button onClick={() => { if (navigator.share) { navigator.share({ title: 'How Do You Spell', url: 'https://www.howdoyouspell.app' }) } else { alert('Tip: Add this page to your bookmarks for quick access!') } }} style={{ background: 'none', border: '0.5px solid #d2d2d7', borderRadius: 20, padding: '5px 14px', fontSize: 13, color: '#6e6e73', cursor: 'pointer' }}>🔖 Bookmark Me</button>
        </div>
      </nav>
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '16px 24px 48px' }}>
        <h1 style={{ fontSize: 'clamp(36px, 6vw, 56px)', fontWeight: 700, letterSpacing: -1.5, textAlign: 'center', marginBottom: 16, lineHeight: 1.1 }}>How Do You Spell</h1>
        <SpellingTeaser />
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          <input ref={inputRef} value={query} onChange={e => { setQuery(e.target.value); setNotFound(false); setResult(null) }} onKeyDown={e => e.key === 'Enter' && handleSearch()} placeholder="Check any word's spelling..." style={{ flex: 1, minWidth: 0, height: 52, borderRadius: 26, border: '1.5px solid #0071e3', padding: '0 20px', fontSize: 17, outline: 'none', background: '#fff' }} />
        </div>
        
        <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', border: '0.5px solid #d2d2d7', marginBottom: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', background: '#f5f0e8', borderBottom: '0.5px solid #ddd8cc' }}>
            {['US','UK','IE','CA','AU','NZ'].map(d => <div key={d} style={{ padding: '10px 2px', textAlign: 'center', fontSize: 11, fontWeight: 600, color: '#6e6e73', letterSpacing: 0.3 }}>{d}</div>)}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', background: '#faf8f4' }}>
            {['us','uk','ie','ca','au','nz'].map((locale, i) => {
              const val = (activeDialects && activeDialects[locale]) || '—'
              const differs = val !== (activeDialects && activeDialects.us)
              return <div key={locale} style={{ padding: '12px 2px', textAlign: 'center', fontSize: 13, fontSize: 14, fontWeight: differs ? 700 : 400, color: differs ? '#3a3a3c' : '#1d1d1f', background: differs ? '#ede8df' : 'transparent', borderLeft: i > 0 ? '0.5px solid #ddd8cc' : 'none' }}>{val}</div>
            })}
          </div>
        </div>
        {displayResult && (
          <div style={{ background: '#fff', borderRadius: 16, border: '0.5px solid #d2d2d7', padding: 24, marginBottom: 24 }}>
            <h2 style={{ fontSize: 32, fontWeight: 700, margin: '0 0 16px' }}>{displayResult.word}</h2>
            {displayResult.misspellings && displayResult.misspellings.length > 0 && <div style={{ marginBottom: 14 }}>{displayResult.misspellings.map(m => <span key={m} style={{ display: 'inline-block', margin: '2px 4px', padding: '2px 10px', border: '0.5px solid #ff3b3030', borderRadius: 20, fontSize: 13, textDecoration: 'line-through', color: '#6e6e73' }}>{m}</span>)}</div>}
            {displayResult.tip && <div style={{ background: '#f5f5f7', borderRadius: 10, padding: '12px 16px', marginBottom: 14, fontSize: 14, lineHeight: 1.6 }}>💡 {displayResult.tip}</div>}
            {displayResult.example && <blockquote style={{ borderLeft: '3px solid #34c759', margin: '0 0 14px', paddingLeft: 16, fontSize: 15, color: '#3a3a3c', fontStyle: 'italic' }}>{displayResult.example}</blockquote>}
            {displayResult.commentary && <p style={{ fontSize: 14, lineHeight: 1.7, color: '#6e6e73', margin: 0 }}>{displayResult.commentary}</p>}
            <a href={'/' + displayResult.slug} style={{ display: 'inline-block', marginTop: 16, fontSize: 14, color: '#0071e3', textDecoration: 'none', fontWeight: 500 }}>Full entry with etymology →</a>
          </div>
        )}
        {notFound && (
          <div style={{ background: '#fff', borderRadius: 16, border: '0.5px solid #d2d2d7', padding: 24, marginBottom: 24, textAlign: 'center' }}>
            <p style={{ margin: '0 0 4px', fontWeight: 700, fontSize: 18 }}>Oops!</p>
            <p style={{ margin: '0 0 4px', fontWeight: 600, fontSize: 16 }}>We don't have that one yet.</p>
            <p style={{ margin: 0, fontSize: 14, color: '#6e6e73' }}>We're always adding new words. Try a different search!</p>
          </div>
        )}
      </div>
<MoneyBar /> 

      <ArticlesSection articles={articles as any[]} />
      <section style={{ maxWidth: 680, margin: "0 auto", padding: "48px 24px" }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: -0.5, marginBottom: 32 }}>Frequently Asked Questions</h2>
        {[
          { q: "How do you spell a word you've never seen written down?", a: "Take your best shot. Type it the way it sounds and hit Enter. Our fuzzy matching will find what you're looking for even if you're miles off. The English language has been making fools of people for centuries — you're in good company." },
          { q: "What's the difference between American and British spelling?", a: "Two nations divided by a common language and a few hundred spelling disagreements. Color or colour. Organize or organise. Center or centre. We show all six major English dialects side by side — US, UK, Irish, Canadian, Australian, and New Zealand — so you know exactly which spelling is correct for your audience before you embarrass yourself." },
          { q: "What are the most commonly misspelled words in English?", a: "The ones that have been humiliating people for generations. Accommodate. Occurrence. Separate. Necessary. Definitely. We cover over 2,000 of the trickiest words in English because the language was clearly designed by a committee that hated consistency." },
          { q: "Is there a fast way to check spelling without autocorrect mangling it?", a: "Yes. Type the word, hit Enter. No autocorrect, no algorithm deciding it knows better than you, no suggestions you didn't ask for. Just the correct spelling, immediately." },
          { q: "Why does English have so many spelling exceptions?", a: "Because English spent centuries mugging other languages in dark alleys and stealing their words — Latin, French, Norse, Germanic. Each came with its own spelling rules and nobody bothered to reconcile them. We can't fix the language. We can tell you how to spell it." },
          { q: "How do I know which spelling is correct for my country?", a: "Pick your flag at the top. US, UK, IE, CA, AU, or NZ. The correct spelling for your region appears instantly alongside the others. No guessing, no embarrassing emails to foreign colleagues." }
        ].map(({ q, a }, i) => (
          <div key={i} style={{ borderTop: "0.5px solid #d2d2d7", padding: "20px 0" }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, margin: "0 0 10px", color: "#1d1d1f" }}>{q}</h3>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: "#6e6e73", margin: 0 }}>{a}</p>
          </div>
        ))}
      </section>
      <footer style={{ borderTop: '0.5px solid #d2d2d7', padding: 24, paddingBottom: 80, textAlign: 'center', fontSize: 12, color: '#aeaeb2' }}>
        <div style={{ marginBottom: 10 }}>© {new Date().getFullYear()} How Do You Spell · Free spelling reference · US, UK, IE, CA, AU and NZ English</div>
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '8px 20px' }}>
          <a href="/about" style={{ color: '#aeaeb2', textDecoration: 'none' }}>About</a>
          <a href="/privacy" style={{ color: '#aeaeb2', textDecoration: 'none' }}>Privacy</a>
          <a href="/terms" style={{ color: '#aeaeb2', textDecoration: 'none' }}>Terms</a>
          <a href="/data-use" style={{ color: '#aeaeb2', textDecoration: 'none' }}>Data Use</a>
          <a href="/affiliate-disclosure" style={{ color: '#aeaeb2', textDecoration: 'none' }}>Affiliate Disclosure</a>
          <a href="/contact" style={{ color: '#aeaeb2', textDecoration: 'none' }}>Contact</a>
        </div>
      </footer>
    </div>
  )
}