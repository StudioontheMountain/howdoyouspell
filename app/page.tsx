"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { SPELLING_WORDS } from "@/lib/spelling-data"

function AdUnit({ slot, className = "" }: { slot: string; className?: string }) {
  return (
    <div
      className={`bg-stone-100 border border-dashed border-stone-300 rounded-lg flex items-center justify-center text-stone-400 text-sm ${className}`}
    >
      <div className="text-center py-3">
        <p className="font-medium">Ad Unit {slot}</p>
        <p className="text-xs text-stone-300">Google AdSense / Playwire</p>
      </div>
    </div>
  )
}

function BookmarkIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
    </svg>
  )
}

type SpellResult = {
  word: string
  confidence: "exact" | "close" | "guess" | "none"
  dialects: { us: string; uk: string; au: string; nz: string } | null
}

export default function HomePage() {
  const [input, setInput] = useState("")
  const [result, setResult] = useState<SpellResult | null>(null)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    if (typeof window !== "undefined") {
      alert("Press " + (navigator.userAgent.includes("Mac") ? "Cmd" : "Ctrl") + "+D to bookmark this page!")
    }
  }

  const handleCheck = useCallback(async (word?: string) => {
    const checkWord = word || input.trim()
    if (!checkWord) return
    setLoading(true)
    try {
      const res = await fetch(`/api/spell?word=${encodeURIComponent(checkWord)}`)
      const data: SpellResult = await res.json()
      setResult(data)
    } catch {
      setResult({ word: "", confidence: "none", dialects: null })
    }
    setLoading(false)
  }, [input])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleCheck()
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-stone-200">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight text-stone-900">
            How Do You Spell
          </h1>
          <button
            onClick={handleBookmark}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-700 transition-colors text-sm font-semibold"
            title="Bookmark for faster spelling"
          >
            <BookmarkIcon filled={isBookmarked} />
            <span className="hidden sm:inline">For faster spelling, bookmark us</span>
            <span className="sm:hidden">Bookmark</span>
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4">
        {/* Ad Unit 1 - Leaderboard below header */}
        <div className="py-4">
          <AdUnit slot="1" className="w-full h-[90px]" />
        </div>

        {/* The Tool */}
        <section className="py-8 md:py-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-stone-900 text-balance mb-3">
              How do you spell it?
            </h2>
            <p className="text-stone-500 text-base">
              Type the word you&apos;re trying to spell. We&apos;ll figure it out.
            </p>
          </div>

          {/* Input field */}
          <div className="max-w-md mx-auto">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value)
                  setResult(null)
                }}
                onKeyDown={handleKeyDown}
                placeholder="e.g. definately"
                className="flex-1 px-4 py-3 text-lg rounded-xl border-2 border-stone-200 focus:border-stone-900 focus:outline-none transition-colors bg-white text-stone-900 placeholder:text-stone-300"
                autoFocus
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
              />
              <button
                onClick={() => handleCheck()}
                disabled={loading}
                className="px-6 py-3 bg-stone-900 text-white text-lg font-semibold rounded-xl hover:bg-stone-800 active:bg-stone-700 transition-colors disabled:opacity-50"
              >
                {loading ? "..." : "Spell it"}
              </button>
            </div>

            {/* Result */}
            {result && (
              <div className="mt-6 text-center">
                {result.confidence === "exact" ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
                    <p className="text-emerald-800 text-lg font-medium">
                      That&apos;s correct!
                    </p>
                    <p className="text-3xl font-bold text-emerald-900 mt-2">
                      {result.word}
                    </p>
                  </div>
                ) : result.confidence === "close" ? (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <p className="text-blue-800 text-lg font-medium">
                      You meant:
                    </p>
                    <p className="text-4xl font-bold text-blue-900 mt-2 tracking-wide">
                      {result.word}
                    </p>
                    <p className="text-blue-400 text-sm mt-3 line-through">
                      {input}
                    </p>
                  </div>
                ) : result.confidence === "guess" ? (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                    <p className="text-amber-800 text-lg font-medium">
                      Did you mean:
                    </p>
                    <p className="text-4xl font-bold text-amber-900 mt-2 tracking-wide">
                      {result.word}?
                    </p>
                    <p className="text-amber-400 text-sm mt-3 line-through">
                      {input}
                    </p>
                  </div>
                ) : (
                  <div className="bg-stone-50 border border-stone-200 rounded-xl p-6">
                    <p className="text-stone-600 text-lg">
                      Hmm, we couldn&apos;t find that one. Try again?
                    </p>
                  </div>
                )}

                {/* Dialect differences */}
                {result.dialects && (
                  <div className="mt-4 bg-stone-50 border border-stone-200 rounded-xl p-5">
                    <p className="text-stone-500 text-sm font-medium mb-3">Spelling by dialect</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white rounded-lg p-3 border border-stone-100">
                        <p className="text-[11px] uppercase tracking-wider text-stone-400 mb-1">US English</p>
                        <p className="text-lg font-bold text-stone-900">{result.dialects.us}</p>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-stone-100">
                        <p className="text-[11px] uppercase tracking-wider text-stone-400 mb-1">UK English</p>
                        <p className="text-lg font-bold text-stone-900">{result.dialects.uk}</p>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-stone-100">
                        <p className="text-[11px] uppercase tracking-wider text-stone-400 mb-1">Australian</p>
                        <p className="text-lg font-bold text-stone-900">{result.dialects.au}</p>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-stone-100">
                        <p className="text-[11px] uppercase tracking-wider text-stone-400 mb-1">New Zealand</p>
                        <p className="text-lg font-bold text-stone-900">{result.dialects.nz}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Ad Unit 2 - Rectangle in content */}
        <div className="py-4 flex justify-center">
          <AdUnit slot="2" className="w-[300px] h-[250px]" />
        </div>

        {/* All 50 Words - SEO Internal Links */}
        <section className="py-12 border-t border-stone-100">
          <h3 className="text-xl font-bold text-stone-900 mb-2">
            Most commonly misspelled words
          </h3>
          <p className="text-sm text-stone-400 mb-6">
            Click any word for the correct spelling, dialect differences, and memory tips.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {SPELLING_WORDS.map((entry) => {
              const slug = entry.word.toLowerCase().replace(/[' ]/g, "-")
              return (
                <Link
                  key={entry.word}
                  href={`/${slug}`}
                  className="flex items-center justify-between p-3 rounded-xl border border-stone-100 hover:border-emerald-300 hover:bg-emerald-50 transition-colors group"
                >
                  <div>
                    <span className="text-stone-400 line-through text-xs">{entry.misspellings[0]}</span>
                    <span className="block text-stone-900 font-semibold group-hover:text-emerald-800">{entry.word}</span>
                  </div>
                  <svg className="w-4 h-4 text-stone-200 group-hover:text-emerald-500 shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
                </Link>
              )
            })}
          </div>
        </section>

        {/* Ad Unit 3 - Bottom leaderboard */}
        <div className="py-4">
          <AdUnit slot="3" className="w-full h-[90px]" />
        </div>

        {/* SEO Footer Content */}
        <footer className="py-8 border-t border-stone-100">
          <p className="text-sm text-stone-400 text-center max-w-lg mx-auto leading-relaxed">
            How Do You Spell is a free online spelling checker. Just type the word you&apos;re trying to spell and get the correct spelling instantly.
            No dictionary definitions, no grammar tools, no sign-up required. We show you the correct spelling in US, UK, Australian, and New Zealand English.
          </p>
          <p className="text-xs text-stone-300 text-center mt-4">
            2026 How Do You Spell. A simple spelling tool.
          </p>
        </footer>
      </main>
    </div>
  )
}
