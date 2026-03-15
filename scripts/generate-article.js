const fs = require("fs")
const path = require("path")

const NEWS_API_KEY = process.env.NEWS_API_KEY || "dab4fe54a33c435583c832bad6682fcc"
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY
const TOPIC = "English language"
const SITE_NAME = "HowDoYouSpell.app"
const ARTICLES_PATH = path.join(__dirname, "..", "public", "articles.json")

async function fetchNews() {
  const url = `https://newsapi.org/v2/everything?q=${TOPIC}&language=en&sortBy=publishedAt&pageSize=5&apiKey=${NEWS_API_KEY}`
  const res = await fetch(url)
  const data = await res.json()
  if (!data.articles || data.articles.length === 0) {
    throw new Error("No news articles found")
  }
  return data.articles.map(a => a.title).join("\n")
}

async function generateArticle(headlines) {
  const prompt = `You are an English language and spelling expert writing for ${SITE_NAME}.

Here are today's top insurance news headlines:
${headlines}

Pick the single most interesting headline for people who care about language, writing, and communication. Write a 250-word original article about it. Focus on why this matters to anyone who writes, reads, or communicates in English, and what they should know or do.

Rules:
- Do NOT quote or reproduce any content from the source articles
- Write in a clear, conversational tone
- Include specific actionable advice where possible
- Do not use the word "dictionary" or "glossary"

Respond with ONLY a JSON object (no markdown, no backticks):
{"title": "Your Article Title", "body": "The full 250-word article text"}`

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
    }),
  })

  const data = await res.json()
  const text = data.content[0].text.trim()
  return JSON.parse(text)
}

function slugify(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80)
}

async function main() {
  console.log("Fetching insurance news headlines...")
  const headlines = await fetchNews()
  console.log("Headlines:\n" + headlines)

  console.log("\nGenerating article...")
  const article = await generateArticle(headlines)

  const entry = {
    title: article.title,
    slug: slugify(article.title),
    date: new Date().toISOString().split("T")[0],
    body: article.body,
  }

  const existing = JSON.parse(fs.readFileSync(ARTICLES_PATH, "utf-8"))
  existing.unshift(entry)
  fs.writeFileSync(ARTICLES_PATH, JSON.stringify(existing, null, 2))

  console.log(`\nArticle saved: "${entry.title}"`)
  console.log(`Slug: ${entry.slug}`)
  console.log(`Total articles: ${existing.length}`)
}

main().catch(e => {
  console.error("Error:", e.message)
  process.exit(1)
})
