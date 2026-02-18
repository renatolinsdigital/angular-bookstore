# Component Reference

All components are **standalone** Angular components — they declare their own `imports` arrays and do not belong to any `NgModule`.

---

## Layout Components

### `AppHeaderComponent`

**Selector:** `app-header`  
**Path:** `src/app/domain/components/app-header/`

Displays the store logo (navigates to `/`), a **Browse** button (navigates to `/store`), and a cart icon button (navigates to `/cart`). The cart button shows an amber badge dot with the item count when the cart is non-empty; the badge is hidden when the cart is empty. Adapts its layout for small viewports using `ResponsiveService` signals.

**Injected Services:** `CartService`, `ResponsiveService`, `Router`

---

### `AppFooterComponent`

**Selector:** `app-footer`  
**Path:** `src/app/domain/components/app-footer/`

Simple footer with developer credit link. Switches between row and column flex layout based on `responsive.youJokingRight()`.

**Injected Services:** `ResponsiveService`

---

### `PageContainerComponent`

**Selector:** `app-page-container`  
**Path:** `src/app/domain/components/page-container/`

Generic page wrapper that constrains content to `max-width: 1080px` and shows a loading spinner when `[isContentLoading]="true"`.

**Inputs:**
| Input | Type | Default | Description |
|---|---|---|---|
| `isContentLoading` | `boolean` | `false` | Shows spinner instead of content |
| `isVertical` | `boolean` | `true` | `column` vs `row` flex direction |

---

## Page Components

### `HomeComponent`

**Selector:** `app-home` (lazy route `/`)  
**Path:** `src/app/pages/home/`

Hero landing page shown at the root URL. Contains a headline, subtitle, and a "Browse the Store" CTA button that navigates to `/store`. Below the hero, three feature cards highlight key store benefits. Adapts layout for small viewports.

**Injected Services:** `ResponsiveService`, `Router`

---

### `StoreComponent`

**Selector:** `app-store` (lazy route `/store`)  
**Path:** `src/app/pages/store/`

Book catalogue page. Triggers `CartService.loadProducts()` on init. Features:

- **Page header** — title + subtitle
- **Search box** — filters the product grid in real-time by book title via a `searchQuery` signal and a `filteredProducts` computed signal (case-insensitive, client-side)
- **Product grid** — responsive column count driven by `ResponsiveService` breakpoints
- **Empty state** — shown when the search query matches no books

**Key signals:**
| Signal | Type | Description |
|---|---|---|
| `searchQuery` | `WritableSignal<string>` | Current search input value |
| `filteredProducts` | `Signal<Product[]>` | Products matching the query |
| `gridColumns` | `Signal<string>` | CSS grid-template-columns value |

---

### `CartComponent`

**Selector:** `app-cart` (lazy route `/cart`)  
**Path:** `src/app/pages/cart/`

Shows either an empty-cart illustration + CTA, or the full list of `CartItemCard` rows, a totals row, and Purchase / Continue Shopping buttons.

**Purchase flow:**

1. Dispatches `downloadService.proceedToDownload(cartItems)`
2. Calls `cartService.emptyCart()`
3. Navigates to `/success`

---

### `CartItemCardComponent`

**Selector:** `app-cart-item-card`  
**Path:** `src/app/pages/cart/cart-item-card/`

Displays a single cart row with: product image, name, price, quantity controls (+/−/input), and a remove button.

**Inputs:**
| Input | Type | Default |
|---|---|---|
| `itemId` | `string` | required |
| `itemName` | `string` | required |
| `itemPrice` | `number` | required |
| `quantity` | `number` | `0` |
| `imageUrl` | `string?` | `undefined` |
| `hasHeader` | `boolean` | `false` |

The `hasHeader` input controls whether column labels (PRODUCT / QUANTITY / PRICE) are shown — only the first row uses `[hasHeader]="true"`.

---

### `ProductCardComponent`

**Selector:** `app-product-card`  
**Path:** `src/app/domain/components/product-card/`

Renders a single product tile. The Add to Cart button simulates a 200 ms async operation and shows a spinner while loading.

**Inputs:**
| Input | Type | Default |
|---|---|---|
| `productId` | `string` | required |
| `title` | `string` | required |
| `price` | `number` | required |
| `imageUrl` | `string?` | `undefined` |

The button colour changes from secondary (blue) to primary (red) once the item is in the cart.

---

### `SuccessComponent`

**Selector:** `app-success` (lazy route `/success`)  
**Path:** `src/app/pages/success/`

Lists all purchased items from `DownloadService.downloadItems()`. Each item has a Download button that programmatically triggers a file download via `<a download>`.

---

### `NotFoundComponent`

**Selector:** `app-not-found` (wildcard route `**`)  
**Path:** `src/app/pages/not-found/`

404 fallback page rendered for any unmatched route. Provides a button to return to the store.

---

## Shared Components

### `ToastContainerComponent`

**Selector:** `app-toast-container`  
**Path:** `src/app/shared/components/toast/`

Fixed-position overlay that renders ephemeral toast notifications from `ToastService`. Toasts auto-dismiss after a configurable timeout.

---

### `NotFoundComponent`

**Selector:** `app-not-found` (lazy route `**`)  
**Path:** `src/app/pages/not-found/`

Generic 404 page with a CTA back to the home page.

---

## Shared Utilities

### `CurrencyBrlPipe`

**Name:** `currencyBrl`  
**Path:** `src/app/shared/pipes/currency-brl.pipe.ts`

Formats a number as Brazilian Real currency using `Intl.NumberFormat` (via `toLocaleString`).

```html
{{ product.price | currencyBrl }}
<!-- → R$ 9,99 -->
```

### `formatToBRL(value: number): string`

**Path:** `src/app/shared/helpers/currency.helper.ts`

Pure function wrapping `Number.prototype.toLocaleString` with `pt-BR` / `BRL` options. Used by the pipe and directly where needed.
