# DigitalBookStore

An **Angular** SPA for purchasing digital books, with **Signals** for state management and **SCSS** for styling. Features a landing page, a searchable book catalogue, a shopping cart, and an instant-download purchase flow. The project features lazy-loaded routes and a design token system based on CSS variables.

## Quick Start

```bash
npm install       # Install dependencies
npm run dev       # Start the dev server at http://localhost:4200
```

## Main Stack

- **TypeScript** - Type-safe JavaScript
- **Angular** - Component framework (v21)
- **Angular Signals** - Fine-grained reactive state (no NgRx)
- **Angular Router** - Client-side routing with lazy loading
- **SCSS** - Pure CSS preprocessor with design tokens

## Tools & Libraries

- **Angular CLI** - Project scaffolding, build, and dev server
- **HttpClient** - HTTP requests to static JSON data
- **Sass** - CSS preprocessor with BEM naming conventions
- **Vitest** - Unit testing (Angular CLI default)

### Prerequisites

- Node.js 20+
- Angular CLI: `npm i -g @angular/cli`

## Documentation

For complete documentation, see the `docs/` folder which includes:

- [Architecture](docs/architecture.md) - Overall project structure and data flow
- [State Management](docs/state-management.md) - Signals and service-based state
- [Styling](docs/styling.md) - SCSS conventions and design tokens
- [Visual Design](docs/visual-design.md) - Color rationale, typography, and UI decisions
- [Components](docs/components.md) - Component reference and inputs
- [Angular Practices](docs/angular-practices.md) - Best practices applied

## Technical Implementations of This Project

- ✅ Standalone components — no `NgModule` anywhere in the codebase
- ✅ Signal-based state with `signal()`, `computed()`, and injectable services
- ✅ Lazy-loaded routes via `loadComponent` for optimal bundle splitting
- ✅ Modern `@if` / `@for` built-in control flow (no `*ngIf` / `*ngFor`)
- ✅ `input()` signal API replacing `@Input()` decorators
- ✅ `inject()` function replacing constructor parameter injection
- ✅ `domain/` layer separating services, components, and models from page-level code
- ✅ Design tokens as CSS custom properties in a single `_variables.scss` partial
- ✅ BEM-style SCSS with `&__` / `&--` nesting
- ✅ Self-hosted Open Sans font family via `@font-face`
- ✅ Responsive layout driven by a `ResponsiveService` with named breakpoints
- ✅ Strict TypeScript with `strictTemplates` Angular compiler option

## Features of This Project

- ✅ Landing page with hero section and feature highlights
- ✅ Product catalogue loaded from a static JSON endpoint
- ✅ Real-time search: filter books by title instantly (client-side, signal-powered)
- ✅ Shopping cart with add, subtract, set quantity, and remove actions
- ✅ Cart item badge on the header icon that shows live count, hidden when empty
- ✅ Prices displayed in USD
- ✅ Purchase flow that moves cart items to a download queue
- ✅ Per-item file download on the success page
- ✅ Fully responsive layout across all viewport sizes
- ✅ 404 not-found page with navigation back to the store

---

## Improvement Possibilities

- Dark/light mode toggle
- Authentication / user accounts
- Pagination / infinite scroll
- Real payment integration
- Translation / i18n
