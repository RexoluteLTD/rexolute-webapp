# AGENTS.md

## Architecture

Rexolute is a Turborepo + Yarn Classic workspace monorepo using React 19, Vite, TypeScript (strict), Tailwind and TanStack Router. The former Next.js architecture was explicitly replaced. Do not reintroduce Next.js routes, server props, middleware, NextAuth, or next/image.

- `apps/landing/src`: public marketing pages and layout, app-scoped responsive CSS, SEO metadata, and static prerender entry.
- `apps/admin/src`: admin routes, forms, dashboard and verification.
- `apps/client/src`: client login and dashboard foundation.
- `packages/ui/src`: reusable UI primitives, common components and global styles.
- `packages/ui/tailwind.config.ts` and `packages/ui/postcss.config.mjs`: shared styling configuration, exported by the UI package.
- `packages/utils/src`: class merging, date/file helpers and app URLs.
- `packages/api/src`: Axios clients, errors, token session service.
- `packages/auth/src`: React auth context/provider and TanStack route guards.
- `packages/assets/src`: brand image/SVG URL exports.
- `packages/types/src`: shared UI and backend contracts.
- `apps/admin/src/hooks` and `apps/client/src/hooks`: app-owned hooks.
- `apps/*/public`: app-owned static assets, served at `/` and copied into that app's build.
- `apps/*/.env*`: app-owned configuration; only `.env.example` templates are versioned.
- `deploy`: Vite/static Nginx deployment templates.

## Conventions

Keep feature code inside its owning app. Import common code from its owning package (`@rexolute/ui/button`, `@rexolute/utils/cn`, `@rexolute/api`, `@rexolute/auth/provider`, `@rexolute/types`, etc.). Do not recreate a catch-all shared package. Reuse shared UI primitives and `cn()`; avoid adding another component library. Keep the established gray/green admin styling. Forms generally use react-hook-form with Zod and the existing error parser. Extend shared types rather than adding new untyped contracts. Avoid unrelated refactors.

Routes are file-based under each app's `src/routes/`. `__root.tsx` owns the root layout; `route.tsx` owns a folder layout/guard; `index.tsx` is a folder index; `$id.tsx` is a dynamic segment. `_authenticated/route.tsx` is pathless and protects its descendants; public login/OTP routes remain outside it. `src/router.tsx` only imports `src/routeTree.gen.ts` and creates the router. Add route files rather than manual createRoute/addChildren declarations.

Do not edit generated route trees. Keep them under version control; the Vite plugin or `yarn routes:generate` regenerates them. Turbo generation tasks run before typechecking/tests and cache the trees as outputs. Generated files must remain excluded from lint and ordinary Turbo source inputs. App TypeScript projects and render tests stay isolated to avoid merging different apps' generated FileRoutesByPath declarations.

 Use TanStack Link/navigation for internal navigation and `appUrls` plus normal anchors for cross-app links. Admin and client dashboards each render at `/` on their own origin, with public `/login`. Admin features use root paths such as `/users`, `/tasks`, and `/settings`; OTP/recovery paths are `/verify-otp`, `/forgot-password`, `/create-password`, and `/create-pin`. Do not reintroduce role prefixes or legacy role-specific auth aliases. Each app deploys to its own origin at the root. Static hosting needs an index.html fallback for deep links.

Shared code is a source workspace compiled by the apps. Root TypeScript configuration checks packages and root configuration files; the typecheck command then checks each app in a separate project. App-local aliases may be added only with matching TypeScript and Vite configuration; prefer relative imports within apps at present.

Vite loads PostCSS from `packages/ui`; resolve Tailwind content globs relative to that package. Keep root copies of these config files removed, update Turbo global inputs if moving them, and declare styling build tools in the UI workspace.

## Package ownership

Keep hooks in the app that consumes them. Admin owns mobile/toast/API-access/verification hooks and sidebar/toaster/document integration. Admin and client each own their `use-auth` adapter over the common auth context. Reusable UI component context helpers stay with their components.

Reusable packages must never import app source or depend on app workspaces. UI may depend on utils/types, but must not depend on API/auth. API is React-free and owns token-session logic; auth depends on API for its React provider/guards. Declare every direct package dependency in the owning manifest. Domain constants and transient admin state stay in admin.

## Authentication and API

