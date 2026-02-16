# How Do You Spell - Deployment Guide

## Step 1: Create GitHub Repo
1. Go to github.com/new
2. Name it `howdoyouspell`
3. Make it private
4. Copy the contents of this `spellit-standalone` folder into the new repo root
5. Push to main

## Step 2: Deploy to Vercel
1. Go to vercel.com/new
2. Click "Import Git Repository"
3. Select `howdoyouspell`
4. Framework: Next.js (auto-detected)
5. Click Deploy

## Step 3: Add Custom Domain
1. In Vercel dashboard, go to your new project
2. Settings > Domains
3. Add `howdoyouspell.app`
4. Vercel will show you DNS records to add
5. Go to your domain registrar and update the DNS:
   - Option A (recommended): Change nameservers to Vercel's
   - Option B: Add A record (76.76.21.21) and CNAME (cname.vercel-dns.com)

## Step 4: Submit to Google
1. Go to search.google.com/search-console
2. Add property: howdoyouspell.app
3. Verify ownership (Vercel DNS makes this easy)
4. Submit sitemap: howdoyouspell.app/sitemap.xml

## Structure
- `/` - Main spell checker tool
- `/[word]` - 50 individual word pages (e.g., /definitely, /calendar)
- `/api/spell` - Spell check API (10K+ word dictionary)
- `/sitemap.xml` - Auto-generated from word list
- `/robots.txt` - Auto-generated

## Adding More Words
Edit `lib/spelling-data.ts` to add new word entries.
New words automatically appear on the homepage, in the sitemap, and get their own SEO page.
