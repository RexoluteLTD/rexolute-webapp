import { test } from "node:test";
import assert from "node:assert/strict";
import { affectedApps, changedApps, loadWorkspaces, appNames } from "./affected-apps.mjs";
import { readFileSync } from "node:fs";

const workspaces = loadWorkspaces();
test("app edits and public assets select only their owning app", () => {
  for (const app of appNames) {
    assert.deepEqual(affectedApps([`apps/${app}/src/pages/index.tsx`, `apps/${app}/public/logo.svg`], workspaces), [app]);
  }
});
test("shared auth and API changes select only their transitive consumers", () => {
  assert.deepEqual(affectedApps(["packages/api/src/session.ts"], workspaces), ["admin", "client"]);
  assert.deepEqual(affectedApps(["packages/auth/src/guard.tsx"], workspaces), ["admin", "client"]);
});
test("UI and root build/deployment configuration select all apps", () => {
  for (const file of ["packages/ui/src/button.tsx", "yarn.lock", "vite.shared.ts", "turbo.json", "deploy/compose.yml", ".github/workflows/deploy.yml", "packages/deleted/package.json"]) {
    assert.deepEqual(affectedApps([file], workspaces), appNames);
  }
});
test("documentation and generated-only changes do not build apps", () => {
  assert.deepEqual(affectedApps(["README.md", "AGENTS.md", "apps/admin/src/routeTree.gen.ts"], workspaces), []);
});
test("a missing baseline initializes all apps", () => assert.deepEqual(changedApps(""), appNames));
test("PR CI publishes and deployments reuse content-addressed app images", () => {
  const pullRequest = readFileSync(".github/workflows/pull-request.yml", "utf8");
  const deploy = readFileSync(".github/workflows/deploy.yml", "utf8");
  assert.match(pullRequest, /Build and publish reusable app image/);
  assert.match(pullRequest, /run: bash deploy\/frontend-config\.sh/);
  assert.match(deploy, /run: bash deploy\/frontend-config\.sh/);
  assert.match(deploy, /Resolve reusable release image/);
  assert.match(deploy, /id: resolve\n\s+if: inputs\.force_all != true/);
  assert.match(deploy, /steps\.resolve\.outputs\.reference == ''/);
});
