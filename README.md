# Rexolute frontend

Turborepo + Yarn Classic monorepo with three independently built React 19 / Vite apps using TanStack Router.

| Workspace | Purpose | Development URL | Build output |
| --- | --- | --- | --- |
| `@rexolute/landing` | Public marketing pages | http://localhost:5173 | `apps/landing/dist` |
| `@rexolute/admin` | Existing admin dashboard | http://localhost:5174/ | `apps/admin/dist` |
| `@rexolute/client` | Client login and future dashboard shell | http://localhost:5175/ | `apps/client/dist` |
| `@rexolute/ui` | Reusable UI primitives, common components, styles | Source package | Bundled by consumers |
| `@rexolute/utils` | Class merging, dates, file helpers, app URLs | Source package | Bundled by consumers |
| `@rexolute/api` | HTTP clients, errors, token-session service | Source package | Bundled by consumers |
| `@rexolute/auth` | React auth context/provider and route guards | Source package | Bundled by consumers |
| `@rexolute/assets` | Brand image and SVG URL exports | Source package | Bundled by consumers |
| `@rexolute/types` | Shared UI and backend data contracts | TypeScript package | Erased during compilation |

## Development

Use Node 22.12+ (22.x) and Yarn 1.22.22.

```sh
cp apps/landing/.env.example apps/landing/.env.local
cp apps/admin/.env.example apps/admin/.env.local
cp apps/client/.env.example apps/client/.env.local
# Configure the values in each app; admin/client need their backend origin.
yarn install
yarn dev
```

Run one app with `yarn dev:landing`, `yarn dev:admin`, or `yarn dev:client`. Each dev server has a fixed port and fails if that port is occupied. Changes to the source packages under `packages/*/src` are picked up by Vite.

```sh
yarn lint
yarn typecheck
yarn test
yarn build
```

`yarn build` uses Turborepo to generate routes, typecheck each app (including its imported shared packages), and build the three apps in parallel. `yarn build:admin` (or `build:landing` / `build:client`) generates, typechecks, and builds only that app. Run `yarn typecheck` for the additional repository-wide configuration and package check. Direct workspace build commands run Vite alone. `yarn preview:landing`, `yarn preview:admin`, and `yarn preview:client` serve previously built apps.

## Turborepo tasks and caching

