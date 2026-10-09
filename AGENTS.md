<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# MyTaalim Agent Rules & Guidelines

To ensure the high-standard editorial design, robust architecture, and code quality of the application remain consistent, **all agents and contributors must strictly adhere to the project rules and standards**.

All project rules are organized into dedicated documentation files located in the [`rules/`](./rules) directory:

---

## Required Rules & Guidelines

### 1. Architecture & System Design
- **Path**: [`rules/architecture.md`](./rules/architecture.md)
- **Description**: Defines the high-level system architecture, module boundaries, directory structure (`app/`, `components/`, `lib/`, `hooks/`, `types/`), request routing pipeline through `proxy.ts`, authentication architecture, and internationalization (`en` / `ar` with RTL) setup.
- **Rule**: All new modules, features, or architectural adjustments must respect these system boundaries and data flows.

### 2. Coding Conventions & Standards
- **Path**: [`rules/coding.md`](./rules/coding.md)
- **Description**: Outlines coding conventions for Next.js 16 App Router & React 19, strict TypeScript standards, API route implementations (`app/api/`), input validation with Zod (`lib/validation.ts`), database patterns with MongoDB (`lib/db.ts`), authentication and cookie lifecycle management (`lib/auth.ts`, `lib/auth-helpers.ts`), and localized dictionary usage.
- **Rule**: Every code addition must follow strict type safety, input validation, proper error handling with appropriate HTTP status codes, and synchronized token/cookie lifetimes.

### 3. Styling & Design System
- **Path**: [`rules/styling.md`](./rules/styling.md)
- **Description**: Establishes the editorial design system, including the Stone & Nobel Gold color palette (`#F9F8F4`, `#292524`, `#C5A059`), typography hierarchy (Serif `Playfair_Display` for headings/branding, Sans `Inter` for body/controls, Arabic fallbacks for RTL), accent classes (`.drop-cap`, `.gold-callout`, `.gold-divider`, `.glass-nav`, `.glass-panel`), pill-shaped buttons, and Framer Motion micro-interactions.
- **Rule**: Never use generic bright/neon colors or default styles. All UI components must align with the premium academic/editorial aesthetic.

---

## Mandatory Verification Command

After making any code modifications, you **must** run the following commands to ensure type safety and asset compilation:

```bash
pnpm typecheck
pnpm build
```
