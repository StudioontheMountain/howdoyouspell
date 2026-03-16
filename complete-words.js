const fs = require('fs')
const path = require('path')

const envContent = fs.readFileSync('/Users/Frank/Desktop/claude/howdoyouspell/.env.local', 'utf-8')
const ANTHROPIC_API_KEY = envContent.match(/ANTHROPIC_API_KEY=(.+)/)[1].trim()
const WORDS_PATH = path.join(__dirname, 'public', 'words.json')
const BATCH_SIZE = 10
const DELAY_MS = 500

async function completeWord(word) {
  const prompt = `You are a linguistics expert. Complete this English word entry for a spelling reference site.

Word: "${word.word}"
Existing commentary: "${word.commentary || ''}"

Provide ONLY a JSON object with these fields:
{
  "misspellings": ["2-4 common misspellings people actually make"],
  "tip": "A short memorable tip to spell it correctly (max 15 words, etymology-based if possible)",
  "example": "A natural example sentence using the word",
  "difficulty": "easy|medium|hard",
  "dialects": null or {"us": "spelling", "uk": "spelling", "ie": "spelling", "ca": "spelling", "au": "spelling", "nz": "spelling"} only if spellings differ by dialect
}

Rules:
- misspellings must be actual common mistakes, not random typos
- If no dialect differences exist, set dialects to null
- tip should be punchy and memorable
- Do not include markdown or backticks`

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  const data = await res.json()
  const text = data.content[0].text.trim()
  return JSON.parse(text)
}

async function main() {
  const data = JSON.parse(fs.readFileSync(WORDS_PATH, 'utf-8'))
  const incomplete = data.words.filter(w => !w.hasFullData)
  
  console.log(`Found ${incomplete.length} incomplete words`)
  console.log('Starting completion...\n')

  let completed = 0
  let failed = 0

  for (let i = 0; i < incomplete.length; i++) {
    const word = incomplete[i]
    try {
      const completion = await completeWord(word)
      
      // Find and update the word in the full array
      const idx = data.words.findIndex(w => w.slug === word.slug)
      data.words[idx] = {
        ...data.words[idx],
        misspellings: completion.misspellings || [],
        tip: completion.tip || null,
        example: completion.example || null,
        difficulty: completion.difficulty || null,
        dialects: completion.dialects || null,
        hasFullData: true,
      }

      completed++
      if (completed % 10 === 0) {
        fs.writeFileSync(WORDS_PATH, JSON.stringify(data, null, 2))
        console.log(`Progress: ${completed}/${incomplete.length} completed, ${failed} failed`)
      }
    } catch (e) {
      failed++
      console.error(`Failed: ${word.word} — ${e.message}`)
    }

    // Delay to avoid rate limits
    await new Promise(r => setTimeout(r, DELAY_MS))
  }

  // Final save
  fs.writeFileSync(WORDS_PATH, JSON.stringify(data, null, 2))
  console.log(`\nDone! ${completed} completed, ${failed} failed`)
}

main().catch(e => {
  console.error('Fatal error:', e)
  process.exit(1)
})
