import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "About HowDoYouSpell | Instant Spelling Checker",
  description: "HowDoYouSpell is a free spelling reference with 2,200+ words, etymology, memory tips, and dialect differences across US, UK, Canadian, Australian, and New Zealand English.",
  alternates: { canonical: "https://www.howdoyouspell.app/about" },
}

export default function About() {
  return (
    <div style={{ fontFamily: '-apple-system, "SF Pro Text", "Helvetica Neue", sans-serif', minHeight: "100vh", background: "#f5f5f7" }}>
      <nav style={{ background: "#f5f5f7", borderBottom: "0.5px solid #d2d2d7", padding: "0.875rem clamp(1.25rem, 5vw, 4rem)" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ textDecoration: "none", fontSize: "1rem", fontWeight: 700, letterSpacing: "-0.02em", color: "#1d1d1f" }}>
            HowDoYouSpell
          </Link>
          <Link href="/" style={{ color: "#34c759", textDecoration: "none", fontSize: "0.875rem", fontWeight: 500 }}>Back home</Link>
        </div>
      </nav>
      <main style={{ maxWidth: 720, margin: "0 auto", padding: "2.5rem clamp(1.25rem, 5vw, 4rem) 4rem" }}>
        <h1 style={{ margin: "0 0 1rem", fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 800, letterSpacing: "-0.04em", color: "#1d1d1f" }}>About HowDoYouSpell</h1>
        <p style={{ margin: "0 0 1rem", fontSize: "0.9375rem", color: "#3a3a3c", lineHeight: 1.7 }}>HowDoYouSpell is a free spelling reference built for anyone who has ever second-guessed themselves mid-sentence.</p>
        <h2 style={{ margin: "2rem 0 0.5rem", fontSize: "1.125rem", fontWeight: 700, color: "#1d1d1f" }}>Our Mission</h2>
        <p style={{ margin: "0 0 1rem", fontSize: "0.9375rem", color: "#3a3a3c", lineHeight: 1.7 }}>Spelling is one of those skills that never stops mattering. HowDoYouSpell exists to give you an instant, authoritative answer — with the etymology and memory tips to make it stick.</p>
        <h2 style={{ margin: "2rem 0 0.5rem", fontSize: "1.125rem", fontWeight: 700, color: "#1d1d1f" }}>What We Cover</h2>
        <p style={{ margin: "0 0 1rem", fontSize: "0.9375rem", color: "#3a3a3c", lineHeight: 1.7 }}>Over 2,200 commonly misspelled and tricky words, with dialect differences across US, UK, Canadian, Australian, and New Zealand English. Each entry includes common misspellings, a memory tip, and an example sentence.</p>
        <h2 style={{ margin: "2rem 0 0.5rem", fontSize: "1.125rem", fontWeight: 700, color: "#1d1d1f" }}>Who We Are</h2>
        <p style={{ margin: "0 0 1rem", fontSize: "0.9375rem", color: "#3a3a3c", lineHeight: 1.7 }}>HowDoYouSpell is built and maintained by Studio on the Mountain, an independent software studio. We are not affiliated with any publisher, dictionary, or academic institution.</p>
        <h2 style={{ margin: "2rem 0 0.5rem", fontSize: "1.125rem", fontWeight: 700, color: "#1d1d1f" }}>Contact</h2>
        <p style={{ margin: "0 0 1rem", fontSize: "0.9375rem", color: "#3a3a3c", lineHeight: 1.7 }}>For questions or corrections contact us at <a href="mailto:support@studioonthemountain.com" style={{ color: "#34c759" }}>support@studioonthemountain.com</a>.</p>
      </main>
      <footer style={{ borderTop: "0.5px solid #d2d2d7", background: "#f5f5f7", padding: "1.25rem clamp(1.25rem, 5vw, 2.5rem)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
        <p style={{ fontSize: "0.6875rem", color: "#6e6e73", margin: 0 }}>© {new Date().getFullYear()} HowDoYouSpell</p>
        <nav style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
          {["About", "Privacy", "Terms", "Data Use", "Affiliate Disclosure", "Contact", "Support"].map((label) => (
            <Link key={label} href={"/"+label.toLowerCase().replace(/ /g, "-")} style={{ fontSize: "0.6875rem", color: "#6e6e73", textDecoration: "none" }}>{label}</Link>
          ))}
        </nav>
      </footer>
    </div>
  )
}
