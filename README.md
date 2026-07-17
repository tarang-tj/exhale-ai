# Exhale

A minimal web app for talking yourself down. Describe what is stressing you and get back three things: **what is in your control**, a **reframe**, and **three next steps**. Generation is powered by the Anthropic API.

## Stack

Next.js (App Router) with a single API route at `app/api/calm/route.ts` that calls the Anthropic SDK. Default model is `claude-3-5-sonnet-20241022`, overridable via `ANTHROPIC_MODEL`.

## Prerequisites

- Node.js 18+
- An [Anthropic API key](https://console.anthropic.com/)

## Setup

```bash
cp .env.local.example .env.local   # then set ANTHROPIC_API_KEY
npm install
npm run dev
```

Open http://localhost:3000.

## Deploy (Vercel)

Connect the repo to Vercel and add `ANTHROPIC_API_KEY` under Project Settings, Environment Variables.
