import { notFound } from "next/navigation"
import Link from "next/link"
import type { Metadata } from "next"
import articles from "@/public/articles.json"
import { WORDS } from "@/lib/words-data"
import AffiliateBar from "@/components/AffiliateBar"
import { DEFAULT_AFFILIATE } from "@/lib/affiliates"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return (articles as any[]).map(a => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = (articles as any[]).find(a => a.slug === slug)
  if (!article) return {}
  return {
    title: `${article.title} | HowDoYouSpell`,
    description: article.body.slice(0, 155) + "...",
    alternates: { canonical: `https://www.howdoyouspell.app/articles/${slug}` },
    openGraph: {
      title: article.title,
      description: article.body.slice(0, 155) + "...",
      url: `https://www.howdoyouspell.app/articles/${slug}`,
      type: "article",
      publishedTime: article.date,
    },
  }
}


function LinkedBody({ text }: { text: string }) {
  const termMap = new Map(WORDS.map((w: any) => [w.word.toLowerCase(), w.slug]))
  const sortedTerms = [...termMap.keys()].sort((a, b) => b.length - a.length)
  const paragraphs = text.split("\n")

  return (
    <div style={{ fontSize: "1rem", color: "#3a3a3c", lineHeight: 1.8, letterSpacing: "-0.01em" }}>
      {paragraphs.map((p: string, i: number) => {
        if (!p.trim()) return null
        const linked = new Set<string>()
        let result = p
        const replacements: { placeholder: string; jsx: string }[] = []

        for (const term of sortedTerms) {
          if (linked.size >= 3) break
          const regex = new RegExp(`\\b(${term.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\\\export default async function ArticlePage")})\\b`, "i")
          const match = result.match(regex)
          if (match && !linked.has(term)) {
            const slug = termMap.get(term)
            const placeholder = `__LINK_${linked.size}__`
            replacements.push({ placeholder, jsx: `<a href="/${slug}/" style="color:#1a5276;textDecoration:underline;textUnderlineOffset:2px">${match[0]}</a>` })
            result = result.replace(regex, placeholder)
            linked.add(term)
          }
        }

        return <p key={i} style={{ margin: "0 0 1rem" }} dangerouslySetInnerHTML={{ __html: replacements.reduce((s, r) => s.replace(r.placeholder, r.jsx), result) }} />
      })}
    </div>
  )
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const article = (articles as any[]).find(a => a.slug === slug)
  if (!article) notFound()

  const ctaLabel = article.ctaLabel || DEFAULT_AFFILIATE.label
  const ctaUrl = article.ctaUrl || DEFAULT_AFFILIATE.url

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": article.title,
    "datePublished": article.date,
    "dateModified": article.date,
    "author": { "@type": "Organization", "name": "HowDoYouSpell", "url": "https://www.howdoyouspell.app" },
    "publisher": { "@type": "Organization", "name": "HowDoYouSpell", "url": "https://www.howdoyouspell.app" },
    "mainEntityOfPage": { "@type": "WebPage", "@id": `https://www.howdoyouspell.app/articles/${slug}` },
    "description": article.body.slice(0, 155) + "...",
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", minHeight: "100vh", background: "#f5f5f7" }}>
        <nav style={{ background: "#f5f5f7", borderBottom: "0.5px solid #d2d2d7", padding: "0.875rem clamp(1.25rem, 5vw, 4rem)" }}>
          <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Link href="/" style={{ textDecoration: "none", fontSize: "1rem", fontWeight: 700, letterSpacing: "-0.02em", color: "#1d1d1f" }}>
              HowDoYouSpell
            </Link>
            <Link href="/" style={{ color: "#34c759", textDecoration: "none", fontSize: "0.875rem", fontWeight: 500 }}>{"<-"} Home</Link>
          </div>
        </nav>
        <main style={{ maxWidth: 720, margin: "0 auto", padding: "2.5rem clamp(1.25rem, 5vw, 4rem) 6rem" }}>
          <div style={{ fontSize: "0.8125rem", color: "#5a6d7e", marginBottom: "0.5rem" }}>
            {new Date(article.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
          </div>
          <h1 style={{ margin: "0 0 1.5rem", fontSize: "clamp(1.5rem, 4vw, 2.25rem)", fontWeight: 800, letterSpacing: "-0.04em", color: "#1d1d1f", lineHeight: 1.2 }}>
            {article.title}
          </h1>
          <LinkedBody text={article.body} />
        </main>
        <AffiliateBar ctaLabel={ctaLabel} ctaUrl={ctaUrl} />
        <footer style={{ borderTop: "0.5px solid #d2d2d7", background: "#f5f5f7", padding: "1.25rem clamp(1.25rem, 5vw, 2.5rem) 5rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
          <p style={{ fontSize: "0.6875rem", color: "#6e6e73", margin: 0 }}>© {new Date().getFullYear()} HowDoYouSpell</p>
          <nav style={{ display: "flex", gap: "1.5rem" }}>
            {["About", "Privacy", "Terms", "Data Use", "Affiliate Disclosure", "Contact"].map(label => (
              <Link key={label} href={`/${label.toLowerCase().replace(/ /g, "-")}/`} style={{ fontSize: "0.6875rem", color: "#6e6e73", textDecoration: "none" }}>{label}</Link>
            ))}
          </nav>
        </footer>
      </div>
    </>
  )
}
