# AGENTS.md

## Purpose

This file is the source of truth for AI agents working in the `rexolute` frontend. It documents how the app is structured, how to make safe changes, what to verify before shipping, and which areas need extra care because the current codebase contains transitional patterns and a few inconsistencies.

Use this guide before editing code. When in doubt, prefer the patterns already used in the nearest feature area instead of introducing a new abstraction.

## Product And Stack

- Framework: Next.js `15.3.6`
- Router: Pages Router (`src/pages`), not App Router
- React: `19.2.0`
- Language: TypeScript with `strict: true`
- Styling: Tailwind CSS + custom shared UI primitives under `src/components/ui`
- Auth: `next-auth` with credentials flow
- Data fetching: `axios`
- Forms: primarily `react-hook-form` + `zod`
- Charts/tables: `recharts`, `@tanstack/react-table`
- Package manager: Yarn Classic (`yarn@1.22.22`)
- Node target: `22.x`

## Operating Principles

- Preserve the Pages Router architecture. Do not migrate routes to App Router unless explicitly requested.
- Reuse existing shared UI components from `src/components/ui` before creating new primitives.
- Keep route-specific logic close to the route unless multiple screens already share the same concern.
- Match the current import convention: use the `@/` alias for files under `src`.
- Prefer typed interfaces from `src/types` and extend them when needed instead of scattering inline `any`.
- Avoid broad refactors during feature work unless the task explicitly includes cleanup.

## Repository Map

### Core directories

- `src/pages`: all routes, including admin, auth, home, API routes, and error pages
- `src/components/admin`: admin-specific layouts, forms, dashboard widgets, modals, and session flows
- `src/components/home`: marketing/public-facing layout
- `src/components/shared`: cross-cutting providers, wrappers, icons, head helpers, and shared context
- `src/components/ui`: reusable UI primitives built on Radix and Tailwind
- `src/lib/api`: axios client, interceptors, and API error parsing
- `src/lib/utils`: utility helpers such as `cn` and date formatting
- `src/assets`: global CSS, fonts, and static asset exports
- `src/types`: shared application and auth types
- `src/hooks`: custom hooks, including session-aware axios helpers and shared-layout state access

### High-impact files

- `src/pages/_app.tsx`: global app shell, route-based layout selection, font CSS variables
- `src/middleware.ts`: route protection for `/admin` and `/client`
- `src/pages/api/auth/[...nextauth].ts`: NextAuth credentials provider and session/JWT shaping
- `next.config.mjs`: rewrites, redirects, image behavior, build suppression, webpack fallbacks
- `tailwind.config.ts`: theme tokens and container sizing

## Routing Model

The app uses filesystem routes under `src/pages` with custom rewrites:

- `/` rewrites to `/home`
- non-admin/client/api/auth slugs rewrite into `/home/*`
- `/admin/login` rewrites to `/auth/admin/login`
- `/client/login` rewrites to `/auth/client/login`

Implications for agents:

- Public marketing pages usually belong under `src/pages/home/*`
- Admin screens belong under `src/pages/admin/*`
- Auth screens belong under `src/pages/auth/*`
- Be careful when adding new top-level routes because `next.config.mjs` rewrites many unmatched paths into `/home`

## Layout And Rendering Conventions

`src/pages/_app.tsx` chooses layouts by route prefix:

- `/admin*` routes render inside `components/admin/layout/dashboard`
- `/client*` routes rely on page/default layout behavior
- `/home*` routes render inside `components/home/layout`

Important notes:

- `SessionProvider` currently wraps admin and client routes only
- `NoSSR` is used around admin/client/home layouts
- Page-level `getLayout` is supported via `NextPageWithLayout`

When adding a page:

- Put the route in the correct folder so `_app.tsx` applies the expected layout
- Use `getLayout` only when the feature already follows that pattern
- Do not assume App Router features such as server components or route handlers

## Authentication And Authorization

Auth is handled with `next-auth` credentials login in `src/pages/api/auth/[...nextauth].ts`.

Current behavior:

- Provider id: `admin-auth`
- OTP verification calls backend `/auth/verify-otp?mode=token`
- Session strategy is JWT
- Middleware protects `/admin` for `role === "admin"` and `/client` for `role === "client"`

Agent guardrails:

- If you add protected admin/client routes, confirm the route prefix matches middleware expectations
- If you change session shape, update both NextAuth callbacks and any consuming types under `src/types`
- If you touch token refresh logic, inspect both `src/pages/api/auth/[...nextauth].ts` and `src/hooks/use-axios-interceptor.tsx`

## Data Fetching And API Conventions

### Primary client

- Shared axios instance: `src/lib/api/axios.ts`
- Shared exports: `src/lib/api/index.ts`
- Error normalization: `parseAxiosError` in `src/lib/api/error.ts`

### Current caveats

The repo contains more than one token-refresh approach:

- `src/hooks/use-axios-interceptor.tsx` is the more React-aware pattern because it uses `useSession()` and `update()`
- `src/lib/api/interceptor.ts` contains a separate interceptor setup path

Preferred rule for new UI work:

- Use `useAxiosInterceptors()` inside authenticated client components/pages that need API access
- Reuse `parseAxiosError()` for user-facing failure handling
- Keep backend endpoint strings close to the consuming feature unless a shared service module already exists

