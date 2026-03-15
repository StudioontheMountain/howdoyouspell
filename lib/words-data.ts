/**
 * words-data.ts
 * Single source of truth for all 2,044 words.
 * Reads from public/words.json — no chained imports, no build timeouts.
 *
 * To rebuild words.json after adding words:
 *   npm run words
 */

import wordsData from "@/public/words.json"

export type SpellingWord = {
  word: string
  slug: string
  commentary: string | null
  misspellings: string[]
  dialects: {
    us: string
    uk: string
    ca: string
    au: string
    nz: string
  } | null
  tip: string | null
  example: string | null
  difficulty: "easy" | "medium" | "hard" | null
  monthlySearches: string | null
  hasFullData: boolean
  hasCommentary: boolean
}

export const WORDS: SpellingWord[] = wordsData.words as SpellingWord[]
export const TOTAL_WORDS: number = wordsData.totalWords

// ── Lookups ───────────────────────────────────────────────────────────────────

export function getWordBySlug(slug: string): SpellingWord | undefined {
  const normalized = slug.toLowerCase().replace(/[' ]/g, "-")
  return WORDS.find((w) => w.slug === normalized)
}

export function getAllSlugs(): string[] {
  return WORDS.map((w) => w.slug)
}

// Related words for internal linking — deterministic, hash-based
export function getRelatedWords(word: string, count = 4): SpellingWord[] {
  const filtered = WORDS.filter(
    (w) => w.word.toLowerCase() !== word.toLowerCase() && w.hasFullData
  )
  const hash = word.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const start = hash % Math.max(filtered.length - count, 1)
  return filtered.slice(start, start + count)
}

export function getRelatedCommentaryWords(word: string, count = 4): SpellingWord[] {
  const filtered = WORDS.filter(
    (w) => w.word.toLowerCase() !== word.toLowerCase() && w.hasCommentary
  )
  const hash = word.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const start = hash % Math.max(filtered.length - count, 1)
  return filtered.slice(start, start + count)
}

// Homepage word list — words with full data, sorted alphabetically
export function getWordList(): SpellingWord[] {
  return WORDS.filter((w) => w.hasFullData).sort((a, b) =>
    a.word.localeCompare(b.word)
  )
}
