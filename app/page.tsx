// @ts-nocheck
'use client'
import MoneyBar from '@/components/MoneyBar'
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
    let best = null, bestDist = 4
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
  const activeDialects = showDefault ? defaultDialects : (result && result.dialects ? result.dialects : { us: result ? result.word : '', uk: result ? result.word : '', ca: result ? result.word : '', au: result ? result.word : '', nz: result ? result.word : '' })
  const firstLetter = query.trim().toLowerCase().charAt(0)
  const filteredWords = firstLetter ? allWords.filter(w => w.word.toLowerCase().startsWith(firstLetter)) : allWords
  const suggestions = notFound ? allWords.filter(w => w.word.toLowerCase().startsWith(firstLetter)).slice(0, 6) : []

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f7', fontFamily: '-apple-system, Helvetica Neue, Arial, sans-serif' }}>
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', background: 'rgba(245,245,247,0.85)', backdropFilter: 'blur(20px)', borderBottom: '0.5px solid #d2d2d7' }}>
        <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: -0.3 }}>How Do You Spell</span>
        
      </nav>
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '72px 24px 48px' }}>
        <h1 style={{ fontSize: 'clamp(36px, 6vw, 56px)', fontWeight: 700, letterSpacing: -1.5, textAlign: 'center', marginBottom: 12, lineHeight: 1.1 }}>How Do You Spell</h1>
        <p style={{ textAlign: 'center', color: '#6e6e73', fontSize: 17, marginBottom: 32 }}>Type any word. We will sort it out.</p>
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          <input ref={inputRef} value={query} onChange={e => { setQuery(e.target.value); setNotFound(false); setResult(null) }} onKeyDown={e => e.key === 'Enter' && handleSearch()} placeholder="Type any word..." style={{ flex: 1, minWidth: 0, height: 52, borderRadius: 26, border: '1.5px solid #0071e3', padding: '0 20px', fontSize: 17, outline: 'none', background: '#fff' }} />
          <button onClick={handleSearch} style={{ height: 52, width: 90, borderRadius: 26, background: '#34c759', color: '#fff', border: 'none', fontSize: 15, fontWeight: 600, cursor: 'pointer', flexShrink: 0 }}>Spell it</button>
        </div>
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <button onClick={() => { if (navigator.share) { navigator.share({ title: 'How Do You Spell', url: 'https://www.howdoyouspell.app' }) } else { alert('Tip: Add this page to your home screen or bookmarks for quick access!') } }} style={{ background: 'none', border: '0.5px solid #d2d2d7', borderRadius: 20, padding: '7px 18px', fontSize: 13, color: '#6e6e73', cursor: 'pointer' }}>🔖 Keep Me Handy</button>
        </div>
        <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', border: '0.5px solid #d2d2d7', marginBottom: 24 }}>
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
        {result && (
          <div style={{ background: '#fff', borderRadius: 16, border: '0.5px solid #d2d2d7', padding: 24, marginBottom: 24 }}>
            <h2 style={{ fontSize: 32, fontWeight: 700, margin: '0 0 16px' }}>{result.word}</h2>
            {result.misspellings && result.misspellings.length > 0 && <div style={{ marginBottom: 14 }}>{result.misspellings.map(m => <span key={m} style={{ display: 'inline-block', margin: '2px 4px', padding: '2px 10px', border: '0.5px solid #ff3b3030', borderRadius: 20, fontSize: 13, textDecoration: 'line-through', color: '#6e6e73' }}>{m}</span>)}</div>}
            {result.tip && <div style={{ background: '#f5f5f7', borderRadius: 10, padding: '12px 16px', marginBottom: 14, fontSize: 14, lineHeight: 1.6 }}>💡 {result.tip}</div>}
            {result.example && <blockquote style={{ borderLeft: '3px solid #34c759', margin: '0 0 14px', paddingLeft: 16, fontSize: 15, color: '#3a3a3c', fontStyle: 'italic' }}>{result.example}</blockquote>}
            {result.commentary && <p style={{ fontSize: 14, lineHeight: 1.7, color: '#6e6e73', margin: 0 }}>{result.commentary}</p>}
            <a href={'/' + result.slug} style={{ display: 'inline-block', marginTop: 16, fontSize: 14, color: '#0071e3', textDecoration: 'none', fontWeight: 500 }}>Full entry with etymology →</a>
          </div>
        )}
        {notFound && (
          <div style={{ background: '#fff', borderRadius: 16, border: '0.5px solid #d2d2d7', padding: 24, marginBottom: 24 }}>
            <p style={{ margin: '0 0 4px', fontWeight: 600, fontSize: 16 }}>🔍 We do not have that word yet</p>
            <p style={{ margin: '0 0 14px', fontSize: 13, color: '#6e6e73' }}>Our dictionary focuses on commonly misspelled words. If you typed it correctly, it may just not be in our list yet.</p>
            {suggestions.length > 0 && <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{suggestions.map(s => <a key={s.slug} href={'/' + s.slug} style={{ padding: '6px 14px', background: '#f5f5f7', borderRadius: 20, fontSize: 13, color: '#1d1d1f', textDecoration: 'none', border: '0.5px solid #d2d2d7' }}>{s.word}</a>)}</div>}
          </div>
        )}
      </div>
<MoneyBar /> 

      <ArticlesSection articles={articles as any[]} />
      <footer style={{ borderTop: '0.5px solid #d2d2d7', padding: 24, paddingBottom: 80, textAlign: 'center', fontSize: 12, color: '#aeaeb2' }}>
        <div style={{ marginBottom: 10 }}>© {new Date().getFullYear()} How Do You Spell · Free spelling reference · US, UK, IE, CA, AU and NZ English</div>
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '8px 20px' }}>
          <a href="/privacy" style={{ color: '#aeaeb2', textDecoration: 'none' }}>Privacy Policy</a>
          <a href="/terms" style={{ color: '#aeaeb2', textDecoration: 'none' }}>Terms of Service</a>
          <a href="/data-use" style={{ color: '#aeaeb2', textDecoration: 'none' }}>Data Use</a>
        </div>
      </footer>
    </div>
  )
}