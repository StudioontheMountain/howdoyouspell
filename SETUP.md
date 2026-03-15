# How Do You Spell — Setup Guide

## First time setup

Open Terminal, navigate to this folder, then run:

```
npm install
npm run dev
```

Open your browser to http://localhost:3000 — you should see the site.

---

## Deploy to Vercel (first time)

Make sure you have the Vercel CLI installed:
```
npm install -g vercel
```

Then from this folder:
```
vercel
```

Follow the prompts. Vercel will give you a preview URL like:
`https://howdoyouspell-abc123.vercel.app`

Test it there before pointing your domain.

---

## Deploy to production

When you're happy with the preview:
```
vercel --prod
```

---

## Point your domain (Cloudflare)

1. Log in to Cloudflare
2. Select howdoyouspell.app
3. Go to DNS
4. Update the A record to point to: 76.76.21.21
5. Add a CNAME: www → cname.vercel-dns.com

Changes take effect within minutes on Cloudflare.

---

## Add new words

1. Edit `lib/spelling-data.ts` or `lib/word-commentary.ts`
2. Run: `npm run words`
3. Run: `vercel --prod`

That's it. The sitemap updates automatically.

---

## File map

```
howdoyouspell/
├── public/
│   └── words.json          ← 2,044 words, single source of truth
├── app/
│   ├── layout.tsx          ← site-wide layout and metadata
│   ├── page.tsx            ← homepage
│   ├── word/
│   │   └── page.tsx        ← individual word pages (/accommodate, /whiskey etc)
│   ├── sitemap.ts          ← auto-generated sitemap
│   └── robots.ts           ← robots.txt
├── lib/
│   └── words-data.ts       ← all data access functions
├── generate-words-json.mjs ← rebuilds words.json (run: npm run words)
├── next.config.ts
├── tsconfig.json
├── package.json
└── vercel.json
```
