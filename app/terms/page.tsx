export default function TermsPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f7', fontFamily: '-apple-system, Helvetica Neue, Arial, sans-serif' }}>
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, height: 44, display: 'flex', alignItems: 'center', padding: '0 24px', background: 'rgba(245,245,247,0.85)', backdropFilter: 'blur(20px)', borderBottom: '0.5px solid #d2d2d7' }}>
        <a href="/" style={{ fontSize: 15, fontWeight: 600, textDecoration: 'none', color: '#1d1d1f' }}>← How Do You Spell</a>
      </nav>
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '48px 24px 80px' }}>
        <h1 style={{ fontSize: 36, fontWeight: 700, letterSpacing: -1, marginBottom: 8 }}>Terms of Service</h1>
        <p style={{ fontSize: 13, color: '#aeaeb2', marginBottom: 40 }}>Effective: February 16, 2026</p>
        <p style={{ fontSize: 15, lineHeight: 1.7, color: '#3a3a3c', marginBottom: 24 }}>By using How Do You Spell at howdoyouspell.app, you agree to these terms. The service is provided free of charge for personal, educational, and commercial reference purposes.</p>
        <p style={{ fontSize: 15, lineHeight: 1.7, color: '#3a3a3c', marginBottom: 24 }}>You agree not to scrape or systematically download content in a manner that burdens our infrastructure. All content including word entries, etymologies, and examples is the property of Studio on the Mountain and protected by copyright.</p>
        <p style={{ fontSize: 15, lineHeight: 1.7, color: '#3a3a3c', marginBottom: 24 }}>The service is provided as-is. We strive for accuracy but language varies by region and style guide. Studio on the Mountain is not liable for indirect or consequential damages arising from use of the service.</p>
        <p style={{ fontSize: 15, lineHeight: 1.7, color: '#3a3a3c' }}>Questions? Email privacy@howdoyouspell.app</p>
      </div>
    </div>
  )
}
