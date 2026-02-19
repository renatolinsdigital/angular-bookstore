# Styling Guide

Pure SCSS, no CSS-in-JS, no Tailwind. All tokens are CSS custom properties in `src/styles/_variables.scss`.

## File Structure

```
src/styles/
├── _variables.scss   ← CSS custom properties (:root)
├── _reset.scss       ← CSS reset
└── _typography.scss  ← @font-face + body defaults
src/styles.scss       ← entry point
src/app/**/*.scss     ← per-component scoped styles
```

## Design Tokens

Tokens use consistent prefixes. All are CSS custom properties, accessible at runtime.

| Prefix                | Examples                                                |
| --------------------- | ------------------------------------------------------- |
| `--color-{name}`      | `--color-primary` (#f59e0b), `--color-accent` (#6366f1) |
| `--font-size-{name}`  | `--font-size-small`, `--font-size-huge`                 |
| `--radius-{name}`     | `--radius-sm`, `--radius-md`, `--radius-lg`             |
| `--shadow-{name}`     | `--shadow-md`, `--shadow-lift`, `--shadow-amber`        |
| `--transition-{name}` | `--transition-default`, `--transition-fast`             |

## BEM Naming

Block = component root class. Element = `&__name`. Modifier = `&--name`. Never nest elements inside elements.

```scss
.product-card {
  &__image-wrapper {
  }
  &__btn {
    &--in-cart {
    }
  }
}
```

## Background Glow Pattern

Every full-width page uses two absolutely-positioned radial-gradient blobs (amber + indigo) with `filter: blur(72px)` and `pointer-events: none` to create ambient depth. The parent has `position: relative; overflow: hidden`.

## Responsive Styling

Structural layout changes (column count, section visibility) use `ResponsiveService` signals. CSS media queries handle minor presentational tweaks only (font sizes, padding).

## Typography

Self-hosted Open Sans (400, 600, 700) via `@font-face` in `_typography.scss`. Applied globally via `--font-family-base`.

## Cover Placeholder

`public/assets/images/cover-placeholder.svg` (620 × 800, dark navy) is used as the fallback when a product image 404s. Triggered via the `(error)` event — not a template expression:

```html
<img [src]="imageUrl()" (error)="$any($event.target).src = 'assets/images/cover-placeholder.svg'" />
```
