import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, copyFileSync, readFileSync, existsSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

function fixture(target = "production") {
  const root = mkdtempSync(join(tmpdir(), "rexolute-release-"));
  const release = join(root, `${target}/releases/1-1`);
  mkdirSync(join(release, "deploy"), { recursive: true });
  mkdirSync(join(release, "images"));
  mkdirSync(join(root, "bin"));
  copyFileSync("deploy/release.sh", join(release, "deploy/release.sh"));
  copyFileSync("deploy/compose.yml", join(release, "deploy/compose.yml"));
  writeFileSync(join(release, "images/admin.txt"), `ghcr.io/example/rexolute/admin@sha256:${"a".repeat(64)}\n`);
  writeFileSync(join(root, "bin/docker"), `#!/usr/bin/env bash
printf '%s\\n' "$*" >> "$MOCK_LOG"
if [[ "$1" == login ]]; then cat > /dev/null; fi
if [[ "$*" == *candidate.env* && "$*" == *' up '* && "\${MOCK_FAIL:-}" == true ]]; then exit 1; fi
`, { mode: 0o755 });
  function run(fail = false) {
    return spawnSync("bash", [join(release, "deploy/release.sh")], { encoding: "utf8", env: {
      ...process.env, PATH: `${join(root, "bin")}:${process.env.PATH}`, TARGET: target,
      RELEASE_ID: "1-1", BASE_DOMAIN: "example.co", REGISTRY_USER: "example", REGISTRY_PASSWORD: "dummy",
      MOCK_LOG: join(root, "docker.log"), MOCK_FAIL: String(fail),
    } });
  }
  return { root, run, cleanup: () => rmSync(root, { recursive: true, force: true }) };
}

test("deployment updates only selected app, saves digest and production hostname", () => {
  const f = fixture();
  try {
    const result = f.run();
    assert.equal(result.status, 0, result.stderr);
    const state = readFileSync(join(f.root, "production/admin/.env"), "utf8");
    assert.match(state, /APP_DOMAIN=admin.example.co/);
    assert.match(state, /APP_IMAGE=ghcr.io\/example\/rexolute\/admin@sha256:/);
    assert.equal(existsSync(join(f.root, "production/landing")), false);
    assert.equal(existsSync(join(f.root, "production/client")), false);
    assert.match(readFileSync(join(f.root, "docker.log"), "utf8"), /--no-deps --wait --wait-timeout 120 app/);
  } finally { f.cleanup(); }
});
test("development uses its own hostnames and stack identifiers", () => {
  const f = fixture("development");
  try {
    const result = f.run();
    assert.equal(result.status, 0, result.stderr);
    const state = readFileSync(join(f.root, "development/admin/.env"), "utf8");
    assert.match(state, /APP_DOMAIN=admin.dev.example.co/);
    assert.equal(existsSync(join(f.root, "production")), false);
    assert.match(state, /STACK_ID=rexolute-development-admin/);
  } finally { f.cleanup(); }
});
test("failed health check restores prior manifest and retains previous digest", () => {
  const f = fixture();
  try {
    const state = join(f.root, "production/admin");
    mkdirSync(state);
    writeFileSync(join(state, ".env"), "APP_IMAGE=previous\n");
    writeFileSync(join(state, "compose.yml"), "previous manifest\n");
    const result = f.run(true);
    assert.equal(result.status, 1);
    assert.equal(readFileSync(join(state, ".env"), "utf8"), "APP_IMAGE=previous\n");
    assert.equal(readFileSync(join(state, "compose.yml"), "utf8"), "previous manifest\n");
    assert.match(readFileSync(join(f.root, "docker.log"), "utf8"), /--env-file .*admin\/\.env -f .*admin\/compose.yml up/);
  } finally { f.cleanup(); }
});