Environment caveat:

- `src/lib/api/axios.ts` uses `NEXT_PUBLIC_API_BASE_URL`
- `src/hooks/use-axios-interceptor.tsx` refresh logic uses `NEXT_PUBLIC_API_URL`

If you work in API/auth code, verify which env variable is actually intended before expanding the pattern.

## Styling And UI Rules

- Prefer Tailwind utility classes over ad hoc CSS files
- Reuse primitives from `src/components/ui` first
- Reuse `cn()` from `src/lib/utils/utils.ts` for class merging
- Fonts are registered in `src/assets/fonts.ts` and exposed through CSS variables in `_app.tsx`
- Keep admin UI visually consistent with the existing gray/green dashboard language unless the task explicitly redesigns it

When creating new UI:

- Follow the spacing and typography rhythm used in adjacent files
- Prefer existing button, dialog, table, tabs, input, checkbox, and toast components
- Avoid importing a second component library

## Forms And Validation

Common pattern:

- `react-hook-form`
- `zod`
- `zodResolver`

Preferred approach:

- Define schema near the form component unless shared across multiple forms
- Surface API errors through `setError("root", ...)` when appropriate
- Keep client-side validation messages specific and short

## Shared State And Cross-Page Handoffs

Admin flows sometimes pass temporary state through `SharedLayoutProvider` in `src/components/shared/layout-provider.tsx` and access it via `useSharedData()`.

Use this carefully:

- It is suitable for transient admin flow handoffs
- It is not a replacement for URL state, backend persistence, or React Query caching
- If a screen must survive reloads or deep links, prefer route params or API refetching

## Commands

Use Yarn, not npm or pnpm.

- Install: `yarn`
- Dev: `yarn dev`
- Build: `yarn build`
- Start: `yarn start`
- Lint: `yarn lint`

Build note:

- `copy-assets` runs before `dev` and `build` and copies `pdf.worker.min.js` into `public/`
- Do not remove that step unless you also update the PDF/document viewer flow

## Quality Gates

Before finishing work, agents should do as many of these as the environment allows:

1. Run `yarn lint`
2. If the change affects routing, confirm the path is compatible with `next.config.mjs` rewrites and `src/middleware.ts`
3. If the change affects authenticated screens, verify session/token usage still matches NextAuth callbacks
4. If the change affects forms, test validation and submission error handling
5. If the change affects shared UI primitives, review at least one existing consumer for regressions

Current repo reality:

- `next.config.mjs` sets `eslint.ignoreDuringBuilds = true`
- `next.config.mjs` sets `typescript.ignoreBuildErrors = true`

That means a successful build is not enough to prove code quality. Agents should not rely on `yarn build` alone as validation.

## Environment Variables

Check `.env.local` or deployment settings before changing environment-sensitive code. Based on the current repo, these are the important names to verify:

- `APP_ENV`
- `APP_PORT`
- `APP_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `NEXT_PUBLIC_API_BASE_URL`
- `NEXT_PUBLIC_API_URL`

Do not assume both API URL variables are interchangeable. Confirm usage before standardizing them.

## Known Risks And Codebase Footguns

- `README.md` currently contains unresolved merge conflict markers
- Build-time lint and type failures are intentionally suppressed in `next.config.mjs`
- There are duplicate/intermediate auth refresh patterns
- Some pages and components still use `any` heavily
- Some files use `"use client"` even though this is a Pages Router app; avoid cargo-culting directives unless needed for compatibility with a reused component
- Rewrites are broad enough to hide routing mistakes during development
- `src/middleware.ts` returns early after auth checks, leaving older subdomain logic unreachable

Agents should mention these issues when relevant rather than silently deepening them.

## Change Strategy For Agents

### Safe default workflow

1. Read the nearest route, layout, hook, and type definitions before editing
2. Make the smallest coherent change that solves the task
3. Reuse existing UI and utility patterns
4. Update types when backend or session shapes change
5. Run available checks and report any gaps honestly

### When adding a new page

1. Place it under the correct `src/pages` subtree
2. Confirm `_app.tsx` gives it the intended layout
3. Confirm `next.config.mjs` will not rewrite the route unexpectedly
4. If protected, confirm middleware behavior

### When touching auth or API code

1. Check middleware, NextAuth callbacks, and axios interceptor usage together
2. Verify which token and env variable names the flow expects
3. Avoid introducing a third competing auth-refresh abstraction

### When touching shared UI

1. Prefer additive changes over breaking prop changes
2. Search existing usages before renaming props or variants
3. Keep visual changes scoped unless the task is a design-system update

## Definition Of Done

A change is ready when:

- The implementation follows the existing Pages Router structure
- Styling uses current shared patterns
- Auth/routing behavior is still coherent
- Types are updated where the data contract changed
- Available checks were run, or the inability to run them was explicitly reported
- Any known follow-up risk is called out clearly

## Agent Handoff Notes

When handing work to another agent, include:

- What changed
- Which routes/components were affected
- Whether auth, rewrites, or shared providers were involved
- Which checks were run
- Any unresolved risk, especially around env vars, token refresh, or disabled build enforcement
