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
| Language | TypeScript 5, strict mode |
| Runtime | React 19 |
| Styling | Tailwind CSS v4 + SCSS Modules + Material UI v9 |
| Auth & DB | Supabase (`@supabase/ssr` 0.10, `@supabase/supabase-js` 2) |
| Forms | `react-hook-form` v7 + `yup` v1 + `@hookform/resolvers` |
| HTTP | `axios` (not yet used for Supabase calls — those go through the Supabase SDK) |
| Cookies | `universal-cookie` v8 (client-side); Next.js `cookies()` API (server-side) |
| Package manager | npm |

Run dev server: `npm run dev` from `client/`.

---

## Project Structure

```
client/
├── app/                        # Next.js App Router — routes only, minimal logic
│   ├── layout.tsx              # Root layout (no AuthGuard here)
│   ├── dashboard/
│   │   ├── layout.tsx          # Protected layout: wraps children in <AuthGuard access={AccessType.ADMIN}>
│   │   └── page.tsx
│   ├── catalog/
│   │   └── page.tsx
│   ├── login/
│   │   └── page.tsx
│   └── forbidden/
│       └── page.tsx
├── src/
│   ├── core/                   # Intentionally empty — reserved for future shared core utilities
│   └── modules/                # Feature modules; each module is self-contained
│       ├── auth/
│       │   ├── components/     # Client components (LogInForm)
│       │   ├── enums/          # AccessType enum
│       │   ├── layouts/        # Server components acting as route guards (AuthGuard)
│       │   ├── services/       # Auth business logic (singleton class instances)
│       │   ├── types/          # TypeScript interfaces for auth
│       │   └── utils/          # Pure helper functions (normalizeUserAccess, validateUserAccess)
│       ├── catalog/            # Stub module — not yet implemented
│       ├── common/
│       │   ├── components/     # Shared UI components (FormInput)
│       │   └── enums/          # CookieKey enum (note: file is misspelled CookieyKey.ts)
│       └── user/
│           ├── enums/          # UserRole enum
│           ├── services/       # User business logic (singleton class instances)
│           └── types/          # IUser interface
├── utils/
│   └── supabase/
│       ├── client.ts           # Browser Supabase client (use in 'use client' components)
│       └── server.ts           # Server Supabase client (use in Server Components, Route Handlers)
├── proxy.ts                    # Next.js middleware entry point (exports updateSession as `proxy`)
├── next.config.ts
├── tsconfig.json
└── .env                        # Supabase keys (NEXT_PUBLIC_* are browser-exposed)
```

### Where new code goes

- **New page route** → `app/<route>/page.tsx`
- **New protected route** → add `app/<route>/layout.tsx` wrapping `<AuthGuard>`
- **New feature** → new folder under `src/modules/<feature>/` following the same subdirectory pattern
- **Shared UI primitive** → `src/modules/common/components/`
- **New enum** → `src/modules/<module>/enums/`
- **New service** → `src/modules/<module>/services/` — export a singleton instance

---

## Architecture Patterns

### Module structure

Each module under `src/modules/` follows this internal layout:

```
<module>/
├── components/      # React components ('use client' when they need browser APIs)
├── enums/           # String enums
├── layouts/         # Async Server Components used as wrappers (guards, providers)
├── services/        # Classes exported as singletons via `export default new MyService`
├── types/           # TypeScript interfaces (named with I prefix: IUser, ISignIn)
└── utils/           # Pure functions, no side effects
```

Modules export their public API through an `index.ts` barrel — always import from the barrel, not from internal files directly.

### Service pattern

Services are plain TypeScript classes instantiated once and exported as a default singleton:

```typescript
class AuthService {
    async signInUser(data: ISignIn) { /* ... */ }
}
export default new AuthService;
```

Services do **not** hold state. They are thin wrappers around Supabase SDK calls.

### Server vs Client components

- Default to **Server Components** (no directive needed)
- Add `'use client'` only when the component uses browser APIs, event handlers, `useState`, or `useEffect`
- Services that call `createClient()` from `utils/supabase/server.ts` must run in a Server Component or Route Handler
- Services that call `createClient()` from `utils/supabase/client.ts` must run in a `'use client'` component

### Route protection (two-layer)

**Layer 1 — Middleware** (`proxy.ts` → `utils/supabase/proxy.ts`):
- Runs on every request via `export const config = { matcher: [...] }`
- Injects `x-pathname` header (used by AuthGuard to know current route)
- Calls `supabase.auth.getClaims()` — if no active session, redirects to `/login`
- Exceptions: `/login` and `/auth` routes pass through unauthenticated

**Layer 2 — AuthGuard** (`src/modules/auth/layouts/AuthGuard/index.ts`):
- Async Server Component; wrap any route's layout with it
- Reads `access_token` cookie → fetches `currentUser` from `users` table → checks role
- Accepts `access?: AccessType | AccessType[]` — omit for "any authenticated user"
- Usage: `<AuthGuard access={AccessType.ADMIN}>{children}</AuthGuard>`

