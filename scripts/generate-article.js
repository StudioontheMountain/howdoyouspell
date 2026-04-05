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
async function generateArticle(headlines, attempt = 1) {
  const prompt = `You are a sharp, opinionated journalist covering the English language for everyday Americans. Write like Hunter Thompson — direct, urgent, occasionally sardonic, always clear. No academic tone. No corporate speak.

Here are today's top English language news headlines:
${headlines}

Pick the single most interesting headline for people who care about words, spelling, and language. Write a 200-word original article about it aimed at English-speaking American readers.

Rules:
- Do NOT quote or reproduce any content from the source articles
- Do NOT use bullet points, numbered lists, or key takeaways
- Do NOT ask questions or use interrogative sentences
- Do not use the word "dictionary" or "glossary"
- Write in flowing prose only — no lists, no headers within the body
- Do NOT use these phrases: "It's worth noting that", "In conclusion", "Delve into", "It is important to note", "In the ever-evolving", "Navigating the complexities", "In today's fast-paced world", "At the end of the day", "Game-changer", "Shed light on", "In summary", "Unlock the potential", "Dive deep into", "Robust", "Seamlessly", "Cutting-edge", "Transformative", "In the realm of", "It goes without saying", "Comprehensive", "Streamline", "Holistic approach", "Moving forward", "Honestly", "Key takeaway", "Leverage", "Moreover", "Furthermore", "Additionally", "Notably", "Importantly", "Interestingly", "Crucially", "It's clear that", "One could argue", "It remains to be seen", "Time will tell", "Only time will tell", "Particularly", "Especially", "Significantly", "Remarkably", "Undeniably", "Undoubtedly", "Landscape", "Ecosystem", "Paradigm", "Framework", "Stakeholders", "Intersection of", "At the forefront", "Double-edged sword", "A testament to", "It's worth mentioning", "That being said", "With that said", "Make no mistake", "The bottom line is", "Here's the thing", "Let's be clear", "To be sure", "Rest assured"

Respond with ONLY a JSON object (no markdown, no backticks):
{"title": "Your Article Title", "body": "The full 200-word article text"}`
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
      system: "You are a JSON API. You output only raw valid JSON with no markdown, no backticks, no commentary. Never use double quotes inside string values.",
      messages: [{ role: "user", content: prompt }],
    }),
  })

  const data = await res.json()
  if (!data.content) throw new Error("Unexpected API response: " + JSON.stringify(data))

  let text = data.content[0].text.trim()

  // Strip markdown code fences if present
  text = text.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim()

  // Find the outermost JSON object only
  const start = text.indexOf("{")
  const end = text.lastIndexOf("}")
  if (start === -1 || end === -1) {
    if (attempt < 3) {
      console.log(`Attempt ${attempt} failed to find JSON, retrying...`)
      return generateArticle(headlines, attempt + 1)
    }
    throw new Error("No JSON object found after 3 attempts: " + text.slice(0, 200))
  }

  const jsonStr = text.slice(start, end + 1)
  try {
    return JSON.parse(jsonStr)
  } catch (e) {
    if (attempt < 3) {
      console.log(`Attempt ${attempt} JSON parse failed, retrying...`)
      return generateArticle(headlines, attempt + 1)
    }
    throw new Error("JSON parse failed after 3 attempts: " + jsonStr.slice(0, 200))
  }
}
function slugify(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80)
}
async function main() {
  console.log("Fetching English language news headlines...")
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
