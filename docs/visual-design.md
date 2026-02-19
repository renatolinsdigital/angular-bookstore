# Visual Design

**Theme:** Midnight Library — dark, warm, immersive.

## Colour Palette

| Role       | Value                 | Usage                                                          |
| ---------- | --------------------- | -------------------------------------------------------------- |
| Background | `#0f172a`             | Page canvas (deep navy)                                        |
| Primary    | `#f59e0b` / `#d97706` | CTAs, prices, cart badge, header border — amber "reading lamp" |
| Surface    | `#1a2d4a` / `#243d61` | Cards and panels; three-layer depth hierarchy                  |
| Accent     | `#6366f1` / `#4f46e5` | In-cart state, info labels, download borders — indigo          |
| Neutral    | `#f9fafb` → `#6b7280` | Text hierarchy, dividers, disabled states                      |

Two-accent grammar: **amber = action/purchase**, **indigo = state/information**.

## Typography

Self-hosted **Open Sans** (400 / 600 / 700). Scale from `--font-size-smallest` (10 px) to `--font-size-huge` (24 px), sized to real content needs.

## Elevation

| Token            | Application                       |
| ---------------- | --------------------------------- |
| `--shadow-sm`    | Small elements                    |
| `--shadow-md`    | Cards (resting), cart panels      |
| `--shadow-lg`    | Modals, overlays                  |
| `--shadow-lift`  | Cards on hover                    |
| `--shadow-amber` | CTA buttons on hover (amber glow) |

## Border Radius

`--radius-sm` 6 px (buttons/badges) · `--radius-md` 12 px (cards) · `--radius-lg` 16 px (panels) · `--radius-full` 9999 px (pills).

## Motion

- **Card hover**: rises 5 px + `--shadow-lift` + cover scales to 1.03×.
- **Button**: rises 1 px on hover, returns on `:active`.
- **Toast**: spring-overshoot enter (`cubic-bezier(0.34, 1.56, 0.64, 1)`), scale from 0.95.
- **Home book illustration**: `@keyframes home-float` — 6 s ease-in-out `translateY(0 → -14px)`. Hidden on mobile.

## Background Glow Pattern

Each page uses two absolutely-positioned radial-gradient blobs (`blur(72px)`, `opacity: 0.18`, `pointer-events: none`): one amber, one indigo. Parent has `position: relative; overflow: hidden`.

## Stats Strips

Used on home (below hero) and success (inside hero card). Amber value + grey label pairs with an amber top-border accent.

## Cover Placeholder

`public/assets/images/cover-placeholder.svg` (620 × 800). Dark navy, amber spine bar, book icon, "NO COVER" label. Triggered by `(error)` on `<img>`.

## Header

`135°` gradient + 2 px amber bottom border. Cart button is a translucent amber chip. An **About** nav link sits between the logo and the cart button, hidden on the smallest viewport (`youJokingRight`).

## Accessibility

- Dark text on parchment surfaces meets WCAG AA (4.5:1).
- Small CTA labels use `--color-secondary` (navy) instead of white for better contrast.
- Focus rings preserved on all interactive elements.
