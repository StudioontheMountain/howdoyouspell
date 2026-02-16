import { notFound } from "next/navigation"
import Link from "next/link"
import type { Metadata } from "next"
import { getWordBySlug, getAllSlugs, SPELLING_WORDS } from "@/lib/spelling-data"

export function generateStaticParams() {
  return getAllSlugs().map((word) => ({ word }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ word: string }>
}): Promise<Metadata> {
  const { word: slug } = await params
  const entry = getWordBySlug(slug)
  if (!entry) return { title: "Word Not Found" }

  const title = `How Do You Spell ${entry.word.charAt(0).toUpperCase() + entry.word.slice(1)}? | Correct Spelling`
  const description = `The correct spelling is "${entry.word}". Common misspellings include ${entry.misspellings.slice(0, 3).join(", ")}. ${entry.tip}`

  return {
    title,
    description,
    keywords: [
      `how do you spell ${entry.word}`,
      `how to spell ${entry.word}`,
      `correct spelling of ${entry.word}`,
      `is it ${entry.misspellings[0]} or ${entry.word}`,
      `${entry.word} spelling`,
      ...entry.misspellings,
    ],
    openGraph: {
      title,
      description,
      url: `https://howdoyouspell.app/${slug}`,
      siteName: "How Do You Spell",
      type: "article",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
    alternates: {
      canonical: `https://howdoyouspell.app/${slug}`,
    },
  }
}

function JsonLd({ entry }: { entry: NonNullable<ReturnType<typeof getWordBySlug>> }) {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `How do you spell ${entry.word}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `The correct spelling is "${entry.word}". ${entry.tip}`,
        },
      },
      {
        "@type": "Question",
        name: `Is it ${entry.misspellings[0]} or ${entry.word}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `The correct spelling is "${entry.word}", not "${entry.misspellings[0]}". ${entry.tip}`,
        },
      },
    ],
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://howdoyouspell.app",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: entry.word.charAt(0).toUpperCase() + entry.word.slice(1),
        item: `https://howdoyouspell.app/${entry.word.toLowerCase().replace(/[' ]/g, "-")}`,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  )
}


