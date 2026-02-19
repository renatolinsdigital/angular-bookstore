# Architecture Overview

All components are standalone (no `NgModule`). Every page route is lazy-loaded via `loadComponent`.

## Data Flow

```
HTTP GET /data/books.json
   ↓
CartService.products (signal)
   ↓
StoreComponent → ProductCardComponent
   ↓
CartService.addToCart() → AppHeaderComponent badge (computed)
   ↓
/cart → "Purchase" → CheckoutModalComponent (PIX / PayPal / Credit Card, mocked)
   ↓
DownloadService.proceedToDownload() + CartService.emptyCart() → /success
```

## Configuration Tokens

Defined in `src/app/app.tokens.ts`, provided in `src/app/app.config.ts`.

| Token             | Type      | Default | Effect                                                          |
| ----------------- | --------- | ------- | --------------------------------------------------------------- |
| `UNIQUE_PURCHASE` | `boolean` | `true`  | One copy per product per order; hides quantity controls in cart |

Override: `{ provide: UNIQUE_PURCHASE, useValue: false }`

## Directory Layout

| Path                         | Purpose                                                          |
| ---------------------------- | ---------------------------------------------------------------- |
| `src/app/app.tokens.ts`      | `InjectionToken` definitions                                     |
| `src/app/domain/models/`     | Shared TypeScript interfaces                                     |
| `src/app/domain/services/`   | Singleton services (state)                                       |
| `src/app/domain/components/` | Shared components (header, footer, product card, checkout modal) |
| `src/app/pages/`             | Route-level page components                                      |
| `src/app/shared/`            | Pipes and helpers                                                |
| `src/styles/`                | SCSS partials                                                    |
| `public/`                    | Static files served at root                                      |
