import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, copyFileSync, readFileSync, existsSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const deployments = [
  { target: "production", app: "landing", directory: "frontend-landing", domain: "example.co" },
  { target: "production", app: "admin", directory: "frontend-admin", domain: "admin.example.co" },
  { target: "production", app: "client", directory: "frontend-client", domain: "client.example.co" },
  { target: "development", app: "landing", directory: "frontend-landing-dev", domain: "landing-dev.example.co" },
  { target: "development", app: "admin", directory: "frontend-admin-dev", domain: "admin-dev.example.co" },
  { target: "development", app: "client", directory: "frontend-client-dev", domain: "client-dev.example.co" },
];

function fixture(deployment) {
  const { target, app, directory } = deployment;
  const root = mkdtempSync(join(tmpdir(), "rexolute-release-"));
  const state = join(root, directory);
  const release = join(state, "releases/1-1");
  mkdirSync(join(release, "deploy"), { recursive: true });
  mkdirSync(join(release, "images"));
  mkdirSync(join(root, "bin"));
  copyFileSync("deploy/release.sh", join(release, "deploy/release.sh"));
  copyFileSync("deploy/compose.yml", join(release, "deploy/compose.yml"));
  writeFileSync(join(release, `images/${app}.txt`), `ghcr.io/example/rexolute/${app}@sha256:${"a".repeat(64)}\n`);
  // Existing state belonging to every other app/environment must remain intact.
  for (const other of deployments.filter((entry) => entry.directory !== directory)) {
    mkdirSync(join(root, other.directory));
    writeFileSync(join(root, other.directory, ".env"), "unchanged\n");
  }
  writeFileSync(join(root, "bin/docker"), `#!/usr/bin/env bash
printf '%s\\n' "$*" >> "$MOCK_LOG"
if [[ "$1" == login ]]; then cat > /dev/null; fi
if [[ "$*" == *candidate.env* && "$*" == *' up '* && "\${MOCK_FAIL:-}" == true ]]; then exit 1; fi
`, { mode: 0o755 });
  function run(fail = false, overrides = {}) {
    return spawnSync("bash", [join(release, "deploy/release.sh")], { encoding: "utf8", env: {
      ...process.env, PATH: `${join(root, "bin")}:${process.env.PATH}`, TARGET: target, APP: app,
      RELEASE_ID: "1-1", BASE_DOMAIN: "example.co", REGISTRY_USER: "example", REGISTRY_PASSWORD: "dummy",
      MOCK_LOG: join(root, "docker.log"), MOCK_FAIL: String(fail), ...overrides,
    } });
  }
  return { root, state, run, cleanup: () => rmSync(root, { recursive: true, force: true }) };
}

for (const deployment of deployments) {
  test(`${deployment.target} ${deployment.app} deploys in ${deployment.directory} without changing other apps`, () => {
    const f = fixture(deployment);
    try {
      const result = f.run();
      assert.equal(result.status, 0, result.stderr);
      const state = readFileSync(join(f.state, ".env"), "utf8");
      assert.ok(state.includes(`APP_DOMAIN=${deployment.domain}\n`));
      assert.ok(state.includes(`APP_IMAGE=ghcr.io/example/rexolute/${deployment.app}@sha256:`));
      assert.ok(state.includes(`STACK_ID=rexolute-${deployment.target}-${deployment.app}\n`));
      assert.equal(existsSync(join(f.state, "compose.yml")), true);
      for (const other of deployments.filter((entry) => entry.directory !== deployment.directory)) {
        assert.equal(readFileSync(join(f.root, other.directory, ".env"), "utf8"), "unchanged\n");
      }
      assert.match(readFileSync(join(f.root, "docker.log"), "utf8"), /--no-deps --wait --wait-timeout 120 app/);
    } finally { f.cleanup(); }
  });
}

for (const deployment of deployments.filter(({ app }) => app === "admin")) {
  test(`${deployment.target} health-check failure restores the previous app release`, () => {
    const f = fixture(deployment);
    try {
      writeFileSync(join(f.state, ".env"), "APP_IMAGE=previous\n");
      writeFileSync(join(f.state, "compose.yml"), "previous manifest\n");
      const result = f.run(true);
      assert.equal(result.status, 1);
      assert.equal(readFileSync(join(f.state, ".env"), "utf8"), "APP_IMAGE=previous\n");
      assert.equal(readFileSync(join(f.state, "compose.yml"), "utf8"), "previous manifest\n");
      assert.ok(readFileSync(join(f.root, "docker.log"), "utf8").includes(`--env-file ${f.state}/.env -f ${f.state}/compose.yml up`));
    } finally { f.cleanup(); }
  });
  test(`${deployment.target} adopts legacy healthy state and can roll back after relocation`, () => {
    const f = fixture(deployment);
    try {
      const legacy = join(f.root, "rexolute", deployment.target, deployment.app);
      mkdirSync(legacy, { recursive: true });
      writeFileSync(join(legacy, ".env"), "APP_IMAGE=legacy\n");
      writeFileSync(join(legacy, "compose.yml"), "legacy manifest\n");
      const result = f.run(true);
      assert.equal(result.status, 1);
      assert.equal(readFileSync(join(f.state, ".env"), "utf8"), "APP_IMAGE=legacy\n");
      assert.equal(readFileSync(join(f.state, "compose.yml"), "utf8"), "legacy manifest\n");
      assert.equal(readFileSync(join(legacy, ".env"), "utf8"), "APP_IMAGE=legacy\n");
      assert.ok(readFileSync(join(f.root, "docker.log"), "utf8").includes(`--env-file ${f.state}/.env -f ${f.state}/compose.yml up`));
    } finally { f.cleanup(); }
  });
}

test("an environment/path mismatch fails before Docker or state changes", () => {
  const f = fixture(deployments[1]);
  try {
    const result = f.run(false, { TARGET: "development" });
    assert.equal(result.status, 1);
    assert.equal(existsSync(join(f.root, "docker.log")), false);
    assert.equal(existsSync(join(f.state, "candidate.env")), false);
    assert.equal(existsSync(join(f.state, ".env")), false);
  } finally { f.cleanup(); }
});
