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
| Payments | `stripe` v22 (server SDK — client initialized in `src/core/stripe/server.ts`; no checkout flow yet) |
| Forms | `react-hook-form` v7 + `yup` v1 + `@hookform/resolvers` v5 |
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

```
client/
├── app/
│   ├── layout.tsx              # Root layout. Server-fetches the current user and provides
│   │                           #   it via <UserContextProvider>; wraps app in MUI AppRouterCacheProvider.
│   ├── loading.tsx             # Root loading UI
│   ├── error.tsx               # Root error boundary
│   ├── globals.css
│   ├── (auth)/                 # Unauthenticated area
│   │   ├── layout.tsx          # Server layout: redirects already-authenticated users to /catalog
│   │   ├── login/page.tsx      # renders <LogInForm>
│   │   └── register/page.tsx   # renders <SignUpForm>
│   └── (app)/                  # Authenticated area (each route guards itself via MainLayout)
│       ├── catalog/
│       │   ├── layout.tsx      # <MainLayout access={AccessType.ADMIN}>  (see Known Bugs #1)
│       │   └── page.tsx
│       ├── dashboard/
│       │   ├── layout.tsx      # <MainLayout access={AccessType.ADMIN}>
│       │   ├── loading.tsx
│       │   └── page.tsx        # renders DashboardPage (server component, fetches products)
│       └── forbidden/page.tsx
├── src/
│   ├── components/             # Shared, reusable UI primitives — import via `@components`
│   │                          #   Button, DataTable (+IColumn), FormInput, ImageUpload,
│   │                          #   Loading, NavLink, Skeleton, TableSkeleton
│   ├── config/                 # Validated, typed env access — import `{ env }` from `@config`
│   │                          #   (env.ts + env.schema.mjs shared with the validation scripts)
│   ├── core/                   # Cross-cutting code — AbstractStorageService, stripe/server.ts (Stripe client)
│   └── modules/                # Feature modules; each is self-contained (see Module structure)
│       ├── auth/               # components (LogInForm, SignUpForm), enums (AccessType),
│       │                       #   layouts (AuthGuard — client), services (auth.service),
│       │                       #   types, utils (validateUserAccess, normalizeAllowedAccess)
│       ├── user/               # contexts (UserContext + useUser), components (ProfileCard),
│       │                       #   enums (UserRole), services (user.service), types (IUser)
│       ├── product/            # Full CRUD module — see "Product module" below
│       ├── catalog/            # navigation (catalogNavItems) — page itself is a stub
│       ├── dashboard/          # navigation (dashboardNavItems), pages/dashboard.tsx
│       └── common/             # App chrome: components (Navbar), layouts (MainLayout),
│                               #   enums (CookieKey), types (INavItem)
├── utils/
│   └── supabase/
│       ├── client.ts           # Browser Supabase client ('use client' components)
│       ├── server.ts           # Server Supabase client (Server Components, Route Handlers)
│       ├── proxy.ts            # updateSession() — middleware implementation
│       └── storage/index.ts    # StorageService singleton (extends AbstractStorageService)
├── constants/
│   └── storage.ts              # BUCKET_ID = "WebStore", BASE_BUCKET_URL
├── scripts/
│   ├── validate-env.mjs        # Validates the local .env against the schema (pre-commit)
│   └── check-env-example.mjs   # Asserts .env.example lists every schema var (pre-commit / CI)
├── .env.example                # Committed template of all env vars (kept in sync by the check above)
├── supabase/
│   └── migrations/             # SQL migrations (users + products tables) — managed via Supabase CLI
├── proxy.ts                    # Next.js middleware entry (exports `proxy` + `config.matcher`)
├── next.config.ts              # images.remotePatterns allow the Supabase storage host
├── tsconfig.json
├── eslint.config.mjs           # Flat ESLint config (Next core-web-vitals + TS + house style)
└── .env                        # Supabase + OAuth keys (NEXT_PUBLIC_* are browser-exposed)
```

### Where new code goes

- **New page route** → `app/(app)/<route>/page.tsx` (authenticated) or `app/(auth)/<route>/page.tsx`
- **New protected route** → add `app/(app)/<route>/layout.tsx` wrapping `<MainLayout access={...}>`
- **New feature** → new folder under `src/modules/<feature>/` following the module layout below
- **Shared UI primitive** (generic, feature-agnostic) → `src/components/`, import via `@components`
- **App-level chrome** (depends on app modules/contexts, e.g. Navbar) → `src/modules/common/components/`
- **Cross-cutting abstraction** (interfaces/base classes) → `src/core/`
- **New enum** → `src/modules/<module>/enums/`
- **New service** → `src/modules/<module>/services/` — export a singleton instance