[`turbo.json`](turbo.json) defines the task graph, following the [Turborepo task configuration](https://turborepo.com/docs/crafting-your-repository/configuring-tasks) model:

- `dev` and `preview` are persistent tasks with caching disabled. Turbo owns the three dev processes; the previous custom launcher has been removed.
- `routes:generate` tasks generate/cache each app's `src/routeTree.gen.ts`.
- App `build` tasks wait for their own route generation, app typecheck and dependency builds, and cache `dist/**`. They do not depend on the repository-wide typecheck task, so another app edit cannot invalidate their build through that task. The reusable packages export source without artificial build commands.
- `lint:check`, `typecheck:check`, and `test:check` are registered root tasks, retaining checks across all workspaces and the app render tests. Their log-only results are cached from their source/config inputs.
- Shared configuration and `VITE_*` / `NODE_ENV` process values participate in global cache keys. Each build also hashes its own `public/**`, `.env`, and `.env.*`, including ignored local overrides. App-specific file changes invalidate that app's build rather than every app. Shared source changes invalidate dependent builds.
- `.turbo/` stores the local task cache and is ignored by Git and Docker. CI restores it with GitHub Actions caching; remote Turbo caching is not configured.

Use `yarn turbo run build --dry=json` to inspect the build graph, or `yarn turbo run build --force` to execute without cache hits. Existing `yarn lint`, `yarn typecheck`, and `yarn test` commands run through Turbo; their `*:check` counterparts run the underlying tools directly when troubleshooting.

## Routing and app boundaries

Each app uses [TanStack file-based routing](https://tanstack.com/router/latest/docs/routing/file-based-routing) under `apps/<app>/src/routes/`. The Vite router plugin generates `src/routeTree.gen.ts`; `src/router.tsx` only creates the router from that tree. Existing view components remain under `src/pages/` and are loaded lazily by the route files.

```text
apps/admin/src/routes/
  __root.tsx                         # Root outlet and not-found screen
  login.tsx                          # Public /login
  verify-otp.tsx                     # Public /verify-otp
  _authenticated/
    route.tsx                        # Pathless admin auth guard and layout
    index.tsx                        # Protected /
    tasks.tsx                        # /tasks
    users/details/$id.tsx            # /users/details/:id
    settings/users/$id.tsx           # /settings/users/:id
```

Use `index.tsx` for a folder index, `route.tsx` for a folder layout/guard, and `$id.tsx` for a dynamic parameter. The `_authenticated` segment is absent from URLs. Keep login/OTP routes outside that guarded folder.

Add a file exporting `Route = createFileRoute(...)({...})` to add a route; do not manually register it in `router.tsx`. The generator updates the route IDs and generated tree. Run `yarn routes:generate` explicitly when needed; Vite regenerates automatically during dev/build. Turbo also generates route trees before typechecking/tests, so fresh CI checkouts work before starting Vite.

Keep generated trees in version control for editor support; ESLint excludes them. Do not edit them by hand. Turbo caches them as generation outputs rather than treating them as independent source inputs. Each app is typechecked in its own TypeScript project because its generated file-route declarations must remain separate from the other apps. Rendering tests also stay within their app projects.

The Next.js Pages Router, middleware, rewrites, server props, and NextAuth API route have been removed.

- Landing: `/`, `/about-us`, `/contact-us`, `/terms-condition`; `/home` redirects to `/`.
- Admin: protected `/`, `/users`, `/tasks`, `/therapists`, `/sessions`, `/settings`, and related nested routes. `/login`, `/verify-otp`, `/forgot-password`, `/create-password`, and `/create-pin` are public siblings of the protected layout.
- Client: public `/login` and protected `/`. The client dashboard remains a placeholder for future product work.
- Both dashboards render at their own origin's `/`. The former role-prefixed routes and auth aliases have been removed.
- Unknown routes render a not-found screen; they are not rewritten into marketing pages.

Use TanStack `Link`/navigation for routes inside an app, and normal anchors with `appUrls` for links between apps. Configure `VITE_LANDING_URL`, `VITE_ADMIN_URL`, and `VITE_CLIENT_URL` to their deployed origins. Each app is served at `/` on its own origin; role names are not URL prefixes.

## Shared code

Import each concern from its owning package, for example `@rexolute/ui/button`, `@rexolute/utils/cn`, `@rexolute/api`, `@rexolute/api/session`, `@rexolute/auth/provider`, or `@rexolute/types`. There is no catch-all shared workspace or compatibility alias. Each package declares only its own dependencies and exports explicit TypeScript source entry points.

`api` owns Axios transport, errors, JWT parsing, token persistence and refresh. It depends on `types`, not React or UI. `auth` depends on `api` and supplies React context/provider and TanStack guards. `ui` depends on `utils` and `types`; it never imports app code, API clients, or authentication. Assets export brand URLs independently.

Hooks live with their app consumers. Admin owns `use-mobile`, `use-toast`, `use-axios-interceptor`, and `use-layout`; admin and client each own a local `use-auth` that consumes the common auth context. Landing currently needs no app hooks. UI component context helpers such as `useFormField` remain alongside their reusable components. The unused error-handler hook and its unused placeholder wrapper were removed; the existing real React error boundary remains in UI.

Admin also owns its sidebar/toaster integration, document viewers and their hook logic, verification state provider, and domain constants. Shared UI keeps the underlying toast/dialog/button primitives. Document dependencies belong to admin, so landing and client do not depend on them.

Tailwind and PostCSS configuration live in `packages/ui/tailwind.config.ts` and `packages/ui/postcss.config.mjs`, exported as `@rexolute/ui/tailwind.config` and `@rexolute/ui/postcss.config`. Vite loads PostCSS from the UI workspace; the Tailwind globs resolve from that configuration directory and scan all app and package sources. Turbo tracks both config files as global build inputs, and styling-tool dependencies belong to the UI workspace. Import global styles through `@rexolute/ui/styles.css`. Existing Onest fonts are served locally; Inter, Poppins and Roboto currently fall back to Arial because their files were not present in the original public assets. Each app owns `apps/<app>/public/`, served at `/` and copied into that app's build. The previous asset set was copied intact into all three apps to preserve existing image/font/document URLs; subsequent edits to one app's public files are independent. There is no root `public/` directory.

The existing document libraries still emit React peer-version warnings during installation; a dependency upgrade remains separate work. The admin Vite PDF worker plugin serves the matching installed worker during development and emits it into the admin build without mutating shared source files. Browser document components use React lazy/Suspense.

## Backend and authentication

Vite loads environment files from the app directory (`apps/landing`, `apps/admin`, or `apps/client`), not the repository root. Each app has its own `.env`, `.env.local`, and `.env.example`; mode-specific files such as `.env.production` also belong beside that app's package.json. Local overrides retain normal Vite precedence. Configure each app independently. The previous root files were copied without changing their values before being removed; legacy non-Vite variables remain private and unused by application code.

Only `.env.example` templates are versioned. Actual environment files are ignored by Git and excluded from Docker at every directory depth. App files always stay outside `public/`. Docker builds continue to receive public build-time values through build arguments; they do not copy your local environment files.

`VITE_API_BASE_URL` is the public backend origin, optionally ending in `/api`. The transport appends `/api` only when needed. An empty value uses same-origin `/api`; local development therefore requires a backend origin unless you configure a reverse proxy yourself. All `VITE_*` values are public build-time values, never secrets. Old `NEXT_PUBLIC_*`, `NEXTAUTH_*`, and `APP_*` values are no longer used by application code.

The shared auth client uses the existing backend contract:

1. `POST /api/auth/signin` with `{ email, password }`.
2. `POST /api/auth/verify-otp?mode=token` with `{ provider, payload: { identity, code } }`.
3. Read `data.access_token` and `data.refresh_token`; use access-token claims for frontend navigation.
4. Refresh through `POST /api/auth/refresh-token` with a bearer refresh token. Concurrent requests share one refresh operation.
5. Add the access token to authenticated API calls. A 401 clears the local session and protected routes return to the relevant app login.

Sessions use memory and tab-scoped `sessionStorage`, replacing the former NextAuth HTTP-only cookie. This is a deliberate architectural difference: browser scripts can access these tokens. A backend-managed HTTP-only cookie/BFF flow requires backend work and should replace browser token storage if that is the production security requirement. Never rely on decoded browser claims or route guards for authorization; every backend endpoint must validate the token and enforce role/permissions. Configure backend CORS for each deployed app origin and allow the Authorization header.

Login return paths accept local root-relative URLs only and reject external or protocol-relative destinations. No browser API exists to overwrite session roles or permissions. Logout clears the current tab's tokens; backend revocation and cross-tab/session-wide logout are not implemented. Admin and client logins require matching backend roles. Client login assumes the same credential/OTP contract as admin; verify that contract against your backend before enabling it for users.

## Feature status carried over from the original app

This migration preserves existing screen implementations, not completion of unfinished product features. Most admin statistics/tables, session management actions, access management, marketing contact submission, password recovery, OTP resend, and PIN/password setup still contain placeholder behavior. Therapist approval now calls its parent handler; the existing verification context handoff still does not survive reload/deep-linking. Client dashboard functionality remains planned.

## Static deployment

Deploy each app's `dist` directory to a separate origin. Configure a history fallback to `index.html` so direct links work; keep missing static assets and `/api` requests out of that fallback. Landing pages are client-rendered SPAs; prerendering/SSR for marketing SEO is a separate follow-up.

A static Nginx container template is provided in `deploy/`:

```sh
docker build -f deploy/Dockerfile \
  --build-arg APP=admin \
  --build-arg VITE_API_BASE_URL=https://api.example.com \
  --build-arg VITE_LANDING_URL=https://example.com \
  --build-arg VITE_ADMIN_URL=https://admin.example.com \
  --build-arg VITE_CLIENT_URL=https://client.example.com \
  -t rexolute-admin .
docker run --rm -p 8080:80 rexolute-admin
```

Use `APP=landing` or `APP=client` for the other apps. Environment values must be supplied at build time. `.dockerignore` excludes local env files, dependencies, and old build output.

The obsolete root Next.js Dockerfile and Compose draft have been removed. `deploy/Dockerfile`, `deploy/compose.yml`, and `.github/workflows/deploy.yml` are the supported deployment path.

### Branch deployments

`main` deploys to the GitHub **production** environment; `dev` deploys to **development**. For `BASE_DOMAIN=example.co`:

| App | Production (`main`) | Development (`dev`) |
| --- | --- | --- |
| Landing | `example.co` | `dev.example.co` |
| Admin | `admin.example.co` | `admin.dev.example.co` |
| Client | `client.example.co` | `client.dev.example.co` |

Create both GitHub environments and configure the following in each:

- Variables: `BASE_DOMAIN` (bare domain, without `https://`; use the same base in both environments), `VITE_API_BASE_URL` (the environment's HTTPS backend URL).
- Optional variables: `TRAEFIK_NETWORK` (defaults to `localhost`), `GHCR_USER` (defaults to the repository owner).
- Secrets: `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY`, and `CR_PAT` (a registry token with permission to pull the repository's GHCR packages).

The workflow publishes with `GITHUB_TOKEN`. The deployment user needs Bash, Docker, and Docker Compose v2 with `up --wait` support, permission to use Docker, and write access to `/var/apps/rexolute`. Provision the external Traefik network and a running Traefik instance with the `websecure` entrypoint and TLS certificates for every hostname above. Point DNS at the corresponding VPS; production and development can use the same VPS or different environment-specific hosts. The generated rules cover the listed hostnames; `www` aliases require additional routing/DNS configuration. Configure backend CORS to allow the matching frontend origins. No local app `.env` files or backend secrets are uploaded.

Deployments follow these steps:

1. Compare the current commit against the **last successful deployment on the same branch**. The first release, unavailable/non-ancestor history, and manual `force_all` runs select every app. Using the last successful release includes changes from failed deployments.
2. Select changed apps plus consumers of changed workspace packages, following transitive dependencies. App source/public changes select that app; API/auth select admin/client; shared UI and root tooling/deployment changes select all consumers. Documentation-only changes do not build images. Renames/deletions are included.
3. Run reusable CI checks (lint, repository typecheck, application tests and deployment-script tests). Publish only selected apps as separate GHCR images, supplying all four public Vite build values. Docker builds typecheck/build only their selected app. Docker layer caches are scoped by environment and app.
4. Deploy the exact published image **digest**, rather than a mutable `latest` tag. A branch-level concurrency queue serializes releases without interrupting SSH deployments; a branch-head check rejects superseded commits before uploading. GitHub's latest pending run includes accumulated changes since the last successful release.
5. Start only selected apps with independent Compose projects and Traefik router names (`rexolute-production-admin`, etc.). Nginx serves port 80. Compose waits for the image's HTTP health check. A failed update attempts to restore that app's previous healthy manifest/digest and fails the workflow; first-time failures have no previous release to restore. Earlier healthy apps in the same release remain updated and the next run retries changes since the last fully successful release.

On the VPS, healthy state is stored at `/var/apps/rexolute/<environment>/<app>/{.env,compose.yml}`; uploaded release inputs are under `releases/<run-id>-<attempt>`. Registry credentials use a temporary Docker configuration removed on exit. Release directories are retained for inspection and can be cleaned up according to your retention policy.

To rebuild after changing GitHub environment variables (which do not create Git changes), manually run **Deploy frontend** on `main` or `dev` with `force_all=true`. Other branches cannot deploy. Pull requests and non-deployment branches run the same checks and build only apps affected by that Git diff. No unaffected app image is built or restarted, except when shared dependencies/configuration genuinely affect it.

This remains an SSH/Compose delivery workflow; it does not introduce an Argo/Flux reconciliation controller. Migrating existing Next.js containers or Traefik routers requires removing their old routing definitions during the initial cutover to avoid conflicts with the new projects.
