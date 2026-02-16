import { SPELLING_WORDS } from "@/lib/spelling-data"
import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const words = SPELLING_WORDS.map((entry) => ({
    url: `https://howdoyouspell.app/${entry.word.toLowerCase().replace(/[' ]/g, "-")}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }))

  return [
    {
      url: "https://howdoyouspell.app",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...words,
  ]
}
