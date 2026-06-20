<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# MyTaalim Coding & Styling Guidelines

To ensure the premium, editorial design of the application remains consistent, all agents must adhere to the following design patterns and coding conventions:

---

## 1. Design System & Theme

### Color Palette (Stone & Nobel Gold)
- **Backgrounds**:
  - Cream/Paper background: `#F9F8F4` (CSS variable `--background`, utility `bg-background`).
  - Warm stone light backgrounds: `#F5F4F0` (CSS variable `--secondary`/`--muted`, utility `bg-secondary` or `bg-muted`).
- **Foregrounds & Text**:
  - Headings: Deep Stone `#1C1917` (Stone-900).
  - Body Text: Charcoal Stone `#292524` (Stone-800).
  - Muted Labels: Warm Gray `#78716C` (Stone-500).
- **Accents**:
  - **Nobel Gold**: `#C5A059` (CSS variable `--primary` / `--color-nobel-gold`, utility `text-primary` / `bg-primary` / `border-primary`).
- **Dark Mode**:
  - Keep a warm charcoal palette: `--background: #1C1917`, `--card: #292524`, `--border: #44403C`.

### Typography
- **Headings & Monograms**: Always use `font-serif` (linked to `Playfair_Display`) for titles, branding labels, logo initials, and key metrics.
- **Body & Controls**: Use `font-sans` (linked to `Inter`) for description paragraphs, labels, forms, search fields, and buttons.
- **Header Case & Spacing**: Upper-case section headers or labels should use `tracking-widest` and smaller text sizes (`text-[10px]` or `text-xs`) to maintain an academic feel.

### Accent Details
- **Drop Caps**: For editorial paragraphs, open with the `.drop-cap` utility class.
- **Callout Panels**: For notes or descriptions, wrap in a container with `.gold-callout` or `.border-l-4 border-l-primary` and a light background.
- **Dividers**: Separate key visual sections using the `.gold-divider` class (a narrow gold line: `w-12 h-0.5 bg-primary/60`).

---

## 2. Component Layout & Interactive Elements

- **Borders**: Avoid generic bright/neon lines. Use clean, thin borders: `border border-border` or `border border-stone-200` (light) and `border border-stone-700` (dark).
- **Buttons**:
  - Primary actions and toggles should use a pill shape: `rounded-full`.
  - Color styling should rely on solid stone states: `bg-foreground text-background hover:bg-stone-800 dark:hover:bg-stone-200`.
- **Inputs**: Use stone borders with subtle background fills: `bg-secondary/30 border-border focus-visible:border-primary/60 focus-visible:ring-primary/10`.
- **Navbars**: Implement fixed navigation bars with a soft blur backdrop: `glass-nav` (light: `rgba(249, 248, 244, 0.85)` / dark: `rgba(28, 25, 22, 0.85)`).
- **Cards**: Use soft shadows, clean borders, and gold divider ornaments. Highlight the borders with `--primary` (Nobel Gold) on hover.

---

## 3. Technology Stack & Rules

- **CSS & Tailwind**: Built on Tailwind CSS v4. Custom animations should use predefined transitions (like `transition-colors duration-250`).
- **Icons**: Standardize on `lucide-react`.
- **Animations**: Leverage Framer Motion (`motion/react`) for page transitions and micro-interactions (e.g., spring-based hover translations and scale changes).
- **Verification**: Run `npm run build` after modifications to ensure type safety and build assets compile successfully.