---

## Architecture Patterns

### Module structure

Each module under `src/modules/` follows this internal layout (subfolders present as needed):

```
<module>/
├── components/      # React components ('use client' when they need browser APIs)
├── contexts/        # React context providers + hooks ('use client')
├── enums/           # String enums
├── layouts/         # Wrapper components (guards, providers)
├── navigation/      # Nav item definitions (INavItem[])
├── pages/           # Page-level server components composed by app/ routes
├── services/        # Classes exported as singletons via `export default new MyService`
├── types/           # TypeScript interfaces (I prefix: IUser, ISignIn)
└── utils/           # Pure functions, no side effects
```

Modules export their public API through an `index.ts` barrel — always import from the barrel
(`@modules/product`), not from internal files, except where a file is explicitly server-only
(e.g. `product.server.service.ts`, imported by its full path from server components).

### Service pattern

Services are plain TypeScript classes instantiated once and exported as a default singleton, then
re-exported by name from the module's `services/index.ts`:

```typescript
class AuthService {
    async signInUser(data: ISignIn) { /* ... */ }
}
export default new AuthService;
```

Services are thin, stateless wrappers around Supabase SDK calls. **They are split by execution
context:**

- **Client services** call `createClient()` from `@utils/supabase/client` and run only in
  `'use client'` components (e.g. `auth.service.ts`, `user.service.ts` is the exception — see below,
  `product.service.ts`, `product-image.service.ts`).
- **Server services** call `createClient()` from `@utils/supabase/server` and run only in Server
  Components / Route Handlers. Name them `*.server.service.ts` (e.g. `product.server.service.ts`).
  `user.service.ts` is a server service.

### Server vs Client components

- Default to **Server Components** (no directive).
- Add `'use client'` only for browser APIs, event handlers, `useState`, `useEffect`, or context hooks.
- Pick the Supabase client that matches the context (see Service pattern). Mixing them throws at runtime.

### Auth & route protection (three layers)

Auth state lives in **two synchronized places** and the guards read from different ones — keep this
in mind when debugging redirects.

**Layer 1 — Middleware** (`proxy.ts` → `utils/supabase/proxy.ts`):
- Runs on every request (`config.matcher` excludes `_next/*` and static image extensions).
- Injects `x-pathname` header.
- Calls `supabase.auth.getClaims()`; if there is no session, redirects to `/login`.
- Pass-through exceptions: `/` (home), `/login*`, `/register*`.

**Layer 2 — `(auth)` server layout** (`app/(auth)/layout.tsx`):
- Server component; calls `userService.fetchCurrentUser()`.
- If a user exists, redirects to `/catalog` (keeps logged-in users out of login/register).

**Layer 3 — `AuthGuard`** (`src/modules/auth/layouts/AuthGuard/index.ts`, **client component**):
- Reached through `MainLayout` (`src/modules/common/layouts/MainLayout.tsx`), which renders
  `<AuthGuard access={...}><Navbar />{children}</AuthGuard>`.
- Reads the user from `useUser()` (the `UserContext`), **not** from cookies.
- `user === null` → `redirect('/login')`; access mismatch → `redirect('/forbidden')`.
- Access is checked with `validateUserAccess(user.role, normalizeAllowedAccess(access))`.

**UserContext** (`src/modules/user/contexts/UserContext`): the root layout server-fetches the current
user once and feeds it to `UserContextProvider`. Because the root layout does **not** re-run on soft
(client-side) navigation, anything that changes auth state on the client must force the server data to
refresh — e.g. `LogInForm` uses `window.location.assign('/catalog')` (a hard navigation) after sign-in.
A plain `router.push` leaves `useUser()` stale and causes a `/login ↔ /catalog` redirect loop between
Layer 2 and Layer 3.

### Forms

`react-hook-form` + `yup`. Schemas live in a `schemas/` subfolder next to the component. Submit handlers
catch service errors into local `serverError` state and surface them via a MUI `<Alert>` (see
`LogInForm`, `SignUpForm`). Standard hook setup:

