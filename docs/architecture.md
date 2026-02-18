# Architecture Overview

## High-Level Structure

DigitalBookStore is a client-side SPA built with **Angular 21**. There is no backend — product data is loaded from a static JSON file, and "purchases" are simulated by moving items from the cart state into a download state.

```
Browser
  └─ Angular SPA
       ├─ AppComponent (shell)
       │    ├─ AppHeaderComponent
       │    ├─ <router-outlet>  ← lazy page components
       │    └─ AppFooterComponent
       ├─ Core Services (singleton, providedIn: 'root')
       │    ├─ CartService      — product catalogue + cart state
       │    ├─ DownloadService  — purchased items
       │    └─ ResponsiveService — reactive viewport breakpoints
       └─ Shared utilities
            ├─ CurrencyBrlPipe
            └─ formatToBRL helper
```

## Module Strategy

The project uses **entirely standalone components** — no `NgModule` exists. Each component declares its own `imports` array. This is the official Angular recommendation since v17.

## Lazy Loading

Every page route is lazy-loaded with dynamic `import()`:

```ts
{
  path: 'cart',
  loadComponent: () =>
    import('./features/cart/cart').then((m) => m.CartComponent)
}
```

Angular's build tool automatically code-splits each lazy route into a separate JavaScript chunk, reducing the initial bundle size.

## Data Flow

```
HTTP GET /data/books.json
   ↓
CartService.products (signal)
   ↓
StoreComponent template (reads signal via @for)
   ↓
ProductCardComponent (reads per-item quantity from CartService)
   ↓
User clicks "Add to Cart"
   ↓
CartService.addToCart() mutates cartItems signal
   ↓
AppHeaderComponent re-renders cart count (reactive via computed())
```

## Directory Layout

| Directory                | Purpose                                                |
| ------------------------ | ------------------------------------------------------ |
| `src/app/core/models/`   | Pure TypeScript interfaces shared across the app       |
| `src/app/core/services/` | Singleton services holding all application state       |
| `src/app/features/`      | Route-level pages and their child components           |
| `src/app/shared/`        | Pipes and helpers with no Angular feature dependency   |
| `src/styles/`            | SCSS partials (variables, reset, typography)           |
| `public/`                | Static files served at root (images, fonts, JSON data) |
