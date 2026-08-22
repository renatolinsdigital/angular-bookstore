---
paths:
  - 'src/app/domain/services/**/*.ts'
---

# Data Layer Conventions

There is no backend. `BooksApiService` is the seam that stands in for one:
it fetches `public/data/books.json` once and does paging, filtering, and
category extraction in memory, with an artificial `delay()` to simulate
network latency.

- Keep the fake-latency `delay()` calls. They exist so loading and skeleton
  states stay exercised in development; removing them makes those code paths
  effectively dead.
- Cache catalogue reads with `shareReplay(1)` rather than re-fetching. The
  JSON is static for the lifetime of the session.
- Services expose state as signals (`signal()` for state, `computed()` for
  derived values) and actions as plain methods. `CartService` is the
  reference implementation.
- Services are `providedIn: 'root'`. Inject configuration through the
  `InjectionToken`s in `src/app/app.tokens.ts` rather than hard-coding
  values.
- If a real backend ever replaces the JSON, `BooksApiService` is the only
  file whose internals should need to change: keep its public method
  signatures (`fetchPage`, `fetchCategories`) return-typed as `Observable`
  so callers stay untouched.
