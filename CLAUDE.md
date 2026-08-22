# Project Rulebook

## Project overview

Angular SPA for buying digital books. Client-only: there is no backend.
The "API" is `public/data/books.json` fetched over `HttpClient`, with
artificial `delay()` in the services to simulate latency. Purchases are
simulated end to end; nothing is charged and no data leaves the browser.

## Build & test

- Install: `npm install` (also installs the husky pre-commit hook)
- Dev server: `npm run dev` → http://localhost:4200
- Test: `npm test` (Vitest via `@angular/build:unit-test`)
- Lint: `npm run lint` / `npm run lint:fix`
- Build: `npm run build`

`ng` is not a global dependency here, run everything through the npm
scripts, or `npx ng`.

## Conventions

- **File naming follows the Angular 20+ style, not the legacy one**:
  `button.ts` / `button.html` / `button.scss` / `button.spec.ts`. Do not add
  a `.component.ts` suffix to new files.
- Class names still carry the role suffix (`AppButtonComponent`,
  `CartService`), except `App` itself in `src/app/app.ts`.
- Standalone components only; `imports: [...]` on the component, no `NgModule`.
- **Never write a `changeDetection` property.** OnPush is the Angular 22
  default, and opting out via `ChangeDetectionStrategy.Eager` fails lint.
- Signals over decorators: `input()` / `output()` / `signal()` / `computed()`.
  `inject()` over constructor injection.
- Built-in control flow (`@if` / `@for` / `@switch`) only, no `*ngIf` / `*ngFor`.
- SCSS is BEM with `&__element` / `&--modifier` nesting. All colors, spacing,
  and typography come from the CSS custom properties in
  [src/styles/_variables.scss](src/styles/_variables.scss), no hard-coded
  hex values in component styles.
- Prettier config lives in the `prettier` key of [package.json](package.json)
  (printWidth 100, single quotes, LF). There is deliberately no `.prettierrc`;
  don't add one back. Formatting is enforced as an ESLint error.

## Architecture notes

- `src/app/domain/`: feature layer. Services, models, and components that
  inject services and own business logic.
- `src/app/shared/`: presentation-only components, pipes, and helpers.
  Driven entirely by inputs/outputs; no domain services injected.
- `src/app/pages/`: route targets, every one lazy-loaded via `loadComponent`
  in [src/app/app.routes.ts](src/app/app.routes.ts).
- State is service-held signals, no NgRx. [cart.service.ts](src/app/domain/services/cart.service.ts)
  is the reference implementation: `signal()` for state, `computed()` for
  derived values, plain methods for actions.
- App-wide config flags are `InjectionToken`s in
  [src/app/app.tokens.ts](src/app/app.tokens.ts) (`UNIQUE_PURCHASE`,
  `CURRENCY`, `PAGE_SIZE`). Read them with `inject()`; override them in
  `app.config.ts`. Don't hard-code these values at call sites.
- `BooksApiService` caches the catalogue with `shareReplay(1)` and does its
  own paging/filtering in memory, treat it as the seam where a real backend
  would be swapped in.

## Things to avoid

- Don't reintroduce `.eslintrc.cjs`. ESLint is flat-config only
  ([eslint.config.js](eslint.config.js)).
- Don't call methods from templates for derived values, use `computed()`
  or a pipe, since the app relies on signal-driven change detection.
- Don't add a state-management library. Signals in a service is the pattern.
- Don't edit files under `dist/` or `.angular/`.

---

Longer, path-specific instructions belong in [`.claude/rules/`](.claude/rules/).
Reusable multi-step procedures belong in [`.claude/skills/`](.claude/skills/).
[SETUP.md](SETUP.md) explains what belongs where.
