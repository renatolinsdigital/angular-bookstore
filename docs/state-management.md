# State Management

DigitalBookStore uses **Angular Signals** as its state management solution. There is no NgRx, Redux, or other external state library.

## Why Signals?

Angular Signals (stable since v17) provide:

- **Fine-grained reactivity** — only components that read a changed signal re-render.
- **Zero boilerplate** — no actions, reducers, or selectors scaffolding required.
- **First-class Angular integration** — `computed()`, `effect()`, and template signal bindings are built-in.
- **Tree-shake friendly** — no additional runtime library is bundled.

## CartService

`src/app/domain/services/cart.service.ts`

### State Signals

| Signal      | Type                     | Description                                      |
| ----------- | ------------------------ | ------------------------------------------------ |
| `products`  | `Signal<Product[]>`      | All products loaded from the API                 |
| `cartItems` | `Signal<CartItem[]>`     | Items currently in the cart                      |
| `status`    | `Signal<LoadStatus>`     | `'idle' \| 'loading' \| 'succeeded' \| 'failed'` |
| `error`     | `Signal<string \| null>` | Error message when loading fails                 |

### Computed Signals

| Computed           | Type             | Formula                 |
| ------------------ | ---------------- | ----------------------- |
| `cartTotal`        | `Signal<number>` | `sum(price × quantity)` |
| `totalItemsInCart` | `Signal<number>` | `sum(quantity)`         |

### Methods (State Mutations)

```ts
loadProducts(); // Fetches products once (guards against re-fetch)
addToCart(id); // Increments quantity or pushes new CartItem (no-op if UNIQUE_PURCHASE and item already in cart)
subtractFromCart(id); // Decrements quantity or removes item
removeFromCart(id); // Removes item regardless of quantity
emptyCart(); // Clears all cart items
setQuantity(id, qty); // Sets exact quantity (no-op when UNIQUE_PURCHASE is true)
getQuantityById(id); // Read-only helper (not a signal)
```

### UNIQUE_PURCHASE mode

The `UNIQUE_PURCHASE` injection token (see `src/app/app.tokens.ts`) controls whether a product may appear more than once in an order.

| `UNIQUE_PURCHASE` | `addToCart` behaviour      | Quantity controls in cart |
| ----------------- | -------------------------- | ------------------------- |
| `true` (default)  | Adds once; ignores repeats | Hidden                    |
| `false`           | Increments quantity freely | Visible                   |

`CartService` reads the token eagerly at injection time:

```ts
readonly uniquePurchase = inject(UNIQUE_PURCHASE);
```

The `CartItemCardComponent` also injects the token and passes it to the template to toggle the quantity column visibility.

## DownloadService

`src/app/domain/services/download.service.ts`

Simple service that holds the list of items a user has "purchased". Items are deduplicated by ID.

```ts
downloadItems: Signal<CartItem[]>
proceedToDownload(items: CartItem[]): void
```

The purchase flow in `CartComponent`:

```ts
onPurchase(): void {
  this.downloadService.proceedToDownload(this.cartService.cartItems());
  this.cartService.emptyCart();
  this.router.navigate(['/success']);
}
```

## ResponsiveService

`src/app/domain/services/responsive.service.ts`

Maintains reactive viewport-size breakpoints as named tokens. Components use its computed signals to adapt their layout and behaviour.

### Breakpoints

| Name | Width Range |
| ---- | ----------- |
| `jk` | ≤ 330px     |
| `ss` | ≤ 480px     |
| `xs` | < 768px     |
| `sm` | < 960px     |
| `md` | < 1280px    |
| `lg` | < 1920px    |
| `xl` | ≥ 1920px    |

### Exported Signals

| Signal                 | Meaning                         |
| ---------------------- | ------------------------------- |
| `isSmaller`            | width ≤ `xs` (< 768px)          |
| `isSmall`              | width ≤ `sm` (< 960px)          |
| `isSuperSmall`         | width or height ≤ `ss`          |
| `youJokingRight`       | extreme tiny viewport (≤ 330px) |
| `isDesktopBigScreen`   | width ≥ `md` (≥ 1280px)         |
| `isDesktopSmallScreen` | 960 ≤ width < 1280px            |

### Usage in Components

```ts
protected readonly responsive = inject(ResponsiveService);
```

In the template:

```html
<div [class.compact]="responsive.youJokingRight()">...</div>
```

## Signal Reactivity Pattern

All signals are read in templates using `signal()` call syntax. Angular's template engine automatically creates a reactive context and updates the view when any read signal changes.

```html
<!-- Reactive cart count in header -->
{{ cartService.totalItemsInCart() }} {{ cartService.totalItemsInCart() === 1 ? 'item' : 'items' }}
```

No manual subscriptions or unsubscription is needed.
