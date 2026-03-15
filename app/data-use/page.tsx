export default function DataUsePage() {
  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f7', fontFamily: '-apple-system, Helvetica Neue, Arial, sans-serif' }}>
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, height: 44, display: 'flex', alignItems: 'center', padding: '0 24px', background: 'rgba(245,245,247,0.85)', backdropFilter: 'blur(20px)', borderBottom: '0.5px solid #d2d2d7' }}>
        <a href="/" style={{ fontSize: 15, fontWeight: 600, textDecoration: 'none', color: '#1d1d1f' }}>← How Do You Spell</a>
      </nav>
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '48px 24px 80px' }}>
        <h1 style={{ fontSize: 36, fontWeight: 700, letterSpacing: -1, marginBottom: 8 }}>Data Use Policy</h1>
        <p style={{ fontSize: 13, color: '#aeaeb2', marginBottom: 40 }}>Effective: February 16, 2026</p>
        <p style={{ fontSize: 15, lineHeight: 1.7, color: '#3a3a3c', marginBottom: 24 }}>We provide a spelling reference service, not a data collection service. We do not collect personal identifiers, search data, location data, device data, or behavioral data. There are no accounts and no registration.</p>
        <p style={{ fontSize: 15, lineHeight: 1.7, color: '#3a3a3c', marginBottom: 24 }}>We do not serve personalized advertising. We do not partner with advertising networks. We do not sell, rent, or share any data with third parties.</p>
        <p style={{ fontSize: 15, lineHeight: 1.7, color: '#3a3a3c', marginBottom: 24 }}>This policy is provided in compliance with Apple App Store requirements. How Do You Spell does not collect data falling into any of Apple defined data collection categories.</p>
        <p style={{ fontSize: 15, lineHeight: 1.7, color: '#3a3a3c' }}>Questions? Email privacy@howdoyouspell.app</p>
      </div>
    </div>
  )
}
