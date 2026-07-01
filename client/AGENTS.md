<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# Web Store — Agent Guide

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2.6 (App Router) |
| Language | TypeScript 5, strict mode (`strict` + `strictNullChecks`) |
| Runtime | React 19.2 |
| Styling | Tailwind CSS v4 + Material UI v9 (`@mui/material`, `@mui/icons-material`, `@mui/material-nextjs`) |
| Emotion | `@emotion/react`, `@emotion/styled`, `@emotion/cache` (MUI styling engine) |
| Auth & DB | Supabase (`@supabase/ssr` 0.10, `@supabase/supabase-js` 2) |
| Payments | `stripe` v22 (server SDK — client in `src/core/paymentSystem/stripe/server.ts`; provisioning service scaffolded, no checkout flow yet) |
| Forms | `react-hook-form` v7 + `yup` v1 + `@hookform/resolvers` v5 |
| i18n | `next-intl` v4 (App Router). Single locale (`en`), no URL routing yet — see Localisation |
| HTTP | `axios` (dependency present, not yet used — all data access goes through the Supabase SDK) |
| Cookies | `universal-cookie` v8 (client); Next.js `cookies()` API (server) |
| Git hooks | `husky` v9 (`.husky/`) |
| Tooling | `prettier`, `supabase` CLI (devDependencies) |
| Package manager | npm |

Run dev server: `npm run dev` from `client/`.
Lint: `npm run lint` / `npm run lint:fix`.

---

## Project Structure

The App Router uses **route groups** to split unauthenticated (`(auth)`) from authenticated (`(app)`) areas. Route groups do not affect URLs — `(auth)/login/page.tsx` serves `/login`.

The codebase is organized in three tiers: **`app/`** (routes), **`src/core/`** (technology-specific cross-cutting infrastructure), and **`src/modules/`** (feature modules). `src/components/`, `src/config/`, `src/localisation/`, and the top-level `utils/` folder from earlier revisions **no longer exist** — see "Where things moved" below.

```
client/
├── app/
│   ├── layout.tsx              # Root layout. Server-fetches the current user and provides it via
│   │                           #   <UserContextProvider>; wraps app in MUI AppRouterCacheProvider +
│   │                           #   <ThemeRegistry> and renders <GradientBackground>. Loads Google fonts.
│   ├── page.tsx                # Public marketing landing page (server component; reads app/locales/en)
│   ├── loading.tsx             # Root loading UI
│   ├── error.tsx               # Root error boundary
│   ├── globals.css
│   ├── locales/en.ts           # App-level strings (homePage, forbiddenPage). NOT part of the module
│   │                           #   locale aggregation — imported directly by app/ files.
│   ├── (auth)/                 # Unauthenticated area
│   │   ├── layout.tsx          # Server layout: redirects already-authenticated users to /catalog
│   │   ├── login/page.tsx      # renders <LogInForm>
│   │   └── register/page.tsx   # renders <SignUpForm>
│   └── (app)/                  # Authenticated area (each route guards itself via MainLayout)
│       ├── catalog/
│       │   ├── layout.tsx      # <MainLayout access={[AccessType.USER, AccessType.ADMIN]}>
│       │   └── page.tsx        # CatalogPage (server): fetches products, renders <CatalogProducts>
│       ├── dashboard/
│       │   ├── layout.tsx      # <MainLayout access={AccessType.ADMIN}>
│       │   ├── loading.tsx
│       │   └── page.tsx        # DashboardPage (server): fetches products, renders table + add button
│       └── forbidden/page.tsx
├── src/
│   ├── constants/              # App-wide constant values — import via @constants/*
│   │                           #   defaultLocales.ts (DEFAULT_LOCALE), cookies/x-path-name.ts (X_PATH_NAME)
│   ├── core/                   # Cross-cutting infrastructure, grouped by technology. Import via @core/*
│   │   ├── clients/supabase/   # createClient() factories: client.ts (browser) + server.ts (server)
│   │   ├── storage/supabase/   # StorageService (abstract upload/download/url/delete over a bucket)
│   │   ├── proxy/supabase/     # updateSession() — middleware implementation
│   │   ├── paymentSystem/stripe/# server.ts — shared server-only Stripe client singleton
│   │   ├── env/                # Validated, typed env access — import { env } from '@core/env'
│   │   │                       #   (env.ts + env.schema.mjs, shared with the validation scripts)
│   │   └── localisation/       # next-intl runtime: locales.ts (Locale enum + resolveLocale),
│   │                           #   locale.service.ts (cookie-based getLocale/changeLocale),
│   │                           #   messages.ts (merged catalog + getMessages + Messages type),
│   │                           #   request.ts (getRequestConfig), intl.d.ts (AppConfig types). See Localisation.
│   └── modules/                # Feature modules; each is self-contained (see Module structure)
│       ├── auth/               # components (LogInForm, SignUpForm, SignOutButton), enums (AccessType),
│       │                       #   layouts (AuthGuard — client), services (auth.service),
│       │                       #   types, utils (validateUserAccess, normalizeAllowedAccess), locales
│       ├── user/               # contexts (UserContext + useUser), components (ProfileCard),
│       │                       #   dao (user.dao), enums (UserRole), services (user.service — server),
│       │                       #   types (IUser), locales
│       ├── product/            # Full CRUD module + DAO + Stripe/subscription scaffolding — see below
│       ├── catalog/            # components (CatalogProducts), navigation (catalogNavItems), page, locales
│       ├── dashboard/          # navigation (dashboardNavItems), pages/dashboard.tsx, locales
│       └── common/             # App chrome + shared primitives:
│           ├── components/     # Shared UI primitives (Button, DataTable, FormInput, ImageUpload,
│           │                   #   Loading, NavLink, Skeleton, TableSkeleton, GradientBackground) + Navbar
│           ├── config/         # App-wide constants (DEFAULT_PAGINATION)
│           ├── dao/supabase/   # BaseDao — single abstract data-access base (client injected, see DAO layer)
│           ├── enums/          # CookieKey (in CookieyKey.ts — see Known Bugs), SortOrder,
│           │                   #   GetEnabled.ts (the getEnabled config-collapse helper — a fn, not an enum)
│           ├── hooks/          # useModal
│           ├── layouts/        # MainLayout
│           ├── pages/          # ErrorPage
│           ├── service/        # Shared singleton services (note: singular folder):
│           │                   #   formatting.service (formatDate), image.service (image validation/dimensions)
│           ├── theme/          # ThemeRegistry (client) + theme.ts (MUI theme)
│           └── types/          # INavItem (navigation.ts), IGetPaginatedData (paginatedData.ts)
├── scripts/
│   ├── validate-env.mjs        # Validates the local .env against the schema (pre-commit)
│   └── check-env-example.mjs   # Asserts .env.example lists every schema var (pre-commit / CI)
├── .env.example                # Committed template of all env vars (kept in sync by the check above)
├── supabase/
│   └── migrations/             # SQL migrations (users, products, subscription fields, realtime)
├── proxy.ts                    # Next.js middleware entry (exports `proxy` + `config.matcher`)
├── next.config.ts              # images.remotePatterns allow the Supabase storage host
├── tsconfig.json
├── eslint.config.mjs           # Flat ESLint config (Next core-web-vitals + TS + house style)
└── .env                        # Supabase + Stripe + OAuth keys (NEXT_PUBLIC_* are browser-exposed)
```

