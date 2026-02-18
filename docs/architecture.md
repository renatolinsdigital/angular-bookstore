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
       ├─ Domain (singleton services + shared components + models)
       │    ├─ services/
       │    │    ├─ CartService      — product catalogue + cart state
       │    │    ├─ DownloadService  — purchased items
       │    │    ├─ ResponsiveService — reactive viewport breakpoints
       │    │    └─ ToastService    — ephemeral notification state
       │    ├─ components/
       │    │    ├─ AppHeaderComponent
       │    │    ├─ AppFooterComponent
       │    │    ├─ PageContainerComponent
       │    │    └─ ProductCardComponent
       │    └─ models/   — pure TypeScript interfaces
       └─ Shared utilities
            ├─ CurrencyBrlPipe
            └─ formatToUSD helper
```

## Module Strategy

The project uses **entirely standalone components** — no `NgModule` exists. Each component declares its own `imports` array. This is the official Angular recommendation since v17.

## Lazy Loading

Every page route is lazy-loaded with dynamic `import()`:

```ts
{
  path: 'cart',
  loadComponent: () =>
    import('./pages/cart/cart').then((m) => m.CartComponent)
}
```

Angular's build tool automatically code-splits each lazy route into a separate JavaScript chunk, reducing the initial bundle size.

## Data Flow

```
HTTP GET /data/books.json
   ↓
CartService.products (signal)
   ↓
StoreComponent template (reads signal via @for) + filters via filteredProducts computed signal
   ↓
ProductCardComponent (reads per-item quantity from CartService)
   ↓
User clicks "Add to Cart"
   ↓
CartService.addToCart() mutates cartItems signal
   ↓
AppHeaderComponent re-renders cart badge count (reactive via computed())
```

## Directory Layout

| Directory                    | Purpose                                                             |
| ---------------------------- | ------------------------------------------------------------------- |
| `src/app/domain/models/`     | Pure TypeScript interfaces shared across the app                    |
| `src/app/domain/services/`   | Singleton services holding all application state                    |
| `src/app/domain/components/` | Reusable layout + feature components (header, footer, product card) |
| `src/app/pages/`             | Route-level page components (one folder per route)                  |
| `src/app/shared/`            | Pipes and helpers with no Angular feature dependency                |
| `src/styles/`                | SCSS partials (variables, reset, typography)                        |
| `public/`                    | Static files served at root (images, fonts, JSON data)              |
