# Architecture Overview

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