---

## Database — Supabase

The project uses **Supabase (managed PostgreSQL)**. There are no local migration files — schema is managed in the Supabase dashboard.

### Known tables

| Table | Key columns |
|---|---|
| `users` | `email`, `firstName`, `lastName`, `avatar`, `role` (string: `'Admin'` \| `'User'`) |

### Accessing Supabase

Always pick the right client for the context:

```typescript
// In Server Components, layouts, Route Handlers:
import { createClient } from 'utils/supabase/server';
const supabase = await createClient();

// In 'use client' components:
import { createClient } from 'utils/supabase/client';
const supabase = await createClient();
```

User role is stored in **two places**:
1. `users.role` column (used by `userService.fetchCurrentUser()`)
2. `auth.users.user_metadata.role` (used by `LogInForm` after sign-in to decide redirect route)

Both must be kept in sync when a user's role changes.

### Environment variables

```
NEXT_PUBLIC_SUPABASE_URL          # Supabase project URL (browser-safe)
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY  # Publishable key (browser-safe)
OAUTH_SUPABASE_CLIENT_ID          # OAuth client ID (server-only)
OAUTH_SUPABASE_CLIENT_SECRET      # OAuth secret (server-only — keep out of NEXT_PUBLIC_*)
SITE_URL                          # http://localhost:3000 in dev
```

---

## TypeScript Path Aliases

Defined in `tsconfig.json` — always use these instead of relative imports:

| Alias | Resolves to |
|---|---|
| `@modules/*` | `src/modules/*` |
| `@common/*` | `src/modules/common/*` |
| `@utils/*` | `utils/*` |
| `@config` | `src/config` |

Example: `import { authService } from '@modules/auth/services'`

---

## Coding Conventions

### Naming

- Interfaces: `I` prefix — `IUser`, `ISignIn`, `IProps`
- Enums: PascalCase name, string values matching display text — `UserRole.ADMIN = 'Admin'`
- Files: `camelCase` for utilities/services, `PascalCase` component folders with `index.tsx` inside
- Singleton service exports: `export default new MyService` (no semicolon after the class closing brace is acceptable, but be consistent)

### Styling

Use **SCSS Modules** for component-scoped styles: create `styles.module.scss` alongside the component, import as `import styles from './styles.module.scss'`, apply as `className={styles.myClass}`.

Use **Tailwind CSS** for layout and utility classes directly in JSX (e.g., `className="flex flex-col min-h-full"`).

Use **Material UI** components for interactive form elements (TextField, Button, Box). Do not mix MUI layout components with Tailwind — pick one system per concern.

### Form pattern

```typescript
const { register, formState: { errors }, getValues } = useForm({
    resolver: yupResolver(mySchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
})
```

Define validation schemas in a `schemas/` subfolder next to the component.

### ESLint

Max line length: 120 characters. Import order is enforced: builtin → external → internal → sibling → index. Do not disable ESLint rules without a comment explaining why.

---

## Known Bugs & Technical Debt

These exist in the current codebase. Do not replicate the pattern; fix them when touching the relevant file:

1. **AuthGuard inverted redirect** ([`src/modules/auth/layouts/AuthGuard/index.ts:38`](src/modules/auth/layouts/AuthGuard/index.ts#L38))
   The condition `if (currentUser && hasAccess) redirect('/forbidden')` is backwards — it redirects users who DO have access to `/forbidden`. The correct logic is `if (!hasAccess)`.

2. **Typo in CookieKey filename** — the file is `CookieyKey.ts` (extra `y`). The enum itself is named correctly as `CookieKey`. When creating new imports, use `@modules/common/enums/CookieyKey` until the file is renamed.

3. **`userService.fetchCurrentUser()` fetches all users** ([`src/modules/user/services/user.service.ts:9`](src/modules/user/services/user.service.ts#L9)) — `supabase.from('users').select()` has no filter. It should filter by the authenticated user's ID or email.

4. **Cookie set before error check** in `authService.signInUser()` — the access token is written to cookies before checking if the Supabase call returned an error. If sign-in fails, a `null`/`undefined` token gets stored.

5. **Debug `console.log` calls** in `auth.service.ts` and `user.service.ts` — remove before shipping.

6. **No error boundary around `LogInForm` submit** — `authService.signInUser()` throws on failure but the form's `onSubmit` handler does not catch it, so auth errors are unhandled.

---

## What Is Not Yet Implemented

- Catalog module (stub only — `src/modules/catalog/index.ts` is empty)
- API routes (`app/api/` does not exist)
- Sign-up / password reset flows
- Cart functionality
- Any product/order data model or Supabase tables beyond `users`
- Global state management (no Redux, Zustand, or Context set up yet)
- Tests
