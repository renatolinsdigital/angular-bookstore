# DigitalBookStore

An **Angular** SPA for browsing and purchasing digital books, with **Signals** for state management and **SCSS** for styling. Follows a feature-driven architecture with lazy-loaded routes, a service-based state layer, and a design token system backed by CSS custom properties.

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

## Quick Start

To understand the project's styling conventions, refer to the [Styling Guide](docs/styling.md).

### Prerequisites

- Node.js 20+
- Angular CLI: `npm i -g @angular/cli`

## Development

### Available Scripts

```bash
# Development
npm run dev             # Start development server with hot reload

# Building
npm run build             # Compile and optimize for production
npm run watch     # Development watch mode with rebuild

# Testing
npm run test              # Run unit tests with Vitest
```

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
- ✅ Design tokens as CSS custom properties in a single `_variables.scss` partial
- ✅ BEM-style SCSS with `&__` / `&--` nesting — no styling libraries
- ✅ Self-hosted Open Sans font family via `@font-face`
- ✅ Responsive layout driven by a `ResponsiveService` with named breakpoints
- ✅ Strict TypeScript with `strictTemplates` Angular compiler option

## Features of This Project

- ✅ Product catalogue loaded from a static JSON endpoint
- ✅ Shopping cart with add, subtract, set quantity, and remove actions
- ✅ Persistent cart total and item count in the header (reactive via `computed()`)
- ✅ Purchase flow that moves cart items to a download queue
- ✅ Per-item file download on the success page
- ✅ Fully responsive layout across all viewport sizes
- ✅ 404 not-found page with navigation back to the store

---

## Improvement Possibilities

- Dark/light mode toggle (CSS custom property swap)
- Authentication / user accounts
- Pagination / infinite scroll
- Real payment integration
- Translation / i18n
