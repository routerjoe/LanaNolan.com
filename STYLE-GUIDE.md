# Player Profile Website — Style Guide (v1)

This guide captures the target look & feel for the site and maps concrete implementation notes to the current codebase for fast adoption.

## Overall Vibe

- Clean, collegiate, recruiter-friendly. Lots of white space, big numbers, zero clutter.
- Mobile-first; readable at arm’s length.
- Minimal motion; subtle polish.

## Color Palette

- Primary (base text / UI): Indigo/Navy — `#1e293b` (slate-800)
- Background: Off-white — `#f8fafc` (slate-50)
- Accent (CTA/links): Cyan — `#06b6d4` (cyan-500)
- Secondary accent (sparingly): Rose — `#f43f5e` (rose-500)
- Gradients allowed: indigo → cyan with ~10–15% overlay over hero photo

Recommended CSS variables to add in root (do not apply yet if you’re mid-iteration):
```css
:root {
  /* Base */
  --bg: #f8fafc;          /* slate-50 */
  --fg: #1e293b;          /* slate-800 */

  /* Accent */
  --accent: #06b6d4;      /* cyan-500 */
  --accent-700: #0e7490;  /* cyan-700 */

  /* Secondary accent */
  --highlight: #f43f5e;   /* rose-500 */

  /* Hero gradient stops */
  --hero-from: #1e293b;   /* indigo/slate */
  --hero-to: #06b6d4;     /* cyan */
}
```

Where to implement later:
- Update CSS vars in [globals.css](src/app/globals.css:6)
- Replace green palette references in classes/tokens with the above palette

## Typography

- Headings: Bebas Neue (or Oswald) — tall, athletic numberboard feel
- Body/UI: Inter (fallback: system-ui)
- Scale:
  - H1: 42–56
  - H2: 28–36
  - Body: 16–18
  - Stat numerals: 40–64

Project font wiring:
- Added Bebas Neue font variable in [layout.tsx](src/app/layout.tsx:1) and included it on html class [layout.tsx](src/app/layout.tsx:54).
- To adopt Bebas for headings, update heading classes in [globals.css](src/app/globals.css:186) to use `var(--font-bebas)` instead of `var(--font-poppins)` (planned change).

Example heading class (planned):
```css
.heading-xl {
  font-family: var(--font-bebas), var(--font-poppins), system-ui, sans-serif;
  font-size: clamp(2.625rem, 5vw, 3.5rem); /* 42–56 approx */
  line-height: 1.1;
  letter-spacing: 0.015em;
}
```

## Layout Patterns

- Hero:
  - Full-bleed photo with soft gradient overlay.
  - Left-aligned text block (Name, positions/class year, CTA row).
  - Two CTAs: Primary “Contact” (cyan), Secondary “Twitter/X”.
- Sections:
  - Carded blocks on a neutral background.
  - Spacing: 8–12px gaps on mobile, 24–32px on desktop.
- Grid:
  - Stats 2×3 on mobile → 3×4+ on desktop; consistent card heights.
- Edge:
  - rounded-2xl
  - subtle shadows (`shadow-md`/`shadow-lg`) only on hover.

Hero mapping in code:
- Desktop: image now sits on the right at 50% smaller than original right column, with all text/CTAs/stats on the left [Hero.tsx](src/components/sections/Hero.tsx:296).
- Mobile: image block sits above quick stats, below the headline [Hero.tsx](src/components/sections/Hero.tsx:270).

## Components

- Badge row: “Class of 2027”, positions, throws/bats as pill badges.
- Stat tiles:
  - Big numeral, small label; icon optional.
  - Cyan underline on hover.
- Highlights:
  - 2-column mobile → 3–4 column desktop thumbnail grid.
  - Lazy-load; click opens external video link.
- Schedule:
  - Simple table (date | opponent | result | link).
- Contact card:
  - `mailto: lananolan08@gmail.com`
  - Twitter: `@LanaNolan02`
  - Optional: QR quick contact.

## Motion

- Minimal:
  - fade/slide-up on enter (Framer Motion), 150–250ms; standard easing.
- Disable heavy parallax; subtle hover micro-interactions only:
  - 1–2px lift, 3–5% scale on thumbnails.

## Imagery

- Hero:
  - Crisp action shot; avoid heavy filters.
  - Subject positioned left or right to balance text.
  - Keep face/ball inside safe area.
- Overlay:
  - Soft gradient indigo → cyan with ~10–15% density.

Hero image source:
- Admin-driven via [photos-config.json](src/data/photos-config.json:34) using `activePhotos.heroImage`, fallback to `featuredAction`, then gradient svg.

## Accessibility

- Contrast AA+ for text on overlays (≥4.5:1).
- Hit targets ≥44×44px; visible focus; respect reduced motion.

## Example Section Order

1. Hero (Name, positions/class, CTAs)
2. Quick stats strip (5–8 tiles)
3. Bio & academics (GPA/coursework)
4. Highlights grid
5. Schedule/results
6. Contact + socials

## Tailwind Tokens (Reference)

- Containers:
  - `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- Card:
  - `rounded-2xl bg-white shadow-sm hover:shadow-lg transition`
- Headings:
  - `tracking-tight font-semibold` (H1 uses Bebas/Oswald)
- Accent:
  - `text-cyan-600 hover:text-cyan-700`
  - `bg-cyan-600 hover:bg-cyan-700`

Palette-class alignment (planned replacements):
- Primary text/bg use slate scale (`text-slate-800`, `bg-slate-50`).
- Accent CTAs/links use cyan scale.
- Highlights/warnings use rose scale, sparingly.

## Implementation Map (Actionable)

Planned incremental changes (safe order):
1) Typography
   - Update heading font-family to Bebas Neue in [globals.css](src/app/globals.css:186).
   - Keep Inter for body text (already configured in [layout.tsx](src/app/layout.tsx:6)).

2) Color tokens (non-breaking, staged)
   - Add new CSS vars in [globals.css](src/app/globals.css:6) (do not remove existing yet).
   - Start migrating component classes from green to cyan/slate in visible CTAs and headlines.

3) Hero gradient overlay
   - Use `from-[var(--hero-from)] to-[var(--hero-to)]` with opacity layer ~10–15%.
   - The gradient scaffolding is present in [Hero.tsx](src/components/sections/Hero.tsx:165); adjust stops after color var rollout.

4) Stat tiles
   - Enforce consistent card height and add cyan underline hover state in [sections/PlayerProfile.tsx](src/components/sections/PlayerProfile.tsx:1) and related stat components.

5) Hover micro-interactions
   - Use existing `.card-hover` in [globals.css](src/app/globals.css:168) or Tailwind utilities (`hover:shadow-lg`, small translate/scale).

6) Accessibility pass
   - Ensure all overlay contrasts meet AA; verify sizes of tap targets in CTAs and stats.

## Notes

- Current hero image requests for `/images/hero.jpg` return 404s; Admin upload flow should set `activePhotos.heroImage` to a valid `/uploads/...` path to render immediately.
- Desktop image is reduced to 50% of the right column width (25% of container), keeping all text/CTAs/stats on the left [Hero.tsx](src/components/sections/Hero.tsx:296).