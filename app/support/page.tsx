export default function SupportPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f7', fontFamily: '-apple-system, Helvetica Neue, Arial, sans-serif' }}>
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, height: 44, display: 'flex', alignItems: 'center', padding: '0 24px', background: 'rgba(245,245,247,0.85)', backdropFilter: 'blur(20px)', borderBottom: '0.5px solid #d2d2d7' }}>
        <a href="/" style={{ fontSize: 15, fontWeight: 600, textDecoration: 'none', color: '#1d1d1f' }}>← How Do You Spell</a>
      </nav>
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '48px 24px 80px' }}>
        <h1 style={{ fontSize: 36, fontWeight: 700, letterSpacing: -1, marginBottom: 8 }}>Support</h1>
        <p style={{ fontSize: 15, lineHeight: 1.7, color: '#3a3a3c', marginBottom: 24 }}>For questions, feedback, or to report a missing or incorrect word, email us at <a href="mailto:privacy@howdoyouspell.app" style={{ color: '#0071e3' }}>privacy@howdoyouspell.app</a></p>
        <p style={{ fontSize: 15, lineHeight: 1.7, color: '#3a3a3c', marginBottom: 24 }}>Our database contains over 2,000 words and is growing. If you searched for a word and did not find it, let us know and we will add it.</p>
        <p style={{ fontSize: 15, lineHeight: 1.7, color: '#3a3a3c' }}>If you believe any information on the site is incorrect, please contact us with the word and the correction and we will review it promptly.</p>
      </div>
    </div>
  )
}
