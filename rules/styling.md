# MyTaalim Styling Guidelines & Design System

To ensure the premium, editorial design of the application remains consistent, all agents and contributors must adhere to the following design patterns and styling conventions.

---

## 1. Design System & Theme

### Color Palette (Stone & Nobel Gold)
- **Backgrounds**:
  - Cream/Paper background: `#F9F8F4` (CSS variable `--background`, utility `bg-background`).
  - Warm stone light backgrounds: `#F5F4F0` (CSS variable `--secondary` / `--muted`, utility `bg-secondary` or `bg-muted`).
- **Foregrounds & Text**:
  - Headings: Deep Stone `#1C1917` (Stone-900).
  - Body Text: Charcoal Stone `#292524` (Stone-800).
  - Muted Labels: Warm Gray `#78716C` (Stone-500).
- **Accents**:
  - **Nobel Gold**: `#C5A059` (CSS variable `--primary` / `--color-nobel-gold`, utility `text-primary` / `bg-primary` / `border-primary`).
- **Dark Mode**:
  - Warm charcoal palette:
    - `--background: #1C1917` (Stone-900)
    - `--card: #292524` (Stone-800)
    - `--border: #44403C` (Stone-700)
    - `--secondary: #44403C`
    - `--foreground: #F5F4F0`

---

## 2. Typography

- **Headings & Monograms**: Always use `font-serif` (linked to `Playfair_Display`) for titles, branding labels, logo initials, and key metrics.
- **Body & Controls**: Use `font-sans` (linked to `Inter`) for description paragraphs, labels, forms, search fields, and buttons.
- **Header Case & Spacing**: Upper-case section headers or labels should use `tracking-widest` and smaller text sizes (`text-[10px]` or `text-xs`) to maintain an academic, editorial aesthetic.
- **Arabic / RTL Typography**: When `dir="rtl"`, typography automatically falls back to Arabic fonts (`Geeza Pro`, `Noto Naskh Arabic`, `Noto Sans Arabic`, Tahoma). Always ensure headings retain serif/naskh aesthetic in RTL.

---

## 3. Accent Details & Editorial Utilities

Defined in `app/globals.css`:
- **Drop Caps**: For editorial paragraphs or introductory articles, open with the `.drop-cap` utility class:
  ```html
  <p class="drop-cap">This playlist introduces the fundamentals...</p>
  ```
- **Callout Panels**: For notes or key takeaways, wrap in a container with `.gold-callout`:
  ```html
  <div class="gold-callout">Important note or description</div>
  ```
- **Dividers**: Separate key visual sections using the `.gold-divider` class (a narrow gold line: `w-12 h-0.5 bg-nobel-gold/80 my-4`).
- **Glassmorphism Panels**:
  - `.glass-panel`: Card background with `backdrop-filter: blur(16px)` and border.
  - `.glass-nav`: Fixed navigation bar with blur backdrop (light: `rgba(249, 248, 244, 0.85)` / dark: `rgba(28, 25, 22, 0.85)`).
- **Equalizer Animations**: Use `.eq-bar` with `.eq-bar-1` through `.eq-bar-4` for playback and progress indicators.

---

## 4. Component Layout & Interactive Elements

- **Borders**: Avoid generic bright/neon lines. Use clean, thin borders:
  - Light mode: `border border-border` or `border border-stone-200`.
  - Dark mode: `border border-stone-700` or `border border-border`.
- **Buttons**:
  - Primary actions and toggles should use a pill shape: `rounded-full`.
  - Color styling should rely on solid stone states: `bg-foreground text-background hover:bg-stone-800 dark:hover:bg-stone-200`.
- **Inputs**:
  - Use stone borders with subtle background fills:
    `bg-secondary/30 border-border focus-visible:border-primary/60 focus-visible:ring-primary/10`.
- **Cards**:
  - Use soft shadows, clean borders, and gold divider ornaments.
  - Highlight borders with `--primary` (Nobel Gold) or increase scale slightly on hover (`hover:border-primary/60 transition-colors`).
- **Scrollbars**:
  - Styled with custom gold-tinted scrollbars (`::-webkit-scrollbar-thumb` with Nobel Gold opacity).

---

## 5. Technology Stack & Rules

- **CSS & Tailwind**: Built on Tailwind CSS v4 using `@theme inline` tokens. Custom transitions should use standard easing (e.g. `transition-colors duration-250`).
- **Icons**: Standardize strictly on `lucide-react`.
- **Animations**: Leverage Framer Motion (`motion/react`) for page transitions, modals, and micro-interactions (spring-based hover translations and scale changes).
