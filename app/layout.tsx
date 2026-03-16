import type { Metadata } from "next"

export const metadata: Metadata = {
  metadataBase: new URL("https://www.howdoyouspell.app"),
  alternates: { canonical: "https://www.howdoyouspell.app" },
  title: {
    default: "How Do You Spell — Instant Spelling Checker",
    template: "%s | How Do You Spell",
  },
  description:
    "Check the correct spelling of any word instantly. Etymology, memory tips, and dialect differences across US, UK, Canadian, Australian, and New Zealand English.",
  openGraph: {
    siteName: "How Do You Spell",
    type: "website",
    url: "https://www.howdoyouspell.app",
    title: "How Do You Spell — Instant Spelling Checker",
    description: "Check the correct spelling of any word instantly. Etymology, memory tips, and dialect differences across US, UK, Canadian, Australian, and New Zealand English.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "HowDoYouSpell.app" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "How Do You Spell — Instant Spelling Checker",
    description: "Check the correct spelling of any word instantly.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#f5f5f7" />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-06JSHRD37J"></script>
        <script dangerouslySetInnerHTML={{ __html: `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-06JSHRD37J');` }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "How Do You Spell",
              url: "https://www.howdoyouspell.app",
              description: "The fastest way to check your spelling with etymology and dialect coverage.",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://www.howdoyouspell.app/{search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body
        style={{
          margin: 0,
          padding: 0,
          fontFamily: '-apple-system, "SF Pro Text", "SF Pro Display", "Helvetica Neue", Helvetica, Arial, sans-serif',
          background: "#f5f5f7",
          color: "#1d1d1f",
          WebkitFontSmoothing: "antialiased",
        }}
      >
        {children}
      </body>
    </html>
  )
}
