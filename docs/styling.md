# Styling Guide

## Approach: Pure SCSS

This project uses **pure SCSS** for all styling. There are no CSS-in-JS libraries, no Tailwind, no component UI kits. Every style is written as plain SCSS following a consistent set of conventions.

## Design Tokens via CSS Custom Properties

All design tokens are declared as **CSS Custom Properties** (CSS variables) in `src/styles/_variables.scss`. They are set on the `:root` selector so they are globally available.

```scss
:root {
  --color-primary: #f59e0b; /* Warm amber — reading-lamp glow */
  --color-secondary: #0f172a; /* Midnight slate — immersive background */
  --color-tertiary: #fdf8f0; /* Warm parchment — card surfaces */
  --color-accent: #6366f1; /* Soft indigo — state / information */
  --font-size-default: 1rem;
  --font-weight-bold: 700;
  --radius-md: 0.75rem;
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.3);
  --transition-default: 0.25s ease;
  /* ... */
}
```

### Token Categories

| Category        | Prefix                 | Example                                          |
| --------------- | ---------------------- | ------------------------------------------------ |
| Brand colours   | `--color-{name}`       | `--color-primary`, `--color-secondary`           |
| Accent colours  | `--color-{name}`       | `--color-accent`, `--color-accent-dark`          |
| Neutral colours | `--color-{name}`       | `--color-white`, `--color-gray3`                 |
| Font sizes      | `--font-size-{name}`   | `--font-size-small`, `--font-size-huge`          |
| Font weights    | `--font-weight-{name}` | `--font-weight-bold`                             |
| Line heights    | `--line-height-{name}` | `--line-height-tall`                             |
| Border radius   | `--radius-{name}`      | `--radius-sm`, `--radius-md`, `--radius-lg`      |
| Shadows         | `--shadow-{name}`      | `--shadow-md`, `--shadow-lift`, `--shadow-amber` |
| Transitions     | `--transition-{name}`  | `--transition-default`, `--transition-fast`      |

Using CSS custom properties instead of SCSS variables means tokens are also accessible at runtime (for future dark-mode switching, for example).

## Global Stylesheets

The entry point `src/styles.scss` imports three partials in order:

```scss
@use './styles/variables'; // CSS custom property declarations
@use './styles/reset'; // CSS reset
@use './styles/typography'; // @font-face + base body styles
```

## Component Stylesheets

Each component has its own `.scss` file co-located with its `.ts` and `.html` files. This keeps styles scoped and easy to find.

Component SCSS files can reference the `_variables.scss` partial for SCSS-level constructs (though currently all tokens are CSS custom properties and do not require a SCSS `@use`):

```scss
@use '../../../../styles/variables' as v;
```

## BEM Naming Convention

Component stylesheets use the **BEM** (Block Element Modifier) methodology with full SCSS nesting support:

```scss
.product-card {
  // Block
  &__image-wrapper {
  } // Element
  &__btn {
    // Element
    &--in-cart {
    } // Modifier
    &--compact {
    } // Modifier
  }
}
```

Rules:

- Block = component root class (matches selector, e.g., `.product-card`)
- Element = `&__part-name` (never nest elements inside elements)
- Modifier = `&--modifier` (state or variant)

## Responsive Styling

Responsive behaviour is handled in two complementary ways:

1. **JavaScript signals** (`ResponsiveService`) — for structural layout changes (number of grid columns, whether a section is shown, etc.).
2. **CSS media queries** — for minor presentational tweaks only (font-size bumps, padding adjustments).

Example — grid columns in HomeComponent:

```ts
// In component TS
readonly gridColumns = computed(() => {
  if (this.responsive.isSmaller()) return '1fr';
  if (this.responsive.isSmall()) return '1fr 1fr';
  return '1fr 1fr 1fr';
});
```

```html
<!-- In template -->
<div class="home__grid" [style.grid-template-columns]="gridColumns()"></div>
```

## Typography

Fonts are self-hosted Open Sans variants loaded via `@font-face` in `_typography.scss`. Three weights are defined:

| Weight         | File                    |
| -------------- | ----------------------- |
| 400 (Regular)  | `OpenSans-Regular.ttf`  |
| 600 (SemiBold) | `OpenSans-SemiBold.ttf` |
| 700 (Bold)     | `OpenSans-Bold.ttf`     |

The `font-family: var(--font-family-base)` custom property resolves to `'Open Sans', sans-serif` and is set on `html, body`.

## SCSS File Structure

```
src/styles/
├── _variables.scss     ← Design tokens (CSS custom properties)
├── _reset.scss         ← CSS reset / normalise
└── _typography.scss    ← @font-face + body defaults
src/styles.scss         ← Entry point (@use of all partials)
src/app/**/
└── *.scss              ← Per-component scoped styles
```
