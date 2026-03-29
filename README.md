# Exhale

A minimal web app: describe what is stressing you, and get **what is in your control**, a **reframe**, and **three next steps**—powered by the Anthropic API.

## Prerequisites

- Node.js 18+
- An [Anthropic API key](https://console.anthropic.com/)

## Setup

```bash
cd "/Users/tarangjammalamadaka/Desktop/Desktop - Tarang's Laptop/Start-up Projects/Exhale"
cp .env.local.example .env.local
```

Edit `.env.local` and set `ANTHROPIC_API_KEY`.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy (Vercel)

Connect this repo to Vercel and add `ANTHROPIC_API_KEY` in Project → Settings → Environment Variables.

## Push to GitHub

From this folder (note the path has spaces and a special Desktop folder name):

```bash
cd "/Users/tarangjammalamadaka/Desktop/Desktop - Tarang's Laptop/Start-up Projects/Exhale"
git init
git branch -M main
git remote add origin https://github.com/tarang-tj/exhale-ai.git
git add -A
git commit -m "Initial commit: Exhale AI"
git push -u origin main
```

If `git push` asks for credentials, use a [Personal Access Token](https://github.com/settings/tokens) as the password, or set up SSH keys and use `git@github.com:tarang-tj/exhale-ai.git`.

**Why `cd` failed before:** Comments on the same line as `cd` break the command in zsh—run `cd` alone, then other commands. The path `~/Desktop/start-up-projects/Exhale` does not exist on this machine; use the quoted path above.
