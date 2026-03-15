"use client"

import { useState } from "react"

export default function MoneyBar() {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle")
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  async function handleSubmit() {
    if (!email || !email.includes("@")) return
    setStatus("loading")
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        setStatus("done")
      } else {
        setStatus("error")
      }
    } catch {
      setStatus("error")
    }
  }

  return (
    <div
      style={{
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
      }}
    >
      {status === "done" ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <p style={{ margin: 0, fontSize: "0.9375rem", color: "#34c759", fontWeight: 600, letterSpacing: "-0.01em" }}>
            ✓ You're on the list — we'll send you spelling tips and updates!
          </p>
          <button
            onClick={() => setDismissed(true)}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#aeaeb2", fontSize: "1.25rem", lineHeight: 1, padding: "0 0 0 1rem" }}
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
      ) : !open ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
          <p style={{ margin: 0, fontSize: "0.9375rem", color: "#3a3a3c", letterSpacing: "-0.01em" }}>
            <span style={{ fontWeight: 600, color: "#1d1d1f" }}>Never misspell a word again.</span>{" "}
            <span style={{ color: "#6e6e73" }}>Get weekly spelling tips and tricky word pairs in your inbox.</span>
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
            <button
              onClick={() => setOpen(true)}
              style={{
                background: "#34c759",
                color: "#fff",
                border: "none",
                borderRadius: 980,
                padding: "0.5rem 1.125rem",
                fontSize: "0.875rem",
                fontWeight: 600,
                cursor: "pointer",
                letterSpacing: "-0.01em",
                whiteSpace: "nowrap",
              }}
            >
              I want that!
            </button>
            <button
              onClick={() => setDismissed(true)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#aeaeb2", fontSize: "1.25rem", lineHeight: 1, padding: "0.25rem" }}
              aria-label="Dismiss"
            >
              ×
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", flexWrap: "wrap" }}>
          <p style={{ margin: 0, fontSize: "0.9375rem", fontWeight: 600, color: "#1d1d1f", letterSpacing: "-0.01em", flexShrink: 0 }}>
            Your email:
          </p>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="you@example.com"
            autoFocus
            style={{
              flex: 1,
              minWidth: 180,
              padding: "0.5rem 0.875rem",
              fontSize: "0.9375rem",
              border: "0.5px solid #d2d2d7",
              borderRadius: 980,
              background: "#fff",
              color: "#1d1d1f",
              outline: "none",
              letterSpacing: "-0.01em",
            }}
          />
          <button
            onClick={handleSubmit}
            disabled={status === "loading"}
            style={{
              background: "#34c759",
              color: "#fff",
              border: "none",
              borderRadius: 980,
              padding: "0.5rem 1.125rem",
              fontSize: "0.875rem",
              fontWeight: 600,
              cursor: status === "loading" ? "default" : "pointer",
              opacity: status === "loading" ? 0.7 : 1,
              letterSpacing: "-0.01em",
              whiteSpace: "nowrap",
            }}
          >
            {status === "loading" ? "Adding…" : "I want that!"}
          </button>
          <button
            onClick={() => { setOpen(false); setEmail("") }}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#aeaeb2", fontSize: "1.25rem", lineHeight: 1, padding: "0.25rem" }}
            aria-label="Cancel"
          >
            ×
          </button>
          {status === "error" && (
            <p style={{ margin: 0, fontSize: "0.8125rem", color: "#ff3b30", width: "100%" }}>
              Something went wrong — please try again.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
