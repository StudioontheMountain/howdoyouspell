import { notFound } from "next/navigation"
import MoneyBar from "@/components/MoneyBar"
import Link from "next/link"
import type { Metadata } from "next"
import {
  getAllSlugs,
  getWordBySlug,
  getRelatedWords,
  getRelatedCommentaryWords,
} from "@/lib/words-data"

export async function generateStaticParams() {
  const slugs = getAllSlugs()
  console.log(`[build] Generating ${slugs.length} word pages`)
  return slugs.map((slug) => ({ word: slug }))
}

export const dynamic = 'force-static'
export const dynamicParams = false

export async function generateMetadata({
  params,
}: {
  params: Promise<{ word: string }>
}): Promise<Metadata> {
  const { word: slug } = await params
  const entry = getWordBySlug(slug)
  if (!entry) return { title: "Word Not Found" }

  const displayWord = entry.word.charAt(0).toUpperCase() + entry.word.slice(1)
  // Richer title — includes misspelling vs correct spelling pattern for CTR
  const topMisspelling = entry.misspellings?.[0]
  const hint = entry.hint
  const title = hint
    ? `How Do You Spell ${displayWord}? ${hint}`
    : topMisspelling
    ? `${topMisspelling} or ${entry.word}? How to Spell ${displayWord}`
    : `How Do You Spell ${displayWord}? Correct Spelling & Examples`
  const topMiss = entry.misspellings?.[0]
  const description = topMiss
    ? `The correct spelling is "${entry.word}" — not "${topMiss}". ${entry.tip ? entry.tip.slice(0, 80) + ". " : ""}US, UK, Canadian & Australian variants covered.`
    : `How do you spell ${entry.word}? Correct spelling, pronunciation, etymology and dialect differences across US, UK, Canadian and Australian English.`
  const descTrimmed = description.slice(0, 155)

  const keywords = [
    `how do you spell ${entry.word}`,
    `how to spell ${entry.word}`,
    `correct spelling of ${entry.word}`,
    `${entry.word} spelling`,
    ...entry.misspellings,
    ...(entry.misspellings[0] ? [`is it ${entry.misspellings[0]} or ${entry.word}`] : []),
  ]

  return {
    title,
    description: descTrimmed,
    keywords,
    openGraph: {
      title,
      description: descTrimmed,
      url: `https://www.howdoyouspell.app/${entry.slug}/`,
      type: "article",
      images: [{ url: `https://www.howdoyouspell.app/og/${entry.word}.jpg`, width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", title, description: descTrimmed, images: [`https://www.howdoyouspell.app/og/${entry.word}.jpg`] },
    alternates: { canonical: `https://www.howdoyouspell.app/${entry.slug}/` },
  }
}

function JsonLd({ entry }: { entry: NonNullable<ReturnType<typeof getWordBySlug>> }) {
  const displayWord = entry.word.charAt(0).toUpperCase() + entry.word.slice(1)
  const answer = entry.tip ?? entry.commentary?.slice(0, 200) ?? `The correct spelling is "${entry.word}".`

  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "DefinedTerm",
      name: entry.word,
      description: entry.commentary ?? `The correct spelling of "${entry.word}".`,
      url: `https://www.howdoyouspell.app/${entry.slug}/`,
      datePublished: new Date().toISOString().split("T")[0],
      dateModified: new Date().toISOString().split("T")[0],
      inDefinedTermSet: {
        "@type": "DefinedTermSet",
        name: "English Spelling Reference",
        url: "https://www.howdoyouspell.app",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: `How do you spell ${entry.word}?`,
          acceptedAnswer: { "@type": "Answer", text: `The correct spelling is "${entry.word}". ${answer}` },
        },
        ...(entry.misspellings[0]
          ? [{
              "@type": "Question",
              name: `Is it ${entry.misspellings[0]} or ${entry.word}?`,
              acceptedAnswer: { "@type": "Answer", text: `The correct spelling is "${entry.word}", not "${entry.misspellings[0]}". ${answer}` },
            }]
          : []),
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://www.howdoyouspell.app" },
        { "@type": "ListItem", position: 2, name: displayWord, item: `https://www.howdoyouspell.app/${entry.slug}/` },
      ],
    },
  ]

  return (
    <>
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}
    </>
  )
}

