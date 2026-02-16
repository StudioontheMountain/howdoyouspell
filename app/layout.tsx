import type { Metadata, Viewport } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: "How Do You Spell | Instant Spelling Checker",
    template: "%s | How Do You Spell",
  },
  description:
    "The fastest way to check your spelling. Type any word and get the correct spelling instantly. US, UK, Australian, and New Zealand English supported.",
  keywords: [
    "how do you spell",
    "how to spell",
    "spell check",
    "spelling checker",
    "correct spelling",
    "is it spelled",
    "spelling help",
    "misspelled words",
    "English spelling",
  ],
  metadataBase: new URL("https://howdoyouspell.app"),
  openGraph: {
    title: "How Do You Spell | Instant Spelling Checker",
    description:
      "The fastest way to check your spelling. Type any word and get the correct spelling instantly.",
    url: "https://howdoyouspell.app",
    siteName: "How Do You Spell",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "How Do You Spell | Instant Spelling Checker",
    description:
      "Type any word. Get the correct spelling. Instantly.",
  },
  alternates: {
    canonical: "https://howdoyouspell.app",
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

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
}

function SiteJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "How Do You Spell",
    url: "https://howdoyouspell.app",
    description: "The fastest way to check your spelling. Type any word and get the correct spelling instantly.",
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <SiteJsonLd />
        {children}
      </body>
    </html>
  )
}