function DifficultyBadge({ level }: { level: "easy" | "medium" | "hard" }) {
  const colors = {
    easy: "bg-emerald-100 text-emerald-700 border-emerald-200",
    medium: "bg-amber-100 text-amber-700 border-amber-200",
    hard: "bg-red-100 text-red-700 border-red-200",
  }
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${colors[level]}`}>
      {level.charAt(0).toUpperCase() + level.slice(1)}
    </span>
  )
}

export default async function WordPage({
  params,
}: {
  params: Promise<{ word: string }>
}) {
  const { word: slug } = await params
  const entry = getWordBySlug(slug)
  if (!entry) notFound()

  const displayWord = entry.word.charAt(0).toUpperCase() + entry.word.slice(1)

  const related = SPELLING_WORDS.filter((w) => w.word !== entry.word)
    .sort(() => 0.5 - Math.random())
    .slice(0, 4)

  return (
    <div className="min-h-screen bg-white">
      <JsonLd entry={entry} />

      <header className="border-b border-stone-200 bg-white sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold tracking-tight text-stone-900 hover:text-emerald-700 transition-colors">
            How Do You Spell
          </Link>
          <Link href="/" className="text-sm text-stone-500 hover:text-stone-700 transition-colors">
            Check another word
          </Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 pt-4">
</div>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-2 text-sm text-stone-400">
            <li><Link href="/" className="hover:text-stone-600 transition-colors">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li className="text-stone-700 font-medium">{displayWord}</li>
          </ol>
        </nav>

        <article>
          <h1 className="text-3xl md:text-4xl font-bold text-stone-900 leading-tight text-balance mb-2">
            How Do You Spell {displayWord}?
          </h1>
          <div className="flex items-center gap-3 mb-8">
            <DifficultyBadge level={entry.difficulty} />
            <span className="text-sm text-stone-400">{entry.monthlySearches} monthly searches</span>
          </div>

          <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-6 md:p-8 mb-8">
            <p className="text-sm font-semibold text-emerald-600 uppercase tracking-wider mb-2">Correct spelling</p>
            <p className="text-4xl md:text-5xl font-bold text-emerald-800 tracking-tight">
              {entry.word}
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8">
            <p className="text-sm font-semibold text-amber-700 mb-1">Memory tip</p>
            <p className="text-stone-700 text-pretty">{entry.tip}</p>
          </div>

          <section className="mb-8">
            <h2 className="text-lg font-bold text-stone-900 mb-3">
              Common misspellings of {displayWord.toLowerCase()}
            </h2>
            <div className="flex flex-wrap gap-2">
              {entry.misspellings.map((ms) => (
                <span key={ms} className="px-3 py-1.5 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm line-through decoration-red-400">
                  {ms}
                </span>
              ))}
            </div>
          </section>

          {entry.dialects && (
            <section className="mb-8">
              <h2 className="text-lg font-bold text-stone-900 mb-3">Spelling by English dialect</h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-stone-50 rounded-xl p-4 border border-stone-200">
                  <p className="text-[11px] uppercase tracking-wider text-stone-400 mb-1">US English</p>
                  <p className="text-xl font-bold text-stone-900">{entry.dialects.us}</p>
                </div>
                <div className="bg-stone-50 rounded-xl p-4 border border-stone-200">
                  <p className="text-[11px] uppercase tracking-wider text-stone-400 mb-1">UK English</p>
                  <p className="text-xl font-bold text-stone-900">{entry.dialects.uk}</p>
                </div>
                <div className="bg-stone-50 rounded-xl p-4 border border-stone-200">
                  <p className="text-[11px] uppercase tracking-wider text-stone-400 mb-1">Australian</p>
                  <p className="text-xl font-bold text-stone-900">{entry.dialects.au}</p>
                </div>
                <div className="bg-stone-50 rounded-xl p-4 border border-stone-200">
                  <p className="text-[11px] uppercase tracking-wider text-stone-400 mb-1">New Zealand</p>
                  <p className="text-xl font-bold text-stone-900">{entry.dialects.nz}</p>
                </div>
              </div>
            </section>
          )}

          <section className="mb-8">
            <h2 className="text-lg font-bold text-stone-900 mb-3">Example</h2>
            <blockquote className="border-l-4 border-emerald-300 pl-4 py-2 bg-stone-50 rounded-r-lg">
              <p className="text-stone-700 italic">{entry.example}</p>
            </blockquote>
          </section>
<section className="mb-8">
            <h2 className="text-lg font-bold text-stone-900 mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <details className="group border border-stone-200 rounded-xl" open>
                <summary className="flex items-center justify-between cursor-pointer p-4 font-medium text-stone-800">
                  How do you spell {entry.word}?
                  <svg className="w-4 h-4 text-stone-400 group-open:rotate-180 transition-transform" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                </summary>
                <div className="px-4 pb-4 text-stone-600 text-sm">
                  The correct spelling is <strong>{entry.word}</strong>. {entry.tip}
                </div>
              </details>

              <details className="group border border-stone-200 rounded-xl">
                <summary className="flex items-center justify-between cursor-pointer p-4 font-medium text-stone-800">
                  Is it {entry.misspellings[0]} or {entry.word}?
                  <svg className="w-4 h-4 text-stone-400 group-open:rotate-180 transition-transform" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                </summary>
                <div className="px-4 pb-4 text-stone-600 text-sm">
                  The correct spelling is <strong>{entry.word}</strong>, not &quot;{entry.misspellings[0]}&quot;. This is one of the most commonly misspelled words in English with {entry.monthlySearches} monthly searches.
                </div>
              </details>

              {entry.dialects && (
                <details className="group border border-stone-200 rounded-xl">
                  <summary className="flex items-center justify-between cursor-pointer p-4 font-medium text-stone-800">
                    Does the spelling differ by country?
                    <svg className="w-4 h-4 text-stone-400 group-open:rotate-180 transition-transform" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                  </summary>
                  <div className="px-4 pb-4 text-stone-600 text-sm">
                    Yes. In US English it&apos;s spelled &quot;{entry.dialects.us}&quot;, while in UK, Australian, and New Zealand English it&apos;s spelled &quot;{entry.dialects.uk}&quot;.
                  </div>
                </details>
              )}
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold text-stone-900 mb-4">Other commonly misspelled words</h2>
            <div className="grid grid-cols-2 gap-3">
              {related.map((r) => (
                <Link
                  key={r.word}
                  href={`/${r.word.toLowerCase().replace(/[' ]/g, "-")}`}
                  className="flex items-center justify-between p-3 bg-stone-50 border border-stone-200 rounded-xl hover:border-emerald-300 hover:bg-emerald-50 transition-colors group"
                >
                  <span className="font-medium text-stone-800 group-hover:text-emerald-800">{r.word}</span>
                  <svg className="w-4 h-4 text-stone-300 group-hover:text-emerald-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
                </Link>
              ))}
            </div>
          </section>
        </article>
</main>

      <footer className="border-t border-stone-200 bg-stone-50 mt-12">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <p className="text-sm text-stone-400 text-center">
            howdoyouspell.app - The fastest way to check your spelling.
          </p>
        </div>
      </footer>
    </div>
  )
}