### Where things moved (recent restructure)

If you remember the old layout, these moved — update any stale imports you find:

- `src/components/*` → `src/modules/common/components/*` (import via `@common/components`; the `@components` alias is **gone**).
- `src/config/*` → `src/core/env/*` (import `{ env }` from `@core/env`; the `@config` alias is **gone**).
- `utils/supabase/{client,server}.ts` → `src/core/clients/supabase/{client,server}.ts`.
- `utils/supabase/proxy.ts` → `src/core/proxy/supabase/proxy.ts`.
- `utils/supabase/storage/index.ts` → `src/core/storage/supabase/index.ts` (class renamed `AbstractStorageService` → `StorageService`).
- `src/core/stripe/server.ts` → `src/core/paymentSystem/stripe/server.ts`.
- `src/core/theme/*` → `src/modules/common/theme/*`.
- `src/localisation/en/*` → distributed per-**component** `locales/en.ts` files, merged up per module in each
  module's `locales/en.ts`, then aggregated across modules in `src/modules/index.ts` (see Localisation).
- The top-level `constants/` directory → `src/constants/` (`@constants/*` now resolves to `src/constants/*`). The old
  `constants/storage.ts` (`BUCKET_ID`/`BASE_BUCKET_URL`) is **gone**; the bucket id is now hard-coded in
  `product-image.service.ts` (see Storage). New constants live under `src/constants/` (`defaultLocales.ts`, `cookies/x-path-name.ts`).
- `src/modules/product/utils/*` → `src/modules/common/service/*`: `formatDate` became `formattingService.formatDate`
  (`formatting.service.ts`) and the image validation/dimension helpers became `imageService` (`image.service.ts`).
  The `src/modules/product/utils/` directory is deleted.
- `src/core/utils/getEnabled.ts` → `src/modules/common/enums/GetEnabled.ts` (import `getEnabled` via `@common/enums/GetEnabled`).
  The `src/core/utils/` directory is deleted.
- The top-level `utils/` directory is deleted. The `@utils/*` alias still exists in `tsconfig.json`/eslint but resolves to nothing — treat it as dead until a `utils/` dir comes back.

### Where new code goes

- **New page route** → `app/(app)/<route>/page.tsx` (authenticated) or `app/(auth)/<route>/page.tsx`
- **New protected route** → add `app/(app)/<route>/layout.tsx` wrapping `<MainLayout access={...}>`
- **New feature** → new folder under `src/modules/<feature>/` following the module layout below
- **Shared UI primitive** (generic, feature-agnostic) → `src/modules/common/components/`, import via `@common/components`
- **Cross-cutting technical infrastructure** (a Supabase/Stripe/storage abstraction, base class, env) → `src/core/<concern>/<tech>/`
- **New enum** → `src/modules/<module>/enums/` (or `common/enums/` if cross-feature)
- **New service** → `src/modules/<module>/services/` — export a singleton instance
- **New data access** → `src/modules/<module>/dao/`, a class extending `BaseDao<Entity>` (see DAO layer)

