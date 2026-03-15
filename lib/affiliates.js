const AFFILIATES = [
  { phrases: ["grammar", "grammar check", "grammatical"], label: "Check your grammar instantly", url: "https://www.grammarly.com/?utm_source=howdoyouspell" },
  { phrases: ["writing", "write better", "writing skills"], label: "Improve your writing today", url: "https://www.grammarly.com/?utm_source=howdoyouspell" },
  { phrases: ["spelling", "spell check", "misspelling"], label: "Never misspell a word again", url: "https://www.grammarly.com/?utm_source=howdoyouspell" },
  { phrases: ["vocabulary", "word choice", "synonyms"], label: "Expand your vocabulary", url: "https://www.merriam-webster.com/?utm_source=howdoyouspell" },
  { phrases: ["english", "english language", "learn english"], label: "Master the English language", url: "https://www.duolingo.com/?utm_source=howdoyouspell" },
  { phrases: ["punctuation", "comma", "apostrophe", "semicolon"], label: "Master punctuation rules", url: "https://www.grammarly.com/?utm_source=howdoyouspell" },
  { phrases: ["essay", "academic writing", "thesis"], label: "Write better essays instantly", url: "https://www.grammarly.com/?utm_source=howdoyouspell" },
  { phrases: ["british", "american english", "dialect", "uk english"], label: "Explore English dialect differences", url: "https://www.merriam-webster.com/?utm_source=howdoyouspell" },
  { phrases: ["pronunciation", "pronounce", "phonetic"], label: "Look up pronunciations", url: "https://www.merriam-webster.com/?utm_source=howdoyouspell" },
  { phrases: ["etymology", "word origin", "history of"], label: "Discover word origins", url: "https://www.etymonline.com/?utm_source=howdoyouspell" },
]

const DEFAULT_AFFILIATE = {
  label: "Write with confidence — try Grammarly free",
  url: "https://www.grammarly.com/?utm_source=howdoyouspell"
}

function matchAffiliate(text) {
  const lower = text.toLowerCase()
  for (const affiliate of AFFILIATES) {
    for (const phrase of affiliate.phrases) {
      if (lower.includes(phrase)) {
        return { label: affiliate.label, url: affiliate.url }
      }
    }
  }
  return DEFAULT_AFFILIATE
}

module.exports = { AFFILIATES, DEFAULT_AFFILIATE, matchAffiliate }
