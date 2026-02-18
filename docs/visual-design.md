# Visual Design Rationale

This document explains the design decisions behind the DigitalBookStore UI — colour palette, typography, spacing, elevation, and micro-interactions — and why they were chosen for a digital book retail context.

---

## Design Theme: "Midnight Library"

The overall aesthetic is best described as **Midnight Library** — a premium, immersive experience that evokes the feeling of browsing a well-lit bookshop late at night. Books are intimate, intellectual objects. The interface should feel the same way: deep, warm, and a little dramatic.

---

## Colour Palette

### Background — Midnight Slate `#0f172a`

> _"Ink on paper."_

The deepest colour in the palette acts as the canvas. A near-black navy — not pure black, which feels harsh — references the deep, quiet atmosphere of late-night reading. It also creates maximum contrast for the warm content surfaces placed on top of it, making book covers pop like they do on a shop shelf.

A subtle radial gradient overlay is applied to the body (indigo tinting top-left, amber tinting bottom-right) to give the background life without distracting from the content.

### Primary Accent — Warm Amber `#f59e0b` / `#d97706`

> _"Reading lamp glow."_

Amber is the color of a warm desk lamp, candlelight, and the golden spines of classic hardcovers. In UI terms, it is used with great restraint — only on the elements that need the most attention:

- **CTA buttons** (Add to Cart, Purchase, Download)
- **Cart item count** in the header
- **Price totals** in the cart
- **Loading spinner** border
- **Footer link** hover colour
- **Header underline border** — a 2px amber rule that anchors the navigation

Because amber sits opposite to the dark navy on the colour wheel (warm vs. cool), it creates tension that draws the eye immediately. This makes conversion-critical actions highly visible without resorting to loud or aggressive reds.

### Surface — Warm Parchment `#fdf8f0` / `#f0e8d8`

> _"The page itself."_

Product cards, cart panels, and full-page content areas use a warm off-white — not a clinical `#ffffff`. This slight warmth references the physical texture of book pages, creating a subliminal association between the digital interface and the tactile pleasure of a real book. It also reduces eye strain on long browsing sessions.

### Accent — Soft Indigo `#6366f1` / `#4f46e5`

> _"A modern voice."_

A secondary accent colour in soft indigo provides a modern counterbalance to the amber warmth. Indigo is used for:

- **"Add More" / in-cart button state** — clearly distinguishes a product that is already in the cart from one that is not
- **Cart totals** and **subtotal prices** — separating "money" information from "action" information
- **Cart item quantity input** focus ring
- **Download item borders** on the success page
- **"Continue Shopping" outline button** in the cart

This two-accent system (amber = action/purchase, indigo = state/information) gives the interface a clear visual grammar that users can internalise quickly.

### Neutral Scale

The grey scale runs from `#f9fafb` (near-white) to `#6b7280` (mid-grey) with six steps. These are used exclusively for:

- Body text hierarchy (title vs. supporting text)
- Borders and dividers
- Disabled/placeholder states

Pure white (`#ffffff`) is reserved only where absolutely necessary. All content surfaces use the parchment tint instead.

---

## Typography

**Open Sans** is the sole typeface. It was chosen because:

- It is highly legible at small sizes (important for book titles and prices in compact cards)
- Its humanist letterforms feel approachable and warm, fitting for a consumer retail context
- It is self-hosted (no external font requests), keeping the app fast

### Type Scale

The scale runs from `0.625rem` (10px) to `2.5rem` (40px) in organic steps rather than a rigid geometric ratio, matching real content needs:

| Token                     | Size | Usage                                   |
| ------------------------- | ---- | --------------------------------------- |
| `--font-size-smallest`    | 10px | Compact button labels on tiny viewports |
| `--font-size-super-small` | 12px | Button labels, tags, quantity badges    |
| `--font-size-small`       | 14px | Book titles on cards, cart item names   |
| `--font-size-default`     | 16px | Body text baseline                      |
| `--font-size-large`       | 18px | Cart item totals, section headings      |
| `--font-size-extra-large` | 20px | Page headings, empty state messages     |
| `--font-size-huge`        | 24px | Cart grand total                        |

