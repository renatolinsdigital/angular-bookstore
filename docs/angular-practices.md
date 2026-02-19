# Angular Best Practices

## Standalone Components

All components, directives, and pipes are standalone (no `NgModule`). Each component declares its own `imports` array.

```ts
@Component({
  selector: 'app-product-card',
  imports: [CurrencyBrlPipe],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
})
export class ProductCardComponent {}
```

## Signal-Based State

Signals replace `BehaviorSubject` and `ChangeDetectorRef`. Derived values use `computed()`.

```ts
readonly cartItems = signal<CartItem[]>([]);
readonly cartTotal = computed(() =>
  this.cartItems().reduce((sum, i) => sum + i.price * i.quantity, 0)
);
```

## `inject()` Function

Use `inject()` instead of constructor injection.

```ts
export class CartComponent {
  protected readonly cartService = inject(CartService);
}
```

## Input Signals

All inputs use `input()` instead of `@Input()`.

```ts
readonly productId = input.required<string>();
readonly quantity  = input(0);
```

## Modern Control Flow

Use `@if`, `@for`, `@switch` instead of `*ngIf` / `*ngFor`.

```html
@if (cartService.cartItems().length === 0) {
<div class="cart__empty">...</div>
} @else {
<div class="cart__list">...</div>
} @for (product of cartService.products(); track product.id) {
<app-product-card [productId]="product.id" />
}
```

## InjectionToken for Configuration

App flags live in `src/app/app.tokens.ts` as typed `InjectionToken`s, overridable in tests.

```ts
export const UNIQUE_PURCHASE = new InjectionToken<boolean>('UNIQUE_PURCHASE', {
  providedIn: 'root',
  factory: () => true,
});
```

```ts
// Override in app.config.ts or TestBed
{ provide: UNIQUE_PURCHASE, useValue: false }
```

## Lazy-Loaded Routes

```ts
{
  path: 'cart',
  loadComponent: () => import('./pages/cart/cart').then((m) => m.CartComponent)
}
```

## `prefer computed` over getters

Use `computed()` for reactive derived state to avoid `NG0100` errors in tests.

```ts
// ✅
protected readonly quantityInCart = computed(() =>
  this.cartService.getQuantityById(this.productId())
);
// ❌ getter — Angular cannot track reactivity
```

## Unit Testing

Vitest via `@angular/build:unit-test`. Tests co-located in `.spec.ts` files.

```ts
await TestBed.configureTestingModule({
  imports: [ProductCardComponent],
  providers: [{ provide: CartService, useValue: mockCartService }],
}).compileComponents();
```

Mock signals with real `signal()` instances so the reactivity graph stays intact. Set signal inputs via `fixture.componentRef.setInput()`.

## Code Quality

- **ESLint** (`eslint.config.js`): `@eslint/js` + `typescript-eslint` + `angular-eslint` + Prettier integration.
- **Prettier** (`package.json`): `printWidth: 100`, `singleQuote: true`, `endOfLine: lf`, Angular HTML parser.
- **Husky + lint-staged**: pre-commit hook lints and formats only staged files.

````

`lint-staged` config in `package.json`:

```json
{
  "*.ts": ["eslint --fix", "prettier --write"],
  "*.html": ["eslint --fix", "prettier --write"],
  "*.{scss,css,json,md}": ["prettier --write"]
}
````

This means every commit is automatically lint-clean and consistently formatted — no manual `npm run lint:fix` needed before pushing.

### Accessing Protected/Private Members in Tests

When a test needs to call a `protected` or `private` component method, use a typed `unknown` intermediate cast instead of `as any`:

```ts
// ✅ typed — no any, IDE-checkable
(component as unknown as { goToHome(): void }).goToHome();

// ✅ for components with multiple private members, define a local type:
type CartItemCardInternal = {
  formQuantity: WritableSignal<string>;
  subtract(): void;
};
(component as unknown as CartItemCardInternal).subtract();

// ❌ raw any — triggers @typescript-eslint/no-explicit-any
(component as any).goToHome();
```
