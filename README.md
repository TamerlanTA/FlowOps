# FlowOps - AI Automation Agency Website

Production-ready lead generation website built with Next.js App Router, TypeScript, and Tailwind CSS.

## Tech Stack
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS 4
- React 19
- Google Sheets API (`googleapis`)
- Telegram Bot API
- SendGrid API (auto-reply email)

## Project Structure

```text
/app
  layout.tsx
  page.tsx
  globals.css
  robots.ts
  sitemap.ts
  /about/page.tsx
  /services/page.tsx
  /cases/page.tsx
  /contact/page.tsx
  /api/contact/route.ts
  /api/sendLead/route.ts
/components
  Navbar.tsx
  Footer.tsx
  Hero.tsx
  Problems.tsx
  Solutions.tsx
  Services.tsx
  CasePreview.tsx
  CTA.tsx
  ContactForm.tsx
  LayeredBackground.tsx
  Reveal.tsx
  SectionGlow.tsx
  TechStack.tsx
/lib
  constants.ts
  env.ts
  lead.ts
  /integrations
    email.ts
    googleSheets.ts
    telegram.ts
/pages
  thank-you.tsx
```

## Environment Variables

Create `.env.local` from `.env.example`.

Required:
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`
- `GOOGLE_SHEETS_CREDENTIALS`
- `EMAIL_SERVICE_API_KEY`

Recommended:
- `EMAIL_FROM` (verified sender in SendGrid)
- `SITE_URL`
- `NEXT_PUBLIC_GA_ID` (Google Analytics 4 measurement ID)

### `GOOGLE_SHEETS_CREDENTIALS` format
`GOOGLE_SHEETS_CREDENTIALS` can be either a raw JSON string or base64-encoded JSON.

Required JSON keys:
- `client_email`
- `private_key`
- `spreadsheet_id`

Optional key:
- `sheet_name` (defaults to `Leads`)

## Lead Flow

When a user submits `ContactForm`:
1. Client-side validation runs.
2. Form posts to `POST /api/sendLead`.
3. Server-side validation and sanitization run.
4. Lead is sent to Telegram.
5. Lead is saved to Google Sheets.
6. Auto-reply email is sent to the user.
7. User sees success state and is redirected to `/thank-you`.

## SEO Configuration

The project is configured for global B2B SEO in App Router:
- Centralized metadata builder in `lib/seo.ts`
- Canonical URLs for all core pages (`/`, `/services`, `/approach`, `/cases`, `/contact`, `/about`)
- OpenGraph + Twitter cards with a branded OG image
- Robots and sitemap generated through App Router metadata routes
- JSON-LD structured data:
  - `Organization`
  - `ProfessionalService`
  - `Service` (service catalog)
- Semantic heading hierarchy (single H1 per page)
- Internal linking between services, approach, cases, and contact sections
- `next/image` usage with hero priority loading and lazy-loaded secondary visuals

## Local Development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production Checks

```bash
npm run lint
npm run build
npm run start
```

## Deploy to Vercel

### Option 1: Vercel Dashboard
1. Push this project to GitHub.
2. Import repository in Vercel.
3. Framework preset: Next.js (auto-detected).
4. Add all environment variables from `.env.local` in Vercel Project Settings.
5. Deploy.

### Option 2: Vercel CLI
```bash
npm i -g vercel
vercel
vercel --prod
```

## Integration Setup Notes

### Telegram Bot
1. Create bot via `@BotFather`.
2. Copy bot token to `TELEGRAM_BOT_TOKEN`.
3. Add bot to your target chat/group.
4. Use the chat ID as `TELEGRAM_CHAT_ID`.

### Google Sheets API
1. Create a Google Cloud service account.
2. Enable Google Sheets API.
3. Share target Google Sheet with service account `client_email`.
4. Place service account data + `spreadsheet_id` into `GOOGLE_SHEETS_CREDENTIALS`.

### SendGrid
1. Create API key with Mail Send permissions.
2. Verify sender identity.
3. Set `EMAIL_SERVICE_API_KEY` and `EMAIL_FROM`.

## Security Notes
- All secrets are server-only and loaded through `lib/env.ts`.
- No secret is exposed to client-side code.
- Server route validates and sanitizes all incoming form data before integration calls.