export default async function WordPage({ params }: { params: Promise<{ word: string }> }) {
  const { word: slug } = await params
  const entry = getWordBySlug(slug)
  if (!entry) notFound()

  const displayWord = entry.word.charAt(0).toUpperCase() + entry.word.slice(1)
  const related = getRelatedWords(entry.word, 4)
  const relatedCommentary = getRelatedCommentaryWords(entry.word, 4)

  const nav: React.CSSProperties = {
    height: 44, display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "0 clamp(1.25rem, 5vw, 2.5rem)",
    position: "sticky", top: 0, zIndex: 50,
    background: "rgba(245,245,247,0.85)",
    backdropFilter: "saturate(180%) blur(20px)",
    WebkitBackdropFilter: "saturate(180%) blur(20px)",
    borderBottom: "0.5px solid #d2d2d7",
  }

  return (
    <div style={{ minHeight: "100dvh", background: "#f5f5f7" }}>
      <JsonLd entry={entry} />

      {/* Nav */}
      <header style={nav}>
        <Link href="/" style={{ fontWeight: 600, fontSize: "0.9375rem", letterSpacing: "-0.02em", color: "#1d1d1f", textDecoration: "none" }}>
          How Do You Spell
        </Link>
        <Link href="/" style={{ fontSize: "0.8125rem", color: "#6e6e73", textDecoration: "none" }}>
          ← Check another word
        </Link>
      </header>

      <main style={{ maxWidth: 720, margin: "0 auto", padding: "2rem clamp(1.25rem, 6vw, 3rem) 4rem" }}>

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" style={{ marginBottom: "1.25rem" }}>
          <ol style={{ display: "flex", gap: "0.5rem", fontSize: "0.8125rem", color: "#aeaeb2", listStyle: "none", padding: 0, margin: 0 }}>
            <li><Link href="/" style={{ color: "#aeaeb2", textDecoration: "none" }}>Home</Link></li>
            <li>/</li>
            <li style={{ color: "#1d1d1f", fontWeight: 500 }}>{displayWord}</li>
          </ol>
        </nav>

        <article>
          <h1 style={{ fontSize: "clamp(1.75rem, 5vw, 2.5rem)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.08, color: "#1d1d1f", marginBottom: "1.5rem" }}>
            How do you spell {displayWord}?
          </h1>

          {/* Correct spelling hero */}
          <div style={{ background: "#fff", border: "0.5px solid #d2d2d7", borderRadius: 18, padding: "1.5rem", marginBottom: "1rem" }}>
            <p style={{ fontSize: "0.6875rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", color: "#aeaeb2", margin: "0 0 0.25rem" }}>
              Correct spelling
            </p>
            <p style={{ fontSize: "clamp(2rem, 8vw, 3.5rem)", fontWeight: 700, letterSpacing: "-0.04em", color: "#1d1d1f", lineHeight: 1.05, margin: 0 }}>
              {entry.word}
            </p>
            {entry.tip && (
              <p style={{ fontSize: "0.9375rem", color: "#6e6e73", marginTop: "0.375rem", letterSpacing: "-0.01em", margin: "0.375rem 0 0" }}>
                {entry.tip}
              </p>
            )}
          </div>

          {/* Dialect table */}
          {entry.dialects && (
            <div style={{ border: "0.5px solid #ddd8cc", borderRadius: 12, overflow: "hidden", marginBottom: "2rem" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    {["US", "UK", "CA", "AU", "NZ"].map((col) => (
                      <th key={col} style={{ padding: "0.5rem 0.375rem", textAlign: "center", fontSize: "0.625rem", fontWeight: 600, color: "#8a8070", letterSpacing: "0.08em", textTransform: "uppercase", background: "#f5f0e8", borderBottom: "0.5px solid #ddd8cc" }}>
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {(["us", "uk", "ca", "au", "nz"] as const).map((key, i) => {
                      const val = entry.dialects![key]
                      const differs = val !== entry.dialects!.us
                      return (
                        <td key={key} style={{
                          padding: "0.625rem 0.375rem", textAlign: "center",
                          fontWeight: differs ? 700 : 500,
                          fontSize: "0.875rem",
                          color: differs ? "#3a3a3c" : "#6e6e73",
                          background: differs ? "#ede8df" : "#faf8f4",
                          borderRight: i < 4 ? "0.5px solid #ddd8cc" : "none",
                          letterSpacing: differs ? "-0.02em" : "-0.01em",
                        }}>
                          {val}
                        </td>
                      )
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Commentary */}
          {entry.commentary && (
            <section style={{ marginBottom: "2rem" }}>
              <h2 style={{ fontSize: "1.0625rem", fontWeight: 600, letterSpacing: "-0.02em", color: "#1d1d1f", marginBottom: "0.75rem" }}>
                {entry.hasFullData ? `Why is ${entry.word} spelled this way?` : `About the word ${entry.word}`}
              </h2>
              <p style={{ fontSize: "0.9375rem", color: "#3a3a3c", lineHeight: 1.65, letterSpacing: "-0.01em", margin: 0 }}>
                {entry.commentary}
              </p>
            </section>
          )}

          {/* Misspellings */}
          {entry.misspellings.length > 0 && (
            <section style={{ marginBottom: "2rem" }}>
              <h2 style={{ fontSize: "1.0625rem", fontWeight: 600, letterSpacing: "-0.02em", color: "#1d1d1f", marginBottom: "0.75rem" }}>
                Common misspellings of {entry.word}
              </h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {entry.misspellings.map((ms) => (
                  <span key={ms} style={{ padding: "0.25rem 0.75rem", background: "#fff0ee", border: "0.5px solid #ffd0c8", borderRadius: 100, fontSize: "0.875rem", color: "#c0392b", textDecoration: "line-through", textDecorationColor: "#ff3b30" }}>
                    {ms}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Example */}
          {entry.example && (
            <section style={{ marginBottom: "2rem" }}>
              <h2 style={{ fontSize: "1.0625rem", fontWeight: 600, letterSpacing: "-0.02em", color: "#1d1d1f", marginBottom: "0.75rem" }}>
                Example
              </h2>
              <blockquote style={{ borderLeft: "3px solid #34c759", margin: 0, background: "#fff", borderRadius: "0 12px 12px 0", padding: "0.875rem 1.125rem" }}>
                <p style={{ fontSize: "0.9375rem", color: "#3a3a3c", fontStyle: "italic", margin: 0, lineHeight: 1.6 }}>
                  {entry.example}
                </p>
              </blockquote>
            </section>
          )}

          {/* FAQ */}
          <section style={{ marginBottom: "2rem" }}>
            <h2 style={{ fontSize: "1.0625rem", fontWeight: 600, letterSpacing: "-0.02em", color: "#1d1d1f", marginBottom: "0.75rem" }}>
              Frequently asked questions
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {[
                {
                  q: `How do you spell ${entry.word}?`,
                  a: `The correct spelling is "${entry.word}". ${entry.tip ?? entry.commentary?.slice(0, 200) ?? ""}`,
                  open: true,
                },
                ...(entry.misspellings[0]
                  ? [{
                      q: `Is it ${entry.misspellings[0]} or ${entry.word}?`,
                      a: `The correct spelling is "${entry.word}", not "${entry.misspellings[0]}".${entry.monthlySearches ? ` This word gets ${entry.monthlySearches} monthly searches.` : ""}`,
                      open: false,
                    }]
                  : []),
                ...(entry.dialects
                  ? [{
                      q: `Does the spelling differ by country?`,
                      a: `Yes. In US English it's "${entry.dialects.us}", in UK English it's "${entry.dialects.uk}"${entry.dialects.ca !== entry.dialects.uk ? `, and in Canadian English it's "${entry.dialects.ca}"` : `, and Canadian, Australian, and New Zealand English follow the same spelling`}.`,
                      open: false,
                    }]
                  : []),
              ].map(({ q, a, open }) => (
                <details key={q} style={{ border: "0.5px solid #d2d2d7", borderRadius: 12, overflow: "hidden", background: "#fff" }} {...(open ? { open: true } : {})}>
                  <summary style={{ padding: "1rem", fontWeight: 500, fontSize: "0.9375rem", cursor: "pointer", color: "#1d1d1f", letterSpacing: "-0.01em", listStyle: "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    {q}
                    <span style={{ color: "#aeaeb2", fontSize: "1.25rem", lineHeight: 1 }}>+</span>
                  </summary>
                  <div style={{ padding: "0 1rem 1rem", fontSize: "0.875rem", color: "#6e6e73", lineHeight: 1.6 }}>
                    {a}
                  </div>
                </details>
              ))}
            </div>
          </section>

          {/* Related words */}
          {related.length > 0 && (
            <section style={{ marginBottom: "2rem" }}>
              <h2 style={{ fontSize: "1.0625rem", fontWeight: 600, letterSpacing: "-0.02em", color: "#1d1d1f", marginBottom: "0.75rem" }}>
                Other commonly misspelled words
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                {related.map((r) => (
                  <Link key={r.slug} href={`/${r.slug}/`} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.875rem 1rem", background: "#fff", border: "0.5px solid #d2d2d7", borderRadius: 12, textDecoration: "none", fontSize: "0.9375rem", fontWeight: 500, color: "#1d1d1f", letterSpacing: "-0.01em" }}>
                    {r.word} <span style={{ color: "#aeaeb2" }}>→</span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Related commentary */}
          {relatedCommentary.length > 0 && (
            <section style={{ marginBottom: "2rem" }}>
              <h2 style={{ fontSize: "1.0625rem", fontWeight: 600, letterSpacing: "-0.02em", color: "#1d1d1f", marginBottom: "0.75rem" }}>
                More spelling guides
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                {relatedCommentary.map((r) => (
                  <Link key={r.slug} href={`/${r.slug}/`} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.875rem 1rem", background: "#fff", border: "0.5px solid #d2d2d7", borderRadius: 12, textDecoration: "none", fontSize: "0.9375rem", fontWeight: 500, color: "#1d1d1f", letterSpacing: "-0.01em" }}>
                    {r.word} <span style={{ color: "#aeaeb2" }}>→</span>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </article>
      </main>

      <MoneyBar />
      <footer style={{ borderTop: "0.5px solid #d2d2d7", background: "#fff", padding: "1.25rem clamp(1.25rem, 5vw, 2.5rem)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
        <p style={{ fontSize: "0.6875rem", color: "#aeaeb2", margin: 0 }}>
          This page may contain affiliate links. © {new Date().getFullYear()} How Do You Spell
        </p>
        <nav style={{ display: "flex", gap: "1.5rem" }}>
          {["About", "Privacy", "Contact", "Affiliate Disclosure"].map((label) => (
            <Link key={label} href={`/${label.toLowerCase().replace(/ /g, "-")}`} style={{ fontSize: "0.6875rem", color: "#aeaeb2", textDecoration: "none" }}>
              {label}
            </Link>
          ))}
        </nav>
      </footer>
      {/* Cross-promotion */}
      <div style={{ background: "#f5f0e8", borderTop: "0.5px solid #e5e0d5", padding: "1rem clamp(1.25rem, 5vw, 4rem)", textAlign: "center" }}>
        <p style={{ margin: 0, fontSize: "0.875rem", color: "#6e6e73" }}>
          Looking up financial terms?{" "}
          <a href="https://www.moneyterms.app" style={{ color: "#a07830", textDecoration: "none", fontWeight: 600 }}>
            MoneyTerms.app →
          </a>
          {" "}— plain-English definitions for every money term you'll encounter.
        </p>
      </div>
    </div>
  )
}
