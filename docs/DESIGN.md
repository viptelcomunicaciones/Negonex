# Design System — NegoNEX AI (IIT S.A.S.)

## 1. Identity & Direction

NegoNEX AI uses a **Corporate Deep Navy & Emerald Green** visual system grounded in Figure 1 of the business architecture:
- **Deep Navy** communicates institutional rigor, Zero Trust data security, and cross-border B2B reliability.
- **Emerald Green** communicates conversational fluency, intercultural alignment, and international growth.
- **Light-first presentation (`defaultTheme: 'light'`)** with a full **Dark Navy mode** toggle, calibrated to meet WCAG 2.2 AA contrast (`>= 4.5:1`) across all surfaces and interactive states.

## 2. Color Tokens (`src/styles/theme.css`)

All design tokens override Velocity's contract in `src/styles/theme.css` using OKLCH perceptual color space (Velocity's `src/styles/tokens/` and `src/styles/themes/` remain untouched):

| Role | Light Mode (`:root`) | Dark Mode (`.dark`) | Usage |
|---|---|---|---|
| `--background` | `oklch(99.2% 0.003 245)` | `oklch(13.5% 0.034 248)` | Primary page canvas |
| `--background-secondary` | `oklch(97.2% 0.007 245)` | `oklch(17.5% 0.038 248)` | Alternating section bands & footer |
| `--card` | `oklch(100% 0 0)` | `oklch(17.5% 0.038 248)` | Elevated panels, Sandbox, Pricing cards |
| `--foreground` | `oklch(20% 0.042 248)` | `oklch(95.5% 0.007 245)` | Primary headings & body copy |
| `--foreground-muted` | `oklch(44% 0.022 248)` | `oklch(70% 0.014 245)` | Supporting prose & metadata |
| `--primary` | `oklch(23% 0.055 248)` | `oklch(95.5% 0.007 245)` | Corporate Navy primary actions |
| `--brand-500` / `--brand-600` | `48% / 42% L, 162 H` | `69% / 63% L, 162 H` | Emerald brand emphasis & active markers |
| `--brand-fill` / `--brand-ink` | `var(--brand-600)` / `99% L` | `var(--brand-500)` / `14% L` | High-contrast CTA buttons (`variant="brand"`) |
| `--surface-invert` | `oklch(18.5% 0.052 248)` | `oklch(17.5% 0.038 248)` | Security & Enterprise contrast bands |

Browser surfaces (`::selection`, `caret-color`, `text-underline-offset`, and `.tabular-nums`) are themed directly from the palette.

## 3. Typography (Self-Hosted)

Registered in `astro.config.mjs` via `@fontsource-variable/*` (zero external font requests, strict CSP):
- **Body (`--theme-font-sans`):** `Manrope` (200–800)
- **Display (`--theme-font-display`):** `Outfit` (100–900), weight `700`, tracking `-0.025em`
- **Monospace (`--theme-font-mono`):** `JetBrains Mono` (100–800) — reserved strictly for numeric tables, USD pricing figures (`tabular-nums`), market codes (`US`, `DE`, `AE`, `JP`), and middleware stack badges.

## 4. Brand Assets (`src/assets/branding/` & `public/favicon.svg`)

Vector SVGs representing the Figure 1 mark (globe inside commercial speech bubble transitioning into 5 interconnected neural nodes), authored with pure presentation attributes (`fill`/`stroke`, explicit `viewBox`, no inline `<style>` or `<script>`):
- `logomark.svg` (Deep Navy `#0F2A44` + `var(--logo-accent, #00A878)`)
- `logomark-dark.svg` (Off-white `#F8FAFC` + `var(--logo-accent, #10B981)` — also used by Satori OG image generation)
- `logo-full.svg` & `logo-full-dark.svg` (mark + `NegoNEX AI` wordmark)
- `public/favicon.svg` (48×48 rounded Deep Navy badge)

## 5. Architecture, Islands & Craft Discipline

- **Static-first Astro 7 + React 19 islands:** Pages prerender to static HTML; only `InterculturalSandbox.tsx` and `PricingEstimator.tsx` hydrate (`client:visible`) with 100% localized props passed from `useTranslations(locale)`.
- **Composition rules:** Reuse Velocity blocks (`Hero`, `PageHero`, `StatsBand`, `FeatureGrid`, `Steps`, `Pricing`, `Faq`, `ContactSection`, `Timeline`, `CtaBand`, `Band`); zero eyebrows above headings, zero gradient text, zero emoji icons (Lucide only), single-layer elevation (`border` without double-nested cards), and `prefers-reduced-motion` compliance.
- **Security & Accessibility:** Strict hash-based CSP (`script-src 'self'`), one `<h1>` per page, semantic HTML5 landmarks, ≥44×44px interactive targets, and full keyboard navigation.
