# Angular Best Practices

This document describes the Angular best practices applied throughout the DigitalBookStore project.

---

## Standalone Components

Every component, directive, and pipe in this project is **standalone** (`standalone: true` is the default in Angular 17+). There are no `NgModule` declarations.

Benefits:

- Simpler mental model — each component is self-contained.
- No module boundaries to manage when refactoring.
- Direct tree-shaking: unused components are never included in the bundle.

```ts
@Component({
  selector: 'app-product-card',
  imports: [CurrencyBrlPipe], // explicit dependencies
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
})
export class ProductCardComponent {}
```

---

## Signal-Based State (Modern Reactivity)

Angular Signals replace `BehaviorSubject`, `Observable`, and manual `ChangeDetectorRef` calls in most state scenarios.

```ts
// Service declares state as signals
readonly cartItems = signal<CartItem[]>([]);

// Derived values use computed()
readonly cartTotal = computed(() =>
  this.cartItems().reduce((sum, i) => sum + i.price * i.quantity, 0)
);
```

Templates read signals directly — Angular tracks the dependency automatically:

```html
{{ cartService.totalItemsInCart() }}
```

---

## Inject Function (not Constructor Injection)

The project uses the `inject()` function instead of constructor parameter injection — the recommended Angular 14+ pattern, especially with signals:

```ts
// ✅ Modern pattern
export class CartComponent {
  protected readonly cartService = inject(CartService);
}

// ❌ Older constructor pattern (avoid)
constructor(private cartService: CartService) {}
```

---

## Input Signals

All component inputs use the `input()` signal API (Angular 17+) instead of `@Input()` decorators:

```ts
readonly productId = input.required<string>();
readonly quantity  = input(0);          // with default
readonly imageUrl  = input<string | undefined>(undefined);
```

This makes inputs reactive signals — they can be read in `computed()` and `effect()` contexts just like regular signals.

---

## Lazy-Loaded Routes with `loadComponent`

Every page route uses `loadComponent` with a dynamic `import()`. Angular CLI automatically code-splits each route:

```ts
{
  path: 'cart',
  loadComponent: () =>
    import('./pages/cart/cart').then((m) => m.CartComponent)
}
```

This keeps the initial bundle small and pages load on demand.

---

## Modern Control Flow Syntax

The project uses Angular 17+ **built-in control flow** (`@if`, `@for`, `@switch`) instead of structural directives (`*ngIf`, `*ngFor`):

```html
<!-- ✅ Modern -->
@if (cartService.cartItems().length === 0) {
<div class="cart__empty">...</div>
} @else {
<div class="cart__list">...</div>
} @for (product of cartService.products(); track product.id) {
<app-product-card [productId]="product.id" ... />
}
```

Benefits:

- No need to import `NgIf`, `NgFor`, `NgSwitch` in every component.
- Better type-safety (the variable is typed inside the `@if` block).
- More intuitive syntax.

---

## `provideHttpClient` + Functional Guards/Config

HTTP is configured at the application level (no `HttpClientModule`):

```ts
// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [provideBrowserGlobalErrorListeners(), provideRouter(routes), provideHttpClient()],
};
```

---

## Self-Closing Component Tags

Where a component has no projected content, the template uses the self-closing form:

```html
<app-product-card [productId]="product.id" [title]="product.title" />
```

This is valid Angular syntax and keeps templates concise.

---

## Strict TypeScript

`tsconfig.json` enables full strict mode:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  },
  "angularCompilerOptions": {
    "strictInjectionParameters": true,
    "strictInputAccessModifiers": true,
    "strictTemplates": true
  }
}
```

This catches type errors in both TypeScript classes and Angular templates at compile time.

---

## OnChanges for Input Synchronisation

`CartItemCardComponent` uses `ngOnChanges` to sync the `quantity` input signal into local form state:

```ts
ngOnChanges(): void {
  this.formQuantity.set(String(this.quantity()));
}
```

This is intentional — the local `formQuantity` signal is the controlled value for the `<input>` element, and it needs to reset when the parent passes a new `quantity`.

---

## Co-located Files

Each component follows the Angular convention of co-located files:

```
product-card/
├── product-card.ts     ← class + metadata
├── product-card.html   ← template
└── product-card.scss   ← scoped styles
```

No separate `index.ts` barrel files are used — Angular's compiler resolves components by their class name directly.
