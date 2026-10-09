# MyTaalim Coding Guidelines

This document outlines the coding standards, patterns, and conventions for developing features in the MyTaalim codebase.

---

## 1. Next.js 16 & React 19 Standards

- **Next.js 16 Routing Conventions**:
  - Middleware has been renamed to **Proxy** (`proxy.ts` in the root). Do not create `middleware.ts`.
  - Server-startup background logic belongs in `instrumentation.ts` (`register()` hook), not in request proxies or page components.
  - Page routes live under `app/[lang]/` to support multilingual URL routing.
- **Server vs Client Components**:
  - Default to React Server Components (RSC) for page shells, data fetching, and static layouts.
  - Add `"use client"` only when components need React state, effects, event handlers, browser APIs, or Framer Motion.
  - Separate client interactivity into dedicated client files (e.g. `dashboard-client.tsx`, `profile-client.tsx`, `home-client.tsx`).

---

## 2. TypeScript & Type Safety

- **Strict Mode**: The project enforces strict TypeScript checking.
- **Shared Data Models**:
  - Define and export persistent database models and formatted API response types in `types/index.ts`.
  - Avoid defining duplicate ad-hoc types across multiple files.
- **No Implicit Any**:
  - Avoid `any`. Use `unknown` with type guards or create explicit TypeScript interfaces/types.
  - Export input/output types inferred from Zod schemas where applicable.

---

## 3. API Route Conventions (`app/api/`)

- **File Convention**:
  - Each route is defined in `app/api/<feature>/route.ts`.
  - Export HTTP method handlers: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`.
- **Response Format**:
  - Always return JSON with proper HTTP status codes:
    - `200` / `201`: Successful request with data payload or confirmation message.
    - `400`: Validation or client input error (`{ error: string }`).
    - `401`: Missing or invalid authentication token (`{ error: "Not authenticated" }`).
    - `403`: Forbidden / unverified account (`{ error: string }`).
    - `404`: Resource not found (`{ error: string }`).
    - `500`: Server exception (`{ error: string }`).
- **Authentication in APIs**:
  - Use `getAuthUser(request)` from `lib/auth-helpers.ts` to retrieve the authenticated user (`{ id, email }`).
  - If `!authUser`, immediately return `{ error: "Not authenticated" }` with status `401`.

---

## 4. Input Validation (Zod)

- **Centralized Schemas**:
  - Define validation schemas in `lib/validation.ts`.
  - Support multilingual error messages by passing dictionary messages to schema factory functions (e.g. `createLoginSchema(messages)`).
- **Safe Parsing**:
  - In route handlers and forms, validate using `.safeParse()`:
    ```ts
    const result = schema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 },
      );
    }
    ```

---

## 5. Database Conventions (MongoDB)

- **Connection Management**:
  - Never instantiate raw `MongoClient` directly inside route handlers.
  - Use the connection pool from `lib/db.ts` (`getDb()`, `getUsersCollection()`, `getPlaylistsCollection()`, `getProgressCollection()`).
- **ObjectIds**:
  - When querying documents by ID, always convert the string ID to `new ObjectId(id)` within a `try/catch` block to handle malformed ID strings gracefully.
- **Projections**:
  - When listing playlists or collections in bulk, exclude heavy arrays (e.g. `{ projection: { videos: 0 } }`) to optimize query speed and memory.

---

## 6. Authentication & Token Management

- **Synchronized Lifecycles**:
  - Tokens and cookies must have the exact same expiration duration. Use `getTokenMaxAge()` from `lib/auth.ts` for cookie `maxAge`.
- **Security**:
  - Store tokens in `httpOnly`, `secure` (in production), `sameSite: "lax"`, `path: "/"` cookies.
  - Password hashing must use `bcryptjs` with salt round `12`.
- **Session Cleanup**:
  - Whenever an API or proxy detects an invalid/expired token, always clear the cookie on the response:
    ```ts
    response.cookies.set("token", "", { maxAge: 0, path: "/", httpOnly: true });
    ```
  - On the client side, use `useAuth().logout()` to purge both `localStorage` and server cookies in tandem.

---

## 7. Internationalization (i18n)

- **Supported Locales**: `en` (English) and `ar` (Arabic). Configured in `lib/i18n/config.ts`.
- **Dictionary Lookups**:
  - Content strings must be stored in `lib/i18n/dictionaries.ts`. Avoid hardcoding user-facing strings in UI components.
  - Use the `useI18n()` hook to access `{ dictionary, locale }`.
- **Localized Navigation**:
  - Internal links must include the locale prefix. Use `useLocalePath()` hook or `localizeHref(href, locale)` from `lib/i18n/config.ts`.

---

## 8. Verification & Quality Assurance

- Always run verification checks after making changes:
  1. `pnpm typecheck` — Verify zero TypeScript compilation errors.
  2. `pnpm build` — Ensure the Next.js production bundle compiles successfully.