Vite's envDir and publicDir resolve inside each app. Keep `.env`, `.env.local`, and mode-specific environment files in the app directory, outside public/. Do not restore root environment/public directories. Preserve local override precedence, never print environment values, and never put secrets in VITE_* variables. Actual env files must stay ignored by Git and Docker; Docker uses explicit public build arguments. App build tasks must hash their own public/** and ignored .env* files rather than treating them as global inputs.

API clients always use root-relative `/api/v1/` on the current app origin. Do not restore a separate browser backend origin or `VITE_API_BASE_URL`. The VPS Traefik backend router owns that prefix on each app hostname; frontend rules exclude `/api/`. For local Vite dev/preview, optional app-local `API_PROXY_TARGET` configures a server-only proxy preserving `/api/v1/`. `VITE_LANDING_URL`, `VITE_ADMIN_URL` and `VITE_CLIENT_URL` configure cross-app URLs. Only public values may use VITE_ prefixes.

`packages/api/src/transport.ts` supplies the unauthenticated client. `packages/api/src/axios.ts` supplies the authenticated singleton with interceptors installed once. `packages/api/src/session.ts` owns token parsing, tab-scoped persistence and refresh concurrency; `packages/auth/src/provider.tsx` exposes reactive state; `packages/auth/src/guard.tsx` protects browser navigation. Do not add competing interceptor or refresh implementations. API errors use `parseAxiosError`.

Backend endpoints must enforce authorization; browser claims and route guards are not a security boundary. Browser sessionStorage replaces NextAuth cookies. A backend cookie/BFF migration is not yet implemented. Do not log passwords, OTPs, access tokens, refresh tokens, or sessions.

Transient SharedLayoutProvider handoffs live in `apps/admin/src/providers/layout-provider.tsx` for admin verification. They cannot replace URL identifiers and backend refetching when reload/deep-link support is required.

## Commands and gates

Use Node 22.12+ (22.x) and Yarn 1.22.22, not npm or pnpm.

- `yarn install` (commit yarn.lock changes; CI uses --frozen-lockfile)
- `yarn dev` or `yarn dev:landing`, `yarn dev:admin`, `yarn dev:client`
- `yarn lint`
- `yarn routes:generate` (generate each app route tree)
- `yarn typecheck`
- `yarn test`
- `yarn build` (Turbo: generate/typecheck/build each app in parallel)
- `yarn build:landing`, `yarn build:admin`, `yarn build:client` (filtered Turbo builds)

Run appropriate checks before handoff and report gaps honestly. Do not suppress TypeScript/build failures. Test role guards, login failures, refresh behavior and deep links when changing auth/routing. The admin Vite plugin serves its matching installed PDF worker in dev and emits it into the admin build; never mutate shared source files from parallel build tasks.

`turbo.json` owns task scheduling and caching. Dev/preview tasks are persistent and uncached. Root `lint:check`, `typecheck:check`, and `test:check` tasks preserve repository-wide checks, including app render tests. Build caches declare dist outputs and account for shared source, public assets, root configuration, dotenv files and VITE_* environment values. Update task inputs/env/outputs when changing build dependencies; keep reusable packages source-only. Do not add app/shared workspace dependencies to the root manifest: Turbo includes root internal dependencies in global hashes, which invalidates unrelated apps. App typecheck tasks must depend on transitive workspace typecheck inputs so shared-source changes revalidate consumers.

## Known limits

Many existing admin screens and recovery/PIN flows still use sample data or placeholder actions. The client dashboard is a foundation for future work. See README.md for feature status and deployment instructions. Deployment uses .github/workflows/deploy.yml and deploy/ templates. main targets production; dev targets development. Only affected apps and consumers of changed packages are built/deployed; preserve independent app typecheck/build hashes. See README for GitHub environment setup, DNS, registry access, and initial cutover.

## Landing app

Landing builds prerender HTML through apps/landing/scripts/prerender.mjs and hydrates it in src/main.tsx. Register public paths and metadata in apps/landing/src/lib/seo.ts when adding routes. Keep static content available without JavaScript and unknown paths at HTTP 404 through deploy/nginx.landing.conf. VITE_SITE_INDEXABLE defaults false; only production CI opts in. Introductory legal pages remain noindex until reviewed. The contact form prepares an email to hello@example.co; do not claim backend delivery. Preserve the mobile menu, skip link, focus handling, explicit form labels, image dimensions, contrast and reduced-motion support. Scope marketing CSS to landing; do not alter dashboard styling.
