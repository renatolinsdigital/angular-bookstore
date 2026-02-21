# Architecture Overview

All components are standalone (no `NgModule`). Every page route is lazy-loaded via `loadComponent`.

## Routes

| Path           | Component           | Purpose                              |
| -------------- | ------------------- | ------------------------------------ |
| `/`            | `HomeComponent`     | Landing page                         |
| `/store`       | `StoreComponent`    | Searchable product catalogue         |
| `/cart`        | `CartComponent`     | Shopping cart + checkout modal       |
| `/success`     | `SuccessComponent`  | Post-purchase download page          |
| `/about`       | `AboutComponent`    | Project overview, stack, and credits |
| `/details/:id` | `DetailsComponent`  | Product detail with full description |
| `**`           | `NotFoundComponent` | 404 fallback                         |

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

| Token             | Type             | Default | Effect                                                          |
| ----------------- | ---------------- | ------- | --------------------------------------------------------------- |
| `UNIQUE_PURCHASE` | `boolean`        | `true`  | One copy per product per order; hides quantity controls in cart |
| `CURRENCY`        | `'usd' \| 'brl'` | `'usd'` | Display currency for all prices (`$` or `R$`)                   |

Override example:

```ts
{ provide: UNIQUE_PURCHASE, useValue: false }
{ provide: CURRENCY, useValue: 'brl' }
```

## Directory Layout

| Path                         | Purpose                                                                           |
| ---------------------------- | --------------------------------------------------------------------------------- |
| `src/app/app.tokens.ts`      | `InjectionToken` definitions                                                      |
| `src/app/domain/models/`     | Shared TypeScript interfaces                                                      |
| `src/app/domain/services/`   | Singleton services (state)                                                        |
| `src/app/domain/components/` | Domain-specific components (header, footer, product card, checkout modal)         |
| `src/app/pages/`             | Route-level page components                                                       |
| `src/app/shared/components/` | Generic reusable components (button, paginator, toast, page-container, meta-chip) |
| `src/app/shared/`            | Pipes, helpers, and generic reusable components                                   |
| `src/styles/`                | SCSS partials                                                                     |
| `public/`                    | Static files served at root                                                       |
