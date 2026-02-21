# VC Intelligence Interface + Live Enrichment

## Overview
Precision AI Scout for VCs.

## Features
- Company discovery
- Filters + search
- Saved searches
- Lists
- Live website enrichment
- Source transparency

## Architecture
Next.js 14 (App Router)
Server-side enrichment API
LocalStorage persistence

## Enrichment Flow
1. User clicks Enrich
2. Server fetches public site
3. LLM extracts structured insights
4. UI displays results + sources
5. Results cached locally

## Environment Variables

GOOGLE_API_KEY=your_key_here

## Run Locally

npm install
npm run dev

## Deployment
Deployed on Vercel.