```typescript
const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(mySchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
})
```

---

## Database — Supabase

Schema is now version-controlled as **SQL migrations** in `supabase/migrations/` and applied via the
Supabase CLI (`supabase` devDependency, `supabase/` project dir). This replaces the old "dashboard-only,
no local migrations" workflow — add a migration file rather than editing schema by hand.

### Tables

| Table | Key columns | Notes |
|---|---|---|
| `users` | `id` (uuid, PK, FK → `auth.users.id`), `email`, `"firstName"`, `"lastName"`, `avatar`, `role` (`public."UserRole"`), `created_at`, `updated_at` | camelCase columns are quoted to match `IUser`. RLS: a user may read/update only their own row. |
| `products` | `id` (uuid, PK), `name`, `image_url`, `amount` (`numeric(12,2)`), `currency`, `type` (`public."ProductType"`), `created_at` | snake_case columns match `IProduct`. RLS: `select` is public (anon + authenticated); insert/update/delete require authenticated. |

Postgres enums mirror the TS enums: `public."UserRole"` (`'Admin' | 'User'`),
`public."ProductType"` (`'Subscription' | 'Single'`).

### Role storage & sync

User role lives in two places:
1. `users.role` column (read by `userService.fetchCurrentUser()` → `UserContext`).
2. `auth.users.user_metadata.role` (set at sign-up by `authService.signUpUser`, defaults to `UserRole.USER`).

On sign-up a `handle_new_user` trigger copies `user_metadata` (`firstName`, `lastName`, `avatar`,
`role`) into a new `public.users` row, so the two start in sync automatically. If you change a role
later, update **both** places.

### Accessing Supabase

```typescript
// Server Components, layouts, Route Handlers, *.server.service.ts:
import { createClient } from '@utils/supabase/server';
const supabase = await createClient();

// 'use client' components and client services:
import { createClient } from '@utils/supabase/client';
const supabase = createClient();   // not awaited — browser client is synchronous
```

### Storage

- Bucket id and base URL are centralized in `constants/storage.ts` (`BUCKET_ID = "WebStore"`).
- `src/core/AbstractStorageService.ts` defines the upload/download contract; `utils/supabase/storage`
  implements it as a singleton.
- Product images live under `product-image/<productId>/...`. `product-image.service.ts` (client)
  handles upload/cleanup; `product.service.ts` removes a product's image folder on delete.
- `next.config.ts` whitelists the Supabase storage host under `images.remotePatterns` so `next/image`
  can render product images.

### Environment variables

```
NEXT_PUBLIC_SUPABASE_URL              # Supabase project URL (browser-safe)
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY  # Publishable key (browser-safe)
OAUTH_SUPABASE_CLIENT_ID              # OAuth client ID (server-only)
OAUTH_SUPABASE_CLIENT_SECRET          # OAuth secret (server-only — keep out of NEXT_PUBLIC_*)
SITE_URL                              # http://localhost:3000 in dev
STRIPE_SECRET_KEY                     # Stripe secret key (server-only) — used by src/core/stripe/server.ts
STRIPE_PUBLISHBEL_KEY                 # Stripe publishable key. NOTE: misspelled, and not NEXT_PUBLIC_*
                                      #   so it is NOT browser-exposed. Rename to
                                      #   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY before using Stripe.js client-side.
```

### Environment validation

One **yup** schema, `src/config/env.schema.mjs`, is the single source of truth for which variables the
app requires. It is plain ESM (`.mjs`) on purpose — no TS runner is installed, yet both the Node scripts
and the TS app can import it. It currently enforces only the variables code actually reads
(`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`) so it never
blocks on unused config. Three consumers:

- **`src/config/env.ts` → `@config` (runtime, typed).** `import { env } from '@config'` gives a
  validated, typed env object. It calls `validateSync` once at first import and **throws on the server
  if anything is missing** (fail-fast at boot/build). **Server-only** — do not import `@config` from a
  Client Component (server secrets are undefined in the browser bundle and validation would throw).
  Currently used by `src/core/stripe/server.ts` and `utils/supabase/server.ts`. The browser client
  (`utils/supabase/client.ts`) and the Edge middleware (`utils/supabase/proxy.ts`) still read
  `process.env` directly by design.
- **`scripts/validate-env.mjs` (`npm run validate:env`).** Loads `.env` like Next.js (`@next/env`) and
  validates the developer's local env. Runs in pre-commit.
