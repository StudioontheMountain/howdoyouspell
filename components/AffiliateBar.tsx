"use client"
import { useState } from "react"

interface AffiliateBarProps {
  ctaLabel: string
  ctaUrl: string
}

export default function AffiliateBar({ ctaLabel, ctaUrl }: AffiliateBarProps) {
  const [dismissed, setDismissed] = useState(false)
  if (dismissed) return null

  return (
    <div style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      background: "rgba(255,255,255,0.92)",
      backdropFilter: "saturate(180%) blur(20px)",
      WebkitBackdropFilter: "saturate(180%) blur(20px)",
      borderTop: "0.5px solid #d2d2d7",
      padding: "0.75rem clamp(1.25rem, 5vw, 2.5rem)",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
        <p style={{ margin: 0, fontSize: "0.9375rem", color: "#3a3a3c", letterSpacing: "-0.01em" }}>
          <span style={{ fontWeight: 600, color: "#1d1d1f" }}>{ctaLabel}</span>
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
          <a href={ctaUrl} target="_blank" rel="noopener noreferrer" style={{ background: "#1a5276", color: "#fff", borderRadius: 980, padding: "0.5rem 1.125rem", fontSize: "0.875rem", fontWeight: 600, letterSpacing: "-0.01em", whiteSpace: "nowrap", textDecoration: "none" }}>
            Learn more
          </a>
          <button onClick={() => setDismissed(true)} style={{ background: "none", border: "none", cursor: "pointer", color: "#aeaeb2", fontSize: "1.25rem", lineHeight: 1, padding: "0.25rem" }} aria-label="Dismiss">
            ×
          </button>
        </div>
      </div>
    </div>
  )
}
