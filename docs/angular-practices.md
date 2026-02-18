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
├── product-card.scss   ← scoped styles
└── product-card.spec.ts← unit tests (co-located)
```

No separate `index.ts` barrel files are used — Angular's compiler resolves components by their class name directly.

---

## Unit Testing

All components are tested with **Vitest** via Angular's `@angular/build:unit-test` builder. Tests live beside their component in a `.spec.ts` file.

Run once (non-watch):

```bash
npm test -- --watch=false
```

### TestBed Setup for Standalone Components

Each spec imports the component under test directly into `imports[]` (no module needed) and provides fake service objects via `providers[]`:

```ts
await TestBed.configureTestingModule({
  imports: [ProductCardComponent],
  providers: [
    { provide: CartService, useValue: mockCartService },
    { provide: ResponsiveService, useValue: mockResponsiveService },
  ],
}).compileComponents();
```

### Signal-Backed Service Mocks

Service properties that are signals are mocked with real `signal()` instances so Angular's reactivity graph is intact inside the component:

```ts
const mockCartService = {
  totalItemsInCart: signal(0),
  cartItems: signal([]),
  addToCart: vi.fn(),
  // ...
};
```

Methods that drive template state through a `computed()` are backed by a writable signal so the computed re-evaluates when the backing value changes:

```ts
// module-level backing signal
const mockQty = signal(0);

const mockCartService = {
  getQuantityById: vi.fn().mockImplementation(() => mockQty()),
  // ...
};

// in test:
mockQty.set(2);
fixture.detectChanges();
```

This avoids `NG0100: ExpressionChangedAfterItHasBeenCheckedError`, which occurs when a plain non-signal getter changes value between Angular's update pass and its dev-mode verification pass.

### Setting Signal Inputs in Tests

Signal inputs (`input()` / `input.required()`) cannot be set via `nativeElement` assignment. Use `fixture.componentRef.setInput()`:

```ts
fixture.componentRef.setInput('productId', 'book-1');
fixture.componentRef.setInput('title', 'Deep Dive');
fixture.detectChanges();
```

### Prefer `computed` Over Getters for Reactive State

When a component property depends on both an injected service and an `input()` signal, declare it as a `computed()` rather than a plain getter:

```ts
// ✅ computed — Angular tracks the dependency; ECAIBC-safe in tests
protected readonly quantityInCart = computed(() =>
  this.cartService.getQuantityById(this.productId())
);

// ❌ getter — Angular cannot track reactivity; may cause NG0100 in dev mode
protected get quantityInCart() {
  return this.cartService.getQuantityById(this.productId());
}
```

Templates call the computed as a function: `{{ quantityInCart() }}`.
