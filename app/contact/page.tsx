import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Contact Us | HowDoYouSpell",
  description: "Get in touch with the HowDoYouSpell team for questions, suggestions, or feedback.",
  alternates: { canonical: "https://www.howdoyouspell.app/contact" },
}

export default function ContactPage() {
  return (
    <div style={{ fontFamily: "-apple-system, sans-serif", minHeight: "100vh", background: "#f5f5f7" }}>
      <nav style={{ background: "#f5f5f7", borderBottom: "0.5px solid #d2d2d7", padding: "0.875rem clamp(1.25rem, 5vw, 4rem)" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ textDecoration: "none", fontSize: "1rem", fontWeight: 700, color: "#1d1d1f" }}>HowDoYouSpell</Link>
          <Link href="/" style={{ color: "#34c759", textDecoration: "none", fontSize: "0.875rem", fontWeight: 500 }}>{"<- Back home"}</Link>
        </div>
      </nav>
      <main style={{ maxWidth: 720, margin: "0 auto", padding: "2.5rem clamp(1.25rem, 5vw, 4rem) 4rem" }}>
        <h1 style={{ margin: "0 0 1rem", fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 800, letterSpacing: "-0.04em", color: "#1d1d1f" }}>Contact Us</h1>
        <p style={{ margin: "0 0 1.5rem", fontSize: "0.9375rem", color: "#3a3a3c", lineHeight: 1.7 }}>Have a question, spotted a spelling error, or want to suggest a word? We would love to hear from you.</p>
        <div style={{ background: "#fff", borderRadius: 12, padding: "1.25rem 1.5rem", border: "0.5px solid #d2d2d7", marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1.125rem", fontWeight: 700, color: "#1d1d1f", marginTop: 0, marginBottom: "0.5rem" }}>Email Us</h2>
          <p style={{ fontSize: "0.9375rem", color: "#3a3a3c", lineHeight: 1.6, margin: "0 0 0.75rem" }}>The best way to reach us is by email:</p>
          <a href="mailto:support@studioonthemountain.com" style={{ color: "#34c759", fontSize: "1.125rem", fontWeight: 600 }}>support@studioonthemountain.com</a>
        </div>
        <p style={{ fontSize: "0.8125rem", color: "#6e6e73", lineHeight: 1.6 }}>We typically respond within 1-2 business days. HowDoYouSpell is built and maintained by <a href="https://studioonthemountain.com" target="_blank" rel="noopener noreferrer" style={{ color: "#34c759" }}>Studio on the Mountain</a>.</p>
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
