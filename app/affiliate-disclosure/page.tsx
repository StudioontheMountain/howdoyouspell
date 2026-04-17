import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Affiliate Disclosure | How Do You Spell",
  description: "How Do You Spell affiliate disclosure — how we earn money through affiliate partnerships.",
  robots: { index: true, follow: true },
}

export default function AffiliateDisclosure() {
  return (
    <div style={{ minHeight: "100dvh", background: "#f5f5f7" }}>
      <header style={{ height: 44, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 clamp(1.25rem, 5vw, 2.5rem)", position: "sticky", top: 0, zIndex: 50, background: "rgba(245,245,247,0.85)", backdropFilter: "saturate(180%) blur(20px)", WebkitBackdropFilter: "saturate(180%) blur(20px)", borderBottom: "0.5px solid #d2d2d7" }}>
        <Link href="/" style={{ fontWeight: 600, fontSize: "0.9375rem", letterSpacing: "-0.02em", color: "#1d1d1f", textDecoration: "none" }}>How Do You Spell</Link>
        <Link href="/" style={{ fontSize: "0.8125rem", color: "#6e6e73", textDecoration: "none" }}>← Back home</Link>
      </header>

      <main style={{ maxWidth: 720, margin: "0 auto", padding: "2.5rem clamp(1.25rem, 6vw, 3rem) 5rem" }}>
        <nav aria-label="Breadcrumb" style={{ marginBottom: "1.5rem" }}>
          <ol style={{ display: "flex", gap: "0.5rem", fontSize: "0.8125rem", color: "#aeaeb2", listStyle: "none", padding: 0, margin: 0 }}>
            <li><Link href="/" style={{ color: "#aeaeb2", textDecoration: "none" }}>Home</Link></li>
            <li>/</li>
            <li style={{ color: "#1d1d1f", fontWeight: 500 }}>Affiliate Disclosure</li>
          </ol>
        </nav>

        <h1 style={{ fontSize: "clamp(1.75rem, 4vw, 2.25rem)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1, color: "#1d1d1f", marginBottom: "0.5rem" }}>Affiliate Disclosure</h1>
        <p style={{ fontSize: "0.8125rem", color: "#aeaeb2", marginBottom: "2.5rem" }}>Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>

        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

          <section>
            <h2 style={{ fontSize: "1.0625rem", fontWeight: 600, letterSpacing: "-0.02em", color: "#1d1d1f", marginBottom: "0.625rem" }}>FTC Required Disclosure</h2>
            <p style={{ fontSize: "0.9375rem", color: "#3a3a3c", lineHeight: 1.65, margin: 0 }}>In accordance with the Federal Trade Commission&apos;s 16 CFR Part 255 guidelines on the use of endorsements and testimonials in advertising, How Do You Spell discloses that this website contains affiliate links. When you click on certain links on this site and make a purchase or sign up for a service, we may receive a commission or referral fee at no additional cost to you.</p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.0625rem", fontWeight: 600, letterSpacing: "-0.02em", color: "#1d1d1f", marginBottom: "0.625rem" }}>What This Means for You</h2>
            <p style={{ fontSize: "0.9375rem", color: "#3a3a3c", lineHeight: 1.65, margin: 0 }}>Some of the links on How Do You Spell are &quot;affiliate links.&quot; This means if you click on the link and purchase the item or service, we may receive an affiliate commission. We only recommend products and services we believe will genuinely benefit our readers. The price you pay is not affected — you will never pay more because of an affiliate link on this site.</p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.0625rem", fontWeight: 600, letterSpacing: "-0.02em", color: "#1d1d1f", marginBottom: "0.625rem" }}>Affiliate Programs We Participate In</h2>
            <p style={{ fontSize: "0.9375rem", color: "#3a3a3c", lineHeight: 1.65, marginBottom: "0.75rem" }}>How Do You Spell participates in affiliate programs including but not limited to:</p>
            <ul style={{ fontSize: "0.9375rem", color: "#3a3a3c", lineHeight: 1.9, paddingLeft: "1.25rem", margin: 0 }}>
              <li><strong>Amazon Associates Program</strong> — As an Amazon Associate we earn from qualifying purchases.</li>
              <li><strong>Grammarly Affiliate Program</strong> — We may earn a commission when you sign up for Grammarly through our links.</li>
              <li><strong>ProWritingAid Affiliate Program</strong> — We may earn a commission on sales made through our referral links.</li>
              <li><strong>Other writing and productivity tools</strong> — We participate in various affiliate programs for products relevant to spelling, writing, and language.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: "1.0625rem", fontWeight: 600, letterSpacing: "-0.02em", color: "#1d1d1f", marginBottom: "0.625rem" }}>Our Editorial Independence</h2>
            <p style={{ fontSize: "0.9375rem", color: "#3a3a3c", lineHeight: 1.65, margin: 0 }}>Affiliate relationships do not influence our content. All word definitions, etymology, and spelling guidance on this site are written independently and are not paid for or influenced by any advertiser or affiliate partner. We never recommend a product solely because of an affiliate relationship.</p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.0625rem", fontWeight: 600, letterSpacing: "-0.02em", color: "#1d1d1f", marginBottom: "0.625rem" }}>Amazon Specific Disclosure</h2>
            <p style={{ fontSize: "0.9375rem", color: "#3a3a3c", lineHeight: 1.65, margin: 0 }}>How Do You Spell is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com. Amazon and the Amazon logo are trademarks of Amazon.com, Inc. or its affiliates.</p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.0625rem", fontWeight: 600, letterSpacing: "-0.02em", color: "#1d1d1f", marginBottom: "0.625rem" }}>Questions</h2>
            <p style={{ fontSize: "0.9375rem", color: "#3a3a3c", lineHeight: 1.65, margin: 0 }}>If you have any questions about our affiliate relationships or this disclosure, please contact us at <Link href="mailto:hello@howdoyouspell.app" style={{ color: "#34c759", textDecoration: "none" }}>hello@howdoyouspell.app</Link></p>
          </section>

        </div>
      </main>

      <footer style={{ borderTop: "0.5px solid #d2d2d7", background: "#fff", padding: "1.25rem clamp(1.25rem, 5vw, 2.5rem)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
        <p style={{ fontSize: "0.6875rem", color: "#aeaeb2", margin: 0 }}>This page may contain affiliate links. © {new Date().getFullYear()} How Do You Spell</p>
        <nav style={{ display: "flex", gap: "1.5rem" }}>
          {["About", "Privacy", "Contact"].map((label) => (
            <Link key={label} href={`/${label.toLowerCase()}/`} style={{ fontSize: "0.6875rem", color: "#aeaeb2", textDecoration: "none" }}>{label}</Link>
          ))}
        </nav>
      </footer>
    </div>
  )
}