---

## Architecture Patterns

### Module structure

Each module under `src/modules/` follows this internal layout (subfolders present as needed):

```
<module>/
├── components/      # React components ('use client' when they need browser APIs); each owns its own
│                    #   locales/en.ts (one namespace) next to it
├── contexts/        # React context providers + hooks ('use client')
├── dao/             # Data-access objects (thin Entity-typed wrappers over a Base*Dao)
├── enums/           # String enums
├── hooks/           # React hooks ('use client')
├── layouts/         # Wrapper components (guards, providers)
├── locales/en.ts    # Merges this module's per-component locales (no literal strings; merged into the app dictionary)
├── navigation/      # Nav item definitions (INavItem[])
├── pages/           # Page-level server components composed by app/ routes
├── services/        # Business logic; classes exported as singletons via `export default new MyService`
├── types/           # TypeScript interfaces (I prefix: IUser, ISignIn)
└── utils/           # Pure functions, no side effects
```

Modules expose a public API through an `index.ts` barrel — prefer importing from the barrel
(`@modules/product`) over internal files, except where a file is explicitly server-only or imported by
full path by convention (e.g. `get-product.service.ts`, `stripe-product.server.service.ts`). `common` has
**no** barrel at all — import its targets by full path (`@common/components`, `@common/service/formatting.service`,
`@common/enums/GetEnabled`, …). Note `common` also names its services folder `service/` (singular), unlike the
`services/` convention feature modules use.

### DAO layer (data access)

Database reads/writes go through DAOs, not raw Supabase calls in services. **One** abstract base,
`BaseDao<Entity>`, lives in `src/modules/common/dao/supabase/BaseDao.ts` (import by full path, or `BaseDao`
from the folder barrel). It holds **all** CRUD (`findById` / `insert` / `update` / `findAll(IGetPaginatedData)`
/ `delete`), a shared `unwrap()` that throws on PostgREST errors, `protected abstract readonly table`, and is
the only layer that speaks Supabase.

**Why one base, not the old client/server split:** the server Supabase client imports `next/headers`, which
Next.js forbids in any module reachable from a Client Component — even via a dynamic `import()`, which
Turbopack still traces into the client bundle (verified: it fails `next build`). So `BaseDao` never imports a
client. Instead it takes a `SupabaseClientFactory` (`() => SupabaseClient | Promise<SupabaseClient>`) by
**constructor injection**, and the already-context-split **service layer** supplies the right factory. This
keeps one base DAO and one entity DAO with no duplicated query logic, and confines a Supabase swap to
`BaseDao` + the `@core/clients` factories.