- **`scripts/check-env-example.mjs` (`npm run check:env-example`).** Asserts the committed `.env.example`
  declares every variable in the schema, so the template never drifts. Needs no secrets (CI-safe). Runs
  in pre-commit.

The pre-commit hook is `validate:env && check:env-example && lint`. **When new code needs a new env var:
add it to `env.schema.mjs`, the `IEnv` interface in `env.ts`, and `.env.example`.**

### Stripe

Import the server client where you need it — it is a shared singleton, not a factory:

```typescript
import { stripe } from '@core/stripe/server';   // Server Components / Route Handlers / *.server.service.ts only
```

It pins `apiVersion: '2026-05-27.dahlia'` (the version bundled with `stripe` v22.2.2) and reads its secret
from the validated `@config` env (so a missing `STRIPE_SECRET_KEY` fails fast). There is no browser-side
Stripe.js client yet (`@stripe/stripe-js` is not installed).

---

## Product module

The most fully built feature; use it as the reference for new CRUD modules.

- **components/** — `ProductsTable`, `AddProductButton`, `AddProductModal`, `EditProductModal`,
  `DeleteProductModal`. Add/Edit modals use the shared `<ImageUpload>` primitive (owns blob-preview
  state and object-URL lifecycle) and per-modal yup schemas + `utils/` create/update helpers.
- **services/** — `product.service.ts` (client: create/update/delete + storage cleanup),
  `product.server.service.ts` (server: `fetchProducts`), `product-image.service.ts` (client: image
  upload/delete).
- **types/** — `IProduct`, `ICreateProduct`, `IUpdateProduct`.
- **enums/** — `ProductType`.
- **utils/image/** — pure validation helpers (allowed format/size, minimum dimensions, dimension
  reading) plus shared `constraints`/`messages`, re-exported from `utils/image/index.ts`.

`DashboardPage` (`src/modules/dashboard/pages/dashboard.tsx`) is a server component that calls
`productServerService.fetchProducts()` and renders the table.

### Navigation

Sidebar items are declared per feature as `INavItem[]` (`@common/types`) in each module's
`navigation/` folder (`catalogNavItems`, `dashboardNavItems`). `Navbar` composes them via
`filterNavItemsByAccess(user?.role)`, which hides items whose `access` the current role fails.

---

## TypeScript Path Aliases

Defined in `tsconfig.json` — always prefer these over relative imports:

| Alias | Resolves to |
|---|---|
| `@modules/*` | `src/modules/*` |
| `@common/*` | `src/modules/common/*` |
| `@components`, `@components/*` | `src/components`, `src/components/*` |
| `@auth/*` | `src/modules/auth/*` |
| `@user/*` | `src/modules/user/*` |
| `@catalog/*` | `src/modules/catalog/*` |
| `@core/*` | `src/core/*` |
| `@utils/*` | `utils/*` |
| `@config` | `src/config` — validated env (`import { env } from '@config'`). No `@config/*` form. |
| `@static` | `static` (reserved — does not exist yet) |

Note there is **no `@dashboard` or `@product` alias** — import those via `@modules/dashboard`,
`@modules/product`. `@components` resolves to the barrel (`src/components/index.ts`) — import primitives
from the barrel, not internal file paths. A few files still reach Supabase storage constants via the
relative `../../../../constants/storage` path; `constants/` has no alias.

---

## Coding Conventions

### Naming

- Interfaces: `I` prefix — `IUser`, `ISignIn`, `IProps` (enforced by `@typescript-eslint/naming-convention`).
- Enums: PascalCase name, string values matching display text — `UserRole.ADMIN = 'Admin'`.
- Files: `camelCase` for utilities/services; PascalCase component folders with `index.tsx` inside.
- Server-only services: suffix `*.server.service.ts`.
- Singleton service exports: `export default new MyService`.

### Styling

- **Tailwind CSS v4** for layout and custom styling — utility classes in JSX.
- **Material UI v9** for interactive elements (TextField, Button, Box, Avatar, Tooltip, Alert) and
  icons (`@mui/icons-material`). Don't create `*.module.scss` files.
- Don't mix MUI layout components with Tailwind layout for the same concern — pick one per concern.

### ESLint

A single flat config, `eslint.config.mjs` (ESLint 9), is what `npm run lint` runs. It spreads
`eslint-config-next` (core-web-vitals + typescript) and then layers the house style that used to live
in the legacy `.eslintrc.json` (now removed). The `.husky/pre-commit` hook runs
`npm run validate:env && npm run lint` (see Environment validation below), so the tree must lint clean
(errors block commits; warnings don't) **and** the local `.env` must satisfy the env schema.

Enforced (errors): import order, alphabetized & grouped `builtin → external → internal → sibling →
index → parent` with blank lines between groups (path aliases like `@modules/*` count as *internal*
via `import/internal-regex`); `object-curly-spacing: always`; `eol-last`; `no-duplicate-imports`;
`no-multiple-empty-lines`; `no-param-reassign` (props allowed); `@typescript-eslint/naming-convention`
(interfaces must match `^I[A-Z]`).

Warnings (fix when you touch the file): `max-len` 120 (comments ignored), `curly`, `no-return-await`,
`no-unneeded-ternary`, `prefer-destructuring`, `padding-line-between-statements` (blank lines around
blocks/multiline declarations), `@typescript-eslint/no-unused-vars` (`^_` ignored).

Run `npm run lint:fix` to auto-fix the formatting-class rules. Don't disable rules without a comment.

**Not enforced** (deliberately not migrated): prettier-as-eslint-rule (`eslint-plugin-prettier` not
installed; prettier defaults are 2-space and would churn this 4-space codebase — add a matching
`.prettierrc` first if you want it), jest rules (no tests), and the `strict-null-checks` plugin
(redundant with `strictNullChecks` in tsconfig).

---

## Known Bugs & Technical Debt

Fix these when you touch the relevant file; don't replicate the patterns.

1. **`/catalog` requires `AccessType.ADMIN`** (`app/(app)/catalog/layout.tsx`). A normal `User`-role
   account is post-login redirected to `/catalog` and then bounced to `/forbidden`. If catalog is meant
   for any signed-in user, change it to `AccessType.USER` or drop the `access` prop. Confirm intent
   before changing.

2. **Typo in `CookieKey` filename** — the file is `CookieyKey.ts` (extra `y`); the enum inside is
   correctly named `CookieKey`. Import from `@modules/common/enums/CookieyKey` until renamed. (The
   cookie-based access-token flow it was built for is largely unused now.)

3. **`userService.fetchCurrentUser()` has no explicit filter** (`src/modules/user/services/user.service.ts`)
   — it does `auth.getUser()` then `from('users').select('*').single()`. It returns the right row only
   because RLS scopes `select` to `auth.uid()`. Add an explicit `.eq('id', user.id)` so it doesn't break
   if RLS changes.

4. **Duplicate access-normalizer utils** — `normalizeAllowedAccess.ts` and `normalizeUserAccess.ts` are
   byte-for-byte identical. Only `normalizeAllowedAccess` is used; `normalizeUserAccess` is dead code
   (and has trailing whitespace). Delete the duplicate.

5. **Duplicate enums** — `AccessType` and `UserRole` are identical (`'Admin' | 'User'`).
   `validateUserAccess` casts a `UserRole` to `AccessType`. Consider collapsing to one.

6. **Overlapping product-image cleanup methods** — `product-image.service.ts` has both
   `deleteProductImages` and `deleteProductImagesExcept` plus folder-deletion logic duplicated in
   `product.service.deleteProduct`. Consolidate.

7. **`LogInForm` imports `UserRole` but never uses it** — leftover from the old role-based redirect.
   Remove the unused import.

8. **`SignUpForm` uses soft `router.push` after sign-up** — fine when sign-up returns no session
   (redirect to `/login`), but if email confirmation is disabled and a session is returned, the
   `router.push('/catalog')` hits the same stale-`UserContext` problem described in Layer 3. Prefer a
   hard navigation when a session exists.

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

- Catalog page content (only `catalogNavItems` + a stub `/catalog` page exist).
- API routes (`app/api/` does not exist).
- Stripe checkout / payment flow (server client initialized in `src/core/stripe/server.ts`, but no
  checkout sessions, webhooks, or browser Stripe.js yet).
- Cart / orders (no UI, services, or tables).
- Password reset flow.
- Global state management beyond `UserContext` (no Redux/Zustand).
- `@config` / `@static` targets (aliases reserved, directories absent).
- Tests (Jest plugins referenced in `.eslintrc.json`, but no test setup or specs).
