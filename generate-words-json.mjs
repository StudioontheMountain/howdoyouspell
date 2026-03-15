/**
 * generate-words-json.mjs
 *
 * Run this any time you add words to either data source:
 *   npm run words
 *
 * Output: public/words.json
 */

import { readFileSync, writeFileSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))

function extractCommentary(filePath) {
  const text = readFileSync(filePath, "utf8")
  const pairs = {}
  const regex = /"([^"]+)":\s*"((?:[^"\\]|\\.)*)"/g
  let m
  while ((m = regex.exec(text)) !== null) {
    const word = m[1].toLowerCase()
    const commentary = m[2]
      .replace(/\\"/g, '"')
      .replace(/\\n/g, "\n")
      .replace(/\\\\/g, "\\")
    pairs[word] = { word: m[1], commentary }
  }
  return pairs
}

const commentaryFiles = [
  "lib/word-commentary.ts",
  "lib/word-commentary-2.ts",
  "lib/word-commentary-3.ts",
  "lib/word-commentary-4.ts",
  "lib/word-commentary-5.ts",
  "lib/word-commentary-6.ts",
  "lib/word-commentary-7.ts",
  "lib/word-commentary-8.ts",
  "lib/word-commentary-9.ts",
  "lib/word-commentary-10.ts",
  "lib/word-commentary-11.ts",
  "lib/word-commentary-12.ts",
  "lib/word-commentary-13.ts",
  "lib/word-commentary-14.ts",
]

const allCommentary = {}
for (const file of commentaryFiles) {
  const entries = extractCommentary(join(__dirname, file))
  Object.assign(allCommentary, entries)
}
console.log(`✓ Commentary words loaded: ${Object.keys(allCommentary).length}`)

const spellingText = readFileSync(join(__dirname, "lib/spelling-data.ts"), "utf8")
const entryPattern =
  /\{\s*word:\s*"([^"]+)",\s*misspellings:\s*\[([^\]]*)\],\s*dialects:\s*(null|\{[^}]+\}),\s*tip:\s*"((?:[^"\\]|\\.)*)",\s*example:\s*"((?:[^"\\]|\\.)*)",\s*difficulty:\s*"(easy|medium|hard)",\s*monthlySearches:\s*"([^"]+)"/gs

const spellingEntries = {}
let match
while ((match = entryPattern.exec(spellingText)) !== null) {
  const word = match[1]
  const misspellings = [...match[2].matchAll(/"([^"]+)"/g)].map((m) => m[1])
  const dialectsRaw = match[3]
  const tip = match[4].replace(/\\"/g, '"')
  const example = match[5].replace(/\\"/g, '"')
  const difficulty = match[6]
  const monthlySearches = match[7]

  let dialects = null
  if (dialectsRaw !== "null") {
    const pairs = [...dialectsRaw.matchAll(/(\w+):\s*"([^"]+)"/g)]
    dialects = Object.fromEntries(pairs.map((m) => [m[1], m[2]]))
    if (!dialects.ca) dialects.ca = dialects.uk || word
  }

  spellingEntries[word.toLowerCase()] = {
    word, misspellings, dialects, tip, example, difficulty, monthlySearches,
  }
}
console.log(`✓ Spelling entries loaded: ${Object.keys(spellingEntries).length}`)

const allKeys = new Set([
  ...Object.keys(allCommentary),
  ...Object.keys(spellingEntries),
])

const merged = []
for (const key of [...allKeys].sort()) {
  const spelling = spellingEntries[key]
  const commentary = allCommentary[key]
  merged.push({
    word: spelling?.word ?? commentary?.word,
    slug: key.replace(/[' ]/g, "-"),
    commentary: commentary?.commentary ?? null,
    misspellings: spelling?.misspellings ?? [],
    dialects: spelling?.dialects ?? null,
    tip: spelling?.tip ?? null,
    example: spelling?.example ?? null,
    difficulty: spelling?.difficulty ?? null,
    monthlySearches: spelling?.monthlySearches ?? null,
    hasFullData: !!spelling,
    hasCommentary: !!commentary,
  })
}

const output = {
  generated: new Date().toISOString().split("T")[0],
  totalWords: merged.length,
  words: merged,
}

const outPath = join(__dirname, "public/words.json")
writeFileSync(outPath, JSON.stringify(output, null, 2), "utf8")

console.log(`\n✓ public/words.json written`)
console.log(`  Total words: ${merged.length}`)
console.log(`  Full data + commentary: ${merged.filter((w) => w.hasFullData && w.hasCommentary).length}`)
console.log(`  Commentary only:        ${merged.filter((w) => !w.hasFullData && w.hasCommentary).length}`)
console.log(`  Spelling data only:     ${merged.filter((w) => w.hasFullData && !w.hasCommentary).length}`)
