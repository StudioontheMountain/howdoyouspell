"use client"
import Link from "next/link"

const STYLES = {
  cardBg: "#fff",
  cardBorder: "#cdd8e4",
  titleColor: "#1d1d1f",
  dateColor: "#5a6d7e",
  bodyColor: "#3a3a3c",
  accentColor: "#1a5276",
  sectionTitle: "Latest Articles",
  cardHeight: 220,
  cardRadius: 12,
}

interface Article {
  title: string
  slug: string
  date: string
  body: string
}

export function ArticleCard({ article }: { article: Article }) {
  return (
    <Link href={`/articles/${article.slug}`} style={{ textDecoration: "none" }}>
      <div style={{
        background: STYLES.cardBg,
        border: `0.5px solid ${STYLES.cardBorder}`,
        borderRadius: STYLES.cardRadius,
        padding: "1.125rem 1.25rem",
        height: STYLES.cardHeight,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
      }}>
        <div style={{ fontSize: "0.6875rem", color: STYLES.dateColor, marginBottom: "0.375rem" }}>
          {new Date(article.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </div>
        <div style={{ fontWeight: 700, color: STYLES.titleColor, fontSize: "0.9375rem", letterSpacing: "-0.01em", marginBottom: "0.5rem", lineHeight: 1.3 }}>
          {article.title}
        </div>
        <div style={{
          flex: 1,
          overflow: "auto",
          fontSize: "0.8125rem",
          color: STYLES.bodyColor,
          lineHeight: 1.6,
          WebkitOverflowScrolling: "touch",
        }}>
          {article.body}
        </div>
      </div>
    </Link>
  )
}

export function FeaturedArticleCard({ article }: { article: Article }) {
  return (
    <Link href={`/articles/${article.slug}`} style={{ textDecoration: "none" }}>
      <div style={{
        background: STYLES.cardBg,
        border: `0.5px solid ${STYLES.cardBorder}`,
        borderRadius: STYLES.cardRadius,
        padding: "1.125rem 1.25rem",
        minHeight: STYLES.cardHeight / 2,
        overflow: "hidden",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: "1.25rem",
        cursor: "pointer",
      }}>
        <div style={{ fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: STYLES.accentColor, whiteSpace: "nowrap" }}>
          Featured
        </div>
        <div style={{ width: "0.5px", background: STYLES.cardBorder, alignSelf: "stretch" }} />
        <div style={{ flex: 1, overflow: "hidden" }}>
          <div style={{ fontSize: "0.6875rem", color: STYLES.dateColor, marginBottom: "0.25rem" }}>
            {new Date(article.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </div>
          <div style={{ fontWeight: 700, color: STYLES.titleColor, fontSize: "0.9375rem", letterSpacing: "-0.01em", lineHeight: 1.3, marginBottom: "0.25rem" }}>
            {article.title}
          </div>
          <div style={{ fontSize: "0.8125rem", color: STYLES.bodyColor, lineHeight: 1.5, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
            {article.body}
          </div>
        </div>
      </div>
    </Link>
  )
}

export function ArticlesSection({ articles }: { articles: Article[] }) {
  if (!articles || articles.length === 0) return null
  const [featured, ...rest] = articles
  const recent = rest.slice(0, 2)
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 clamp(1.25rem, 5vw, 4rem) 2rem" }}>
      <h2 style={{ fontSize: "1.125rem", fontWeight: 700, color: STYLES.titleColor, letterSpacing: "-0.02em", marginBottom: "0.75rem" }}>
        {STYLES.sectionTitle}
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {featured && <FeaturedArticleCard article={featured} />}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.75rem" }}>
          {recent.map(a => <ArticleCard key={a.slug} article={a} />)}
        </div>
      </div>
    </div>
  )
}