A concrete DAO is a one-liner that pins the table and inherits the injecting constructor (export the **class**,
not a singleton — it can't self-construct without a client):

```typescript
export class ProductDao extends BaseDao<IProduct> {
    protected readonly table = 'products';
}
```

The class is context-neutral, so it is bound to a context **once in the `dao/` folder** rather than
re-constructed inside every service. The **product** module pre-binds one singleton per context —
`dao/client.ts` and `dao/server.ts`, each `new ProductDao(createClient)` with the matching `@core/clients`
factory — and every service imports the one for its context (there is **no** `dao/index.ts` barrel here):

```typescript
// dao/server.ts
import { createClient } from '@core/clients/supabase/server';
import { ProductDao } from './product.dao';
export default new ProductDao(createClient);

// a client service:  import productDao from '@modules/product/dao/client';
// a server service:  import productDao from '@modules/product/dao/server';
```

The **user** module only barrels the `UserDao` class (`dao/index.ts`) and does **not** pre-bind it — and
nothing consumes it yet: `user.service.ts` still queries Supabase directly (`client.from('users')…`), so the
DAO layer is currently exercised only by `product`. Services depend on DAOs and supply the client factory; DAOs
depend only on the abstract `SupabaseClient` API.

### Service pattern

Services hold business logic and orchestrate DAOs/storage/Stripe. They are plain classes instantiated
once and exported as a default singleton, then (usually) re-exported by name from `services/index.ts`:

```typescript
class AuthService {
    async signInUser(data: ISignIn) { /* ... */ }
}
export default new AuthService;
```

**Split by execution context** (this determines which Supabase client the DAOs they use will pull in):

- **Client services** run only in `'use client'` components (`auth.service.ts`, `product.service.ts`,
  `product-image.service.ts`). `product.service` delegates writes to its `productDao` instance and owns the
  Realtime subscription and image cleanup.
- **Server services** run only in Server Components / Route Handlers (`user.service.ts`,
  `get-product.service.ts`, `stripe-product.server.service.ts`). Server services that wrap server-only
  resources are named `*.server.service.ts` and are imported by full path (not from the services barrel).

### Server vs Client components

- Default to **Server Components** (no directive).
- Add `'use client'` only for browser APIs, event handlers, `useState`, `useEffect`, or context hooks.
- Pick the Supabase client that matches the context (via the right DAO/service). Mixing them throws at runtime.

### Auth & route protection (three layers)

Auth state lives in **two synchronized places** and the guards read from different ones — keep this
in mind when debugging redirects.

**Layer 1 — Middleware** (`proxy.ts` → `@core/proxy/supabase/proxy.ts`):
- Runs on every request (`config.matcher` excludes `_next/*` and static image extensions).
- Injects an `x-path-name` header (the name is centralized as `X_PATH_NAME` in `@constants/cookies/x-path-name`).
- Calls `supabase.auth.getClaims()`; if there is no session, redirects to `/login`.
- Pass-through exceptions: `/` (home), `/login*`, `/register*`.

**Layer 2 — `(auth)` server layout** (`app/(auth)/layout.tsx`):
- Server component; calls `userService.fetchCurrentUser()`.
- If a user exists, redirects to `/catalog` (keeps logged-in users out of login/register).

**Layer 3 — `AuthGuard`** (`@modules/auth/layouts/AuthGuard`, **client component**):
- Reached through `MainLayout` (`@modules/common/layouts/MainLayout`), which renders
  `<AuthGuard access={...}><div><Navbar />{children}</div></AuthGuard>`.
- Reads the user from `useUser()` (the `UserContext`), **not** from cookies.
- `user === null` → `redirect('/login')`; access mismatch → `redirect('/forbidden')`.
- Access is checked with `validateUserAccess(user.role, normalizeAllowedAccess(access))`.

**UserContext** (`@modules/user` → `contexts/UserContext`): the root layout server-fetches the current
user once and feeds it to `UserContextProvider`. Because the root layout does **not** re-run on soft
(client-side) navigation, anything that changes auth state on the client must force the server data to
refresh — `LogInForm` uses `window.location.assign('/catalog')` (a hard navigation) after sign-in, and
`SignOutButton` calls `router.refresh()`. A plain `router.push` leaves `useUser()` stale and risks a
`/login ↔ /catalog` redirect loop between Layer 2 and Layer 3.

### Localisation

Localisation runs on **`next-intl` v4**, fed by the **per-component English dictionaries**. There is one locale
(`en`) and no URL locale routing yet — the runtime is wired so locales can be added later.

**The catalog (source of truth is per-component files, merged in two tiers):**

- Each **component** (or page) owns `locales/en.ts` next to it, a `const` object holding **one** namespace
  (e.g. `product/components/AddProductModal/locales/en.ts` exposes `addProductModal`;
  `product/components/ProductsTable/locales/en.ts` exposes `productsTable`; `catalog/pages/locales/en.ts`
  exposes `catalogPage`).
- Each **module** re-collects its own components' locales into `locales/en.ts` — that file no longer holds
  literal strings, it just imports the component dictionaries and spread-merges them (e.g.
  `product/locales/en.ts` merges the five product component `en`s; `common/locales/en.ts` merges
  `ImageUpload`, `Navbar`, and `ErrorPage`). Add cross-directory imports via a path alias (relative `../`
  parent imports are an ESLint error).
- `src/modules/index.ts` spread-merges every module's merged `en` into `rootModule.locales.en` (no component
  is imported here directly anymore — each is reached through its module's `locales/en.ts`).
- `src/core/localisation/messages.ts` merges that with the app-level strings (`app/locales/en.ts`, which stays
  a single file and is **not** part of the module aggregation) into the per-locale catalog, exposes it via
  `getMessages(locale)` (backed by `MESSAGES_BY_LOCALE`), and exports the `Messages` type. (The old
  `@localisation/en` re-export and the `en/` folder are gone — the `@localisation/*` alias still exists but is
  currently unused.)

**The runtime wiring (all under `src/core/localisation/`):**

- `locales.ts` — the `Locale` enum + `LOCALE_CONFIG` allow-map, `ENABLED_LOCALES` (derived via the
  `getEnabled` helper in `@common/enums/GetEnabled`), and `resolveLocale()` / `isEnabledLocale()` that fall
  back to `DEFAULT_LOCALE` for anything unsupported.
- `locale.service.ts` — **server-only**: `getLocale()` reads the requested locale from the `CookieKey.LOCALE`
  cookie (via `next/headers`) and resolves it; `changeLocale(requested)` validates and writes that cookie.
- `request.ts` — `getRequestConfig` now negotiates per request (`getLocale()` → `getMessages(locale)`), no
  longer a hard-coded `'en'`. Pointed at by `createNextIntlPlugin('./src/core/localisation/request.ts')` in
  `next.config.ts`.
- `intl.d.ts` — augments `AppConfig` (`Messages`, `Locale`) so `t('namespace.key')` is type-checked.
- The root layout wraps the tree in `<NextIntlClientProvider>` (no props — in v4 a server-rendered provider
  auto-inherits `locale`/`messages` from the request config).

**Reading strings (never import the dictionary into a component directly anymore):**

- **Server Components / Route Handlers:** `const t = await getTranslations('namespace')` from
  `next-intl/server`; arrays (e.g. the homepage `stats`/`values.items`) come back via `t.raw('key')`.
- **Client Components (`'use client'`):** `const t = useTranslations('namespace')` from `next-intl`.
- **yup schemas** can't use hooks, so they are **factories** that take the scoped translator and are built in
  the component via `useMemo(() => createXSchema(t), [t])` (see `signIn.schema.ts`, `createProduct.schema.ts`).
  Type the translator param as `_Translator<Messages, 'namespace'>` (both re-exported from `next-intl`).
- **Non-component helpers** (e.g. `ProductsTable/columns/*`) receive the scoped translator threaded down from
  the component (`getProductColumns(t, handlers)`); type it via `ProductsTableTranslator` in `columns/types.ts`.

When adding UI text: add it to the relevant **component's** `locales/en.ts` namespace (create the
`locales/en.ts` next to the component and wire it into the module's `locales/en.ts` merge if the component
doesn't have one yet) and read it through `t(...)`.

### Forms

`react-hook-form` + `yup`. Schemas live in a `schemas/` subfolder next to the component
(`signIn.schema.ts`, `createProduct.schema.ts`, …). Auth forms catch service errors into local
`serverError` state and surface them via a MUI `<Alert>`; product modals use RHF's `setError('root', …)`.
Standard hook setup:

```typescript
const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(mySchema),
    mode: 'onChange',
})
```

MUI `<Select>` fields are bound with `<Controller>`; conditional fields (e.g. billing interval shown only
for Subscription products) use `useWatch`.

---

## Database — Supabase

Schema is version-controlled as **SQL migrations** in `supabase/migrations/` and applied via the Supabase
CLI (`supabase` devDependency, `supabase/` project dir). Add a migration file rather than editing schema
by hand.

### Tables

| Table | Key columns | Notes |
|---|---|---|
| `users` | `id` (uuid, PK, FK → `auth.users.id`), `email`, `"firstName"`, `"lastName"`, `avatar`, `role` (`public."UserRole"`), `created_at`, `updated_at` | camelCase columns are quoted to match `IUser`. RLS: a user may read/update only their own row. |
| `products` | `id` (uuid, PK), `name`, `image_url`, `amount` (`numeric(12,2)`), `currency`, `type` (`public."ProductType"`), `interval` (`public."BillingInterval"`, nullable), `stripe_product_id` (text, nullable, unique), `stripe_price_id` (text, nullable, unique), `created_at` | snake_case columns match `IProduct`. RLS: `select` is public (anon + authenticated); insert/update/delete require authenticated. In the `supabase_realtime` publication (Realtime enabled). |

Postgres enums mirror the TS enums: `public."UserRole"` (`'Admin' | 'User'`),
`public."ProductType"` (`'Subscription' | 'Single'`), `public."BillingInterval"` (`'Monthly' | 'Yearly'`).
"Subscription requires an interval" is enforced in the app layer (yup), not by a DB constraint.

### Role storage & sync

User role lives in two places:
1. `users.role` column (read by `userService.fetchCurrentUser()` → `UserContext`).
2. `auth.users.user_metadata.role` (set at sign-up by `authService.signUpUser`, defaults to `UserRole.USER`).

On sign-up a `handle_new_user` trigger copies `user_metadata` (`firstName`, `lastName`, `avatar`,
`role`) into a new `public.users` row, so the two start in sync automatically. If you change a role
later, update **both** places.

### Accessing Supabase

```typescript
// Server Components, layouts, Route Handlers, server services/DAOs:
import { createClient } from '@core/clients/supabase/server';
const supabase = await createClient();

// 'use client' components and client services/DAOs:
import { createClient } from '@core/clients/supabase/client';
const supabase = createClient();   // not awaited — browser client is synchronous
```

Prefer going through a DAO/service rather than calling `createClient` directly in feature code.

### Realtime

`products` is in the `supabase_realtime` publication. `productService.subscribeToChanges()` opens a
`postgres_changes` channel on `public:products`; the `useRealtimeProducts(initialProducts)` hook seeds
from the server-rendered list and applies INSERT/UPDATE/DELETE on top (UPDATE matters because product
creation inserts an empty row first, then updates it with the uploaded image URL). RLS governs delivery
via the public `select` policy. **Note:** the hook is currently commented out in `CatalogProducts`, so the
catalog renders the static server list — wire it back in to make the grid live.

### Storage

- The bucket id is currently **hard-coded** as `"WebStore"` in `product-image.service.ts`
  (`protected readonly bucketId = "WebStore"`); the old centralized `constants/storage.ts`
  (`BUCKET_ID`/`BASE_BUCKET_URL`) was removed. Re-centralize under `src/constants/` if a second consumer appears.
- `src/core/storage/supabase/index.ts` defines the abstract `StorageService` (protected
  `uploadFile` / `downloadFile` / `getPublicUrl` / `deleteFile` over `this.bucketId`).
- `product-image.service.ts` extends `StorageService`, pins the bucket, and exposes
  `uploadProductImage(productId, file)` (uploads to `product-image/<productId>/temp_<ts>.<ext>` and
  returns the public URL) and `deleteImageByPath(path)`.
- `next.config.ts` whitelists the Supabase storage host under `images.remotePatterns` so `next/image`
  can render product images.

### Environment variables

```
NEXT_PUBLIC_SUPABASE_URL              # Supabase project URL (browser-safe)
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY  # Publishable key (browser-safe)
STRIPE_SECRET_KEY                     # Stripe secret key (server-only) — used by @core/paymentSystem/stripe/server
OAUTH_SUPABASE_CLIENT_ID              # OAuth client ID (server-only, not yet consumed by code)
OAUTH_SUPABASE_CLIENT_SECRET          # OAuth secret (server-only, not yet consumed)
SITE_URL                              # http://localhost:3000 in dev (not yet consumed)
SUPABASE_ACCESS_TOKEN                 # Supabase CLI access token (server-only, not yet consumed)
STRIPE_PUBLISHBEL_KEY                 # Stripe publishable key. NOTE: misspelled, and not NEXT_PUBLIC_*
                                      #   so it is NOT browser-exposed. Rename to
                                      #   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY before using Stripe.js client-side.
```

### Environment validation

One **yup** schema, `src/core/env/env.schema.mjs`, is the single source of truth for which variables the
app requires. It is plain ESM (`.mjs`) on purpose — no TS runner is installed, yet both the Node scripts
and the TS app can import it. It enforces only the variables code actually reads
(`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`), so it never
blocks on unused config. Three consumers:

- **`src/core/env/env.ts` → `@core/env` (runtime, typed).** `import { env } from '@core/env'` gives a
  validated, typed env object. It calls `validateSync` once at first import and **throws on the server if
  anything is missing** (fail-fast at boot/build). **Server-only** — do not import `@core/env` from a
  Client Component (server secrets are undefined in the browser bundle and validation would throw).
  Currently used by `@core/paymentSystem/stripe/server` and `@core/clients/supabase/server`. The browser
  client (`@core/clients/supabase/client`) and the middleware (`@core/proxy/supabase/proxy`) read
  `process.env` directly by design.
- **`scripts/validate-env.mjs` (`npm run validate:env`).** Loads `.env` like Next.js (`@next/env`) and
  validates the developer's local env. Runs in pre-commit.
- **`scripts/check-env-example.mjs` (`npm run check:env-example`).** Asserts the committed `.env.example`
  declares every variable in the schema, so the template never drifts. Needs no secrets (CI-safe). Runs
  in pre-commit.

The pre-commit hook is `validate:env && check:env-example && lint`. **When new code needs a new env var:
add it to `env.schema.mjs`, the `IEnv` interface in `env.ts`, and `.env.example`.** (Note: a few comments
inside `env.ts`/`env.schema.mjs`/`.env.example` still point at the old `src/config` path — the live
location is `src/core/env`.)

### Stripe

Import the server client where you need it — it is a shared singleton, not a factory:

```typescript
import { stripe } from '@core/paymentSystem/stripe/server';   // server-only (Server Components / *.server.service.ts)
```

It pins `apiVersion: '2026-05-27.dahlia'` (the version bundled with `stripe` v22.2.2) and reads its secret
from the validated `@core/env` (so a missing `STRIPE_SECRET_KEY` fails fast). There is no browser-side
Stripe.js client yet (`@stripe/stripe-js` is not installed).

`product/services/stripe-product.server.service.ts` (`stripeProductService`) wraps pure Stripe Product/Price
operations (`createSubscriptionProduct`, `updateSubscriptionProduct`, `archiveSubscriptionProduct`) and maps
the `BillingInterval` enum to Stripe's `month`/`year` wire values. **It has no caller yet** — see Known Bugs.

---

## Product module

The most fully built feature; use it as the reference for new CRUD modules. Public API in
`src/modules/product/index.ts`.

- **components/** — `ProductsTable`, `AddProductButton`, `AddProductModal`, `EditProductModal`,
  `DeleteProductModal`. Add/Edit modals use the shared `<ImageUpload>` primitive and per-modal yup schemas;
  `AddProductModal` conditionally shows the billing-interval select for Subscription products.
  `ProductsTable` renders the generic `<DataTable>` primitive (`IColumn<T>[]`); the column set is built by
  `ProductsTable/columns/getProductColumns()`, with one factory file per column
  (`imageColumn`, `nameColumn`, `typeColumn`, `priceColumn`, `createdAtColumn`, `actionsColumn`).
- **dao/** — `product.dao.ts` exports the `ProductDao` class (extends `BaseDao<IProduct>`); `dao/client.ts`
  and `dao/server.ts` export the pre-bound context singletons (`new ProductDao(createClient)`). Services import
  the one matching their context (`@modules/product/dao/client` / `@modules/product/dao/server`). No `dao/index.ts` barrel.
- **services/** — `product.service.ts` (client: create/update/delete via DAO, Realtime subscription, image
  cleanup), `get-product.service.ts` (server: `fetchProducts` via `productDao.findAll`),
  `product-image.service.ts` (client: image upload/delete), `stripe-product.server.service.ts` (server:
  Stripe provisioning, not yet wired). Barrel exports only `productService` + `productImageService`.
- **types/** — `IProduct`, `ICreateProduct`, `IUpdateProduct`, `IUpdateProductInput`.
- **enums/** — `ProductType` (`Single` | `Subscription`), `BillingInterval` (`Monthly` | `Yearly`),
  `Currency` (`USD` | `EUR` | `GBP`) + `CURRENCY_SYMBOL` map.
- **hooks/** — `useRealtimeProducts`.
- **utils/** — removed. `formatDate` and the image validation/dimension helpers moved to the shared
  `@common/service/*` singletons (`formattingService` in `formatting.service.ts`, `imageService` in `image.service.ts`).

`DashboardPage` and `CatalogPage` are server components that call `getProductService.fetchProducts()` and
render the table / grid respectively.

### Navigation

Sidebar items are declared per feature as `INavItem[]` (`@common/types`) in each module's
`navigation/` folder (`catalogNavItems`, `dashboardNavItems`). The `Navbar`
(`@common/components/Navbar`, with `NavbarHeader` + `NavbarMenu` subcomponents) composes them via
`filterNavItemsByAccess(user?.role)`, which hides items whose `access` the current role fails.

---

## TypeScript Path Aliases

Defined in `tsconfig.json` — always prefer these over relative imports (relative parent imports are an
ESLint error; see Coding Conventions):

| Alias | Resolves to |
|---|---|
| `@modules/*` | `src/modules/*` |
| `@common/*` | `src/modules/common/*` |
| `@auth/*` | `src/modules/auth/*` |
| `@user/*` | `src/modules/user/*` |
| `@catalog/*` | `src/modules/catalog/*` |
| `@core/*` | `src/core/*` |
| `@localisation/*` | `src/core/localisation/*` |
| `@constants/*` | `src/constants/*` |
| `@app/*` | `app/*` |
| `@static` | `static` (reserved — does not exist yet) |
| `@utils/*` | `utils/*` (**dangling** — the `utils/` dir was removed; alias kept but resolves to nothing) |

There is **no `@components`, `@config`, `@dashboard`, or `@product` alias.** Import shared primitives via
`@common/components` (the barrel), env via `@core/env`, and the dashboard/product modules via
`@modules/dashboard` / `@modules/product`.

---

## Coding Conventions

### Naming

- Interfaces: `I` prefix — `IUser`, `ISignIn`, `IProps` (enforced by `@typescript-eslint/naming-convention`).
- Enums: PascalCase name, string values matching display text — `UserRole.ADMIN = 'Admin'`.
- Files: `camelCase` for utilities/services; PascalCase component folders with `index.tsx` inside.
- Server-only services: suffix `*.server.service.ts`. DAOs: one `*.dao.ts` per entity (context-neutral; the
  service injects the client factory).
- Singleton service/DAO exports: `export default new MyService`.

### Styling

- **Tailwind CSS v4** for layout and custom styling — utility classes in JSX. The visual language is a
  "brutalist" brown/gold theme (custom `brand-*`/`gold-*`/`sand-*` palette, `glass-panel`,
  `brutal-shadow*` utilities in `globals.css`).
- **Material UI v9** for interactive elements (TextField, Button, Select, Dialog, Alert, Table) and icons
  (`@mui/icons-material`). The MUI theme is `@common/theme/theme`, applied via `<ThemeRegistry>` in the root
  layout. Don't create `*.module.scss` files.
- Don't mix MUI layout components with Tailwind layout for the same concern — pick one per concern.

### ESLint

A single flat config, `eslint.config.mjs` (ESLint 9), is what `npm run lint` runs. It spreads
`eslint-config-next` (core-web-vitals + typescript) and then layers the house style. The `.husky/pre-commit`
hook runs `validate:env && check:env-example && lint`, so the tree must lint clean (errors block commits;
warnings don't) **and** the local `.env` must satisfy the env schema.

Enforced (errors): import order, alphabetized & grouped `builtin → external → internal → sibling → index →
parent` with blank lines between groups (path aliases count as *internal* via `import/internal-regex`);
**`no-restricted-imports` forbids relative parent imports (`../`) — cross-directory imports must use a path
alias** (same-dir `./` imports are fine); `object-curly-spacing: always`; `eol-last`; `no-duplicate-imports`;
`no-multiple-empty-lines`; `no-param-reassign` (props allowed); `@typescript-eslint/naming-convention`
(interfaces must match `^I[A-Z]`).

Warnings (fix when you touch the file): `max-len` 120 (comments ignored), `curly`, `no-return-await`,
`no-unneeded-ternary`, `no-useless-computed-key`, `prefer-destructuring`, `padding-line-between-statements`
(blank lines around blocks/multiline declarations), `@typescript-eslint/no-unused-vars` (`^_` ignored).

Run `npm run lint:fix` to auto-fix the formatting-class rules. Don't disable rules without a comment.
(The `import/internal-regex` still lists the retired `components|config|utils` aliases alongside the live
ones — harmless, but don't rely on them.)

**Not enforced** (deliberately not migrated): prettier-as-eslint-rule (`eslint-plugin-prettier` not
installed; prettier defaults are 2-space and would churn this 4-space codebase — add a matching
`.prettierrc` first if you want it), jest rules (no tests), and the `strict-null-checks` plugin
(redundant with `strictNullChecks` in tsconfig).

---

## Known Bugs & Technical Debt

Fix these when you touch the relevant file; don't replicate the patterns.

1. **Product update writes a camelCase column** — `IUpdateProduct.imageUrl` is passed straight through
   `productService.updateProduct` → `productDao.update(data, id)`, which uses the object keys as
   column names. The actual column is `image_url` (snake_case). [Likely] this makes the post-create image
   update (and any image edit) fail/no-op. Map `imageUrl` → `image_url` in the service or DAO.

2. **`EditProductModal` save is a stub** — `EditProductModal/utils/updateProduct.ts` has an empty body
   (declares `imageUrl` and returns nothing). Submitting the edit form calls it but performs no update.
   Implement it (mirror `productService.updateProduct` + the image-replace flow) before relying on edits.

3. **Stripe subscription provisioning is not wired** — `stripeProductService` exists but has no caller;
   `stripe-subscription.service.ts` is an empty file; the `createStripeSubscription` action its comments
   reference does not exist (`app/api/` and server actions are absent). `productService.createProduct` only
   inserts into Supabase, so `stripe_product_id`/`stripe_price_id` stay `null` and Subscription products are
   never created in Stripe.

4. **Deleting a product orphans its image** — `productService.deleteProduct` now only calls
   `productDao.delete(id)`; the old storage-folder cleanup was dropped. Removed products leave their
   `product-image/<id>/...` files in the bucket. Re-add cleanup (via `productImageService`) on delete.

5. **`BaseDao.findAll` ignores pagination** — it accepts `IGetPaginatedData` (`page`, `pageSize`)
   but only applies `.order()`, never `.range()`. `getProductService.fetchProducts` passes `pageSize: 100`
   with no effect; all rows are returned. Implement `.range()` if real pagination is needed.

6. **Realtime is dormant on the catalog** — `useRealtimeProducts` is imported but commented out in
   `CatalogProducts` (renders static `initialProducts`); the dashboard table doesn't use it either. Wire
   the hook in to make lists live.

7. **Typo in `CookieKey` filename** — the file is `CookieyKey.ts` (extra `y`); the enum inside is correctly
   named `CookieKey`. Import from `@common/enums/CookieyKey` until renamed. (The cookie-based access-token
   flow it was built for is largely unused.)

8. **Duplicate enums** — `AccessType` and `UserRole` are identical (`'Admin' | 'User'`).
   `validateUserAccess` casts a `UserRole` to `AccessType` (`as unknown as AccessType`). Consider collapsing
   to one.

9. **`SignUpForm` uses soft `router.push` after sign-up** — fine when sign-up returns no session (redirect
   to `/login`), but if email confirmation is disabled and a session is returned, `router.push('/catalog')`
   hits the stale-`UserContext` problem described in Auth Layer 3. Prefer a hard navigation when a session
   exists.

10. **Dead `@utils/*` alias** — the `@utils/*` alias resolves to a deleted directory (`utils/` is gone; the
    now-`src/core/utils` folder was also removed). `src/modules/common/index.ts` no longer exists either —
    `common` is imported by full path (see Module structure).

---

## System settings ##

You are my advisor, not my assistant. Your job is accuracy, not agreement. Follow these rules in every reply:

1. **Do not open with agreement or praise**. If my idea has a flaw, gap, or risky assumption, state it in your first sentence. If my idea is solid, say so plainly in one line and move on. Never invent objections just to disagree.
2. **Rate your confidence on key claims**: [Certain] for hard evidence, [Likely] for strong inference, [Guessing] when filling gaps. If most of your reply is guesswork, say so upfront.
3. **Never use filler praise**: "Great question," "You're absolutely right," "That makes sense," "Absolutely,"
"Definitely."
4. **When I'm wrong, use this structure**: "I disagree because [reason]. Here's what I'd do instead:
[alternative]. The risk in your approach is [specific downside]."
5. **Lead with the uncomfortable truth**. If there's something I won't want to hear, put it in the first line, not paragraph three.
6. **No warm-up paragraphs**. Start with the most useful thing you can say.
7. **If I push back, hold your position unless** I give you new facts or your claim was tagged [Guessing]. "But I really think" is not new information.



## What Is Not Yet Implemented

- Stripe checkout / payment flow (server Stripe client + provisioning service exist, but no checkout
  sessions, webhooks, server action wiring, or browser Stripe.js).
- API routes (`app/api/` does not exist) and server actions (`'use server'`).
- Cart / orders (no UI, services, or tables).
- Password reset flow.
- Locale switching UI/catalog (the cookie-based negotiation now exists — `locale.service.ts`
  `getLocale`/`changeLocale` + `resolveLocale`, consumed by `request.ts` — but there is still only the `en`
  catalog and one `Locale`, no URL locale routing, and no language-switcher component calling `changeLocale`).
- Pagination in `BaseDao.findAll` (params accepted, `.range()` not applied).
- Global state management beyond `UserContext` (no Redux/Zustand).
- `@static` target and a `utils/` directory for `@utils/*` (aliases reserved/dangling, directories absent).
- Tests (no jest setup or specs; jest/strict-null-checks ESLint rules deliberately not migrated).
