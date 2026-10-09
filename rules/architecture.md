# MyTaalim System Architecture

This document describes the high-level architecture, module boundaries, data flows, and infrastructure conventions of the MyTaalim application.

---

## 1. Technology Stack

- **Framework**: Next.js 16 (App Router with Turbopack)
- **Runtime**: Node.js 20+
- **Language**: TypeScript 5+ (Strict mode)
- **UI & State**: React 19, Framer Motion (`motion/react`), Lucide React icons
- **Styling**: Tailwind CSS v4, custom CSS variables & utility classes (`globals.css`)
- **Database**: MongoDB with official Node.js driver (`mongodb`)
- **Validation**: Zod (`zod`)
- **Authentication**: JWT (`jose` in Proxy, `jsonwebtoken` in Node runtime, `bcryptjs`)
- **Email Service**: Resend / Nodemailer (`lib/email-service.ts`)
- **External APIs**: YouTube Data API v3 (`lib/youtube.ts`)

---

## 2. Directory Structure & Responsibilities

```
playzen/
├── app/                      # Next.js App Router root
│   ├── [lang]/               # Multilingual dynamic routes (en, ar)
│   │   ├── (auth)/           # Authentication route group (login, register, forgot-password, reset-password)
│   │   ├── (protected)/      # Protected routes (dashboard, playlist, profile)
│   │   ├── home-client.tsx   # Client landing page experience
│   │   ├── layout.tsx        # Root HTML layout with dir, lang, fonts, providers
│   │   └── page.tsx          # Root entry page
│   ├── api/                  # Backend Route Handlers
│   │   ├── auth/             # Login, register, OTP verification, me, logout, password reset
│   │   ├── health/           # Health check endpoint
│   │   ├── playlists/        # Playlist CRUD & YouTube playlist ingestion
│   │   └── progress/         # Video watch progress & completion tracking
│   └── globals.css           # Global Tailwind tokens, theme CSS variables, and utility classes
├── components/               # React components organized by feature
│   ├── auth/                 # Forms: login, register, OTP, forgot/reset password
│   ├── dashboard/            # Playlist cards, modals, filters, metrics
│   ├── landing/              # Hero, features, demo, interactive simulator
│   ├── layout/               # Navbar, footer, locale switcher
│   ├── player/               # YouTube custom video player & progress controller
│   ├── seo/                  # Structured data & SEO meta tags
│   └── ui/                   # Primitive design system components (Button, Input, Card, Modal, etc.)
├── hooks/                    # Reusable React hooks
│   ├── use-auth.tsx          # Auth context and global authentication hook
│   ├── use-locale-path.ts    # Helper hook to generate locale-prefixed routes
│   ├── use-progress.ts       # Video progress persistence hook
│   └── use-youtube-player.ts # YouTube iframe API integration hook
├── lib/                      # Core business logic & utility layer
│   ├── api.ts                # Client-side API fetch wrapper with locale & auth headers
│   ├── auth.ts               # JWT signing/verifying, password hashing, token maxAge helper
│   ├── auth-helpers.ts       # Server-side auth extractor from NextRequest (cookies + bearer)
│   ├── db.ts                 # MongoDB connection pool & collection helpers
│   ├── email-service.ts      # Transactional emails (OTP, password reset) via Resend
│   ├── seo.ts                # SEO metadata generation utilities
│   ├── validation.ts         # Zod schemas with localized validation error messages
│   ├── youtube.ts            # YouTube Data API v3 fetchers (metadata, items, durations)
│   └── i18n/                 # Localization config, dictionaries, translation helpers
├── proxy.ts                  # Next.js Proxy (formerly middleware) for routing, auth checks & cookies
├── instrumentation.ts        # Next.js server startup hook
├── rules/                    # Architecture, coding, and styling rule definitions
│   ├── architecture.md       # This file
│   ├── coding.md             # Coding and implementation rules
│   └── styling.md            # Design system, theme, and styling rules
└── types/                    # Shared TypeScript interfaces & types
    └── index.ts              # Data models: User, Playlist, Progress, AuthPayload
```

---

## 3. Request Flow & Routing Architecture

```
Incoming Request
       │
       ▼
[ proxy.ts ] ─── 1. Locale Detection & Prefixing (e.g. / -> /en)
       │         2. Authentication Verification (jose + JWT_SECRET)
       │         3. Access Control (Redirect unauthenticated users from /dashboard -> /login)
       │         4. Cookie Sanitization (Cleans expired/invalid cookies)
       ▼
[ app/[lang]/... ] or [ app/api/... ]
       │
       ├─► Pages (RSC) -> Render HTML -> Stream to Client
       │
       └─► Route Handlers (app/api/)
             │
             ├── Validation (lib/validation.ts - Zod)
             ├── Auth Check (lib/auth-helpers.ts - getAuthUser)
             ├── Database (lib/db.ts - MongoDB)
             └── JSON Response (NextResponse.json)
```

---

## 4. Authentication Architecture

- **Session Strategy**: Stateless JWT stored in an HTTP-only cookie accompanied by synchronized client-side memory/storage.
- **Token Verification**:
  - In `proxy.ts`: Uses `jose.jwtVerify()` (Edge / Node compatible).
  - In API Routes: Uses `lib/auth-helpers.ts` (`jsonwebtoken.verify()`).
- **Synchronized Expiration**:
  - `JWT_EXPIRES_IN` dictates both token payload expiry and cookie `maxAge` via `getTokenMaxAge()`.
  - When a token expires, `proxy.ts`, `/api/auth/me`, and `use-auth.tsx` clear the cookie and `localStorage` simultaneously to prevent ghost authentication states.

---

## 5. Internationalization (i18n) Architecture

- **Routing Model**: Sub-path routing (`/en/...`, `/ar/...`).
- **Detection Chain**: URL pathname locale $\rightarrow$ cookie preference (`NEXT_LOCALE`) $\rightarrow$ Geo-IP header $\rightarrow$ `Accept-Language` header $\rightarrow$ default fallback (`en`).
- **Directionality**: Arabic triggers `dir="rtl"` on `<html>`, applying custom right-to-left layout alignment and Arabic typography font-family overrides.
- **Dictionaries**: Dictionaries are loaded synchronously in `lib/i18n/dictionaries.ts`, avoiding client-side translation waterfalls.
