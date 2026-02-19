# State Management

This application uses Angular Signals only, no NgRx or external library.

## CartService

`src/app/domain/services/cart.service.ts`

| Signal / Computed  | Type                 | Description                              |
| ------------------ | -------------------- | ---------------------------------------- |
| `products`         | `Signal<Product[]>`  | All products from API                    |
| `cartItems`        | `Signal<CartItem[]>` | Current cart                             |
| `status`           | `Signal<LoadStatus>` | `idle \| loading \| succeeded \| failed` |
| `cartTotal`        | `Signal<number>`     | `sum(price × quantity)`                  |
| `totalItemsInCart` | `Signal<number>`     | `sum(quantity)`                          |

Key methods: `loadProducts()`, `addToCart(id)`, `subtractFromCart(id)`, `removeFromCart(id)`, `emptyCart()`, `setQuantity(id, qty)`, `getQuantityById(id)`.

### UNIQUE_PURCHASE mode

Controlled by the `UNIQUE_PURCHASE` injection token (`src/app/app.tokens.ts`).

| Value            | `addToCart` behaviour      | Quantity controls |
| ---------------- | -------------------------- | ----------------- |
| `true` (default) | Adds once; ignores repeats | Hidden            |
| `false`          | Increments freely          | Visible           |

## DownloadService

`src/app/domain/services/download.service.ts` — holds purchased items (deduplicated by ID).

```ts
downloadItems: Signal<CartItem[]>
proceedToDownload(items: CartItem[]): void
```

## Purchase Flow (CartComponent)

```ts
// Signal that controls checkout modal visibility
checkoutOpen = signal(false);

// User clicks "Purchase" → open the checkout modal
onPurchase(): void {
  this.checkoutOpen.set(true);
}

// CheckoutModalComponent emits (confirmed) → finalise order
onPaymentConfirmed(): void {
  this.downloadService.proceedToDownload(this.cartService.cartItems());
  this.cartService.emptyCart();
  this.router.navigate(['/success']);
}

// CheckoutModalComponent emits (cancelled) → close modal
onPaymentCancelled(): void {
  this.checkoutOpen.set(false);
}
```

`CheckoutModalComponent` (`src/app/domain/components/checkout-modal/`) emits `(confirmed)` or `(cancelled)`. Supports PIX, PayPal, Credit Card (all mocked, 1.4 s simulated delay).

## ResponsiveService

`src/app/domain/services/responsive.service.ts` — reactive viewport breakpoints.

Key signals: `isSmaller` (< 768 px), `isSmall` (< 960 px), `isSuperSmall` (≤ 480 px), `youJokingRight` (≤ 330 px), `isDesktopBigScreen` (≥ 1280 px).

```ts
protected readonly responsive = inject(ResponsiveService);
```