The logo uses `--font-size-extra-large` with negative letter-spacing (`-0.025em`) for a tighter, more confident wordmark appearance. The "Book" segment is highlighted in amber (`--color-primary`) to split the compound word visually and reinforce brand identity.

---

## Elevation System

Cards and panels use a three-level box-shadow system to communicate depth and hierarchy:

| Token            | Application                                |
| ---------------- | ------------------------------------------ |
| `--shadow-sm`    | Subtle depth on small elements             |
| `--shadow-md`    | Product cards (resting state), cart panels |
| `--shadow-lg`    | Modals, overlays                           |
| `--shadow-lift`  | Product cards on hover                     |
| `--shadow-amber` | CTA buttons on hover                       |

The `--shadow-amber` token emits a warm amber glow under buttons on hover, reinforcing the warm-light reading metaphor at the interactive level.

---

## Border Radius

A rounded corner system replaces the previous flat `0.25rem` approach:

| Token           | Value  | Usage                       |
| --------------- | ------ | --------------------------- |
| `--radius-sm`   | 6px    | Buttons, badges, inputs     |
| `--radius-md`   | 12px   | Product cards, small panels |
| `--radius-lg`   | 16px   | Cart panel, full-page cards |
| `--radius-full` | 9999px | Pill shapes (future use)    |

Rounder corners soften the interface and signal that this is a consumer product rather than an enterprise tool. They also align with 2024–2026 design trends for retail and e-commerce.

---

## Motion & Transitions

### Card Hover Lift

Product cards rise `5px` on hover with an increased shadow (`--shadow-lift`). This mimics picking a book off a shelf — a direct metaphor for the product domain. The book cover image also scales to `1.03×` simultaneously, giving a sense of the cover coming toward the viewer.

### Button Press Feedback

CTAs rise `1px` on hover and return to their baseline on `:active`, giving tactile press feedback without JavaScript. This is critical for the checkout flow, where users need confidence that their tap registered.

### Toast Animation

Toasts enter with a spring-overshoot animation (`cubic-bezier(0.34, 1.56, 0.64, 1)`), scaling from `0.95` while sliding in. This feels playful and alive, distinct from the calm, deliberate page transitions elsewhere.

---

## Header Design

The header uses a `135°` linear gradient from `--color-secondary` to `--color-secondary-mid` and a `2px solid --color-primary` bottom border. This border serves two purposes:

1. **Visual anchor** — it precisely marks where the persistent navigation ends and the content begins.
2. **Brand recall** — the amber line is the first thing visible after a page transition, reinforcing the brand colour subliminally every time the user scrolls back up.

The cart button is styled as a translucent amber chip (12% amber fill, 30% amber border) rather than a plain icon — making it clearly interactive without competing with the page content.

---

## Why Not Dark Mode Toggle?

The current palette is deliberately single-mode. A dark background was chosen as the _primary_ mode (rather than offering both) because:

- Book cover images look consistently stunning against a dark backdrop
- The amber/parchment contrast ratios are optimised for the dark background
- A single mode reduces CSS complexity significantly

A future dark/light toggle could be implemented via a CSS custom property swap on `:root` — the token architecture already supports this pattern.

---

## Accessibility Notes

- All text on parchment backgrounds (`--color-tertiary`) meets **WCAG AA** (4.5:1) for `--color-dark` text.
- White text on amber CTAs meets **WCAG AA** for large text; for small button labels the `--color-secondary` (navy) text is used instead of white, improving contrast.
- The amber loading spinner has a glow effect that makes it visible to users with sensitivity to low-contrast spinners.
- Focus rings are preserved on all interactive elements (not suppressed globally).
