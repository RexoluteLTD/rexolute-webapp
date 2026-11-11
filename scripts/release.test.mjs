import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, copyFileSync, readFileSync, existsSync, rmSync, statSync } from "node:fs";
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
if [[ "$1" == login ]]; then cat > /dev/null; if [[ "\${MOCK_LOGIN_FAIL:-}" == true ]]; then exit 1; fi; fi
if [[ "$*" == *candidate.env* && "$*" == *' up '* && "\${MOCK_FAIL:-}" == true ]]; then exit 1; fi
`, { mode: 0o755 });
  function run(fail = false, overrides = {}, script, cwd) {
    return spawnSync("bash", script ? ["-c", script] : [join(release, "deploy/release.sh")], { encoding: "utf8", cwd, env: {
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
    assert.match(result.stderr, /Release must be inside the frontend-admin-dev deployment directory/);
    assert.equal(existsSync(join(f.root, "docker.log")), false);
    assert.equal(existsSync(join(f.state, "candidate.env")), false);
    assert.equal(existsSync(join(f.state, ".env")), false);
  } finally { f.cleanup(); }
});

for (const [variable, value, message] of [
  ["TARGET", "staging", /TARGET must be production or development/],
  ["APP", "other", /APP must be landing, admin, or client/],
  ["RELEASE_ID", "invalid", /RELEASE_ID must have the form/],
  ["BASE_DOMAIN", "example.co\n", /BASE_DOMAIN must be a bare lowercase domain/],
  ["TRAEFIK_NETWORK", "localhost\r", /TRAEFIK_NETWORK contains unsupported characters/],
]) {
  test(`invalid ${variable} reports its cause before Docker runs`, () => {
    const f = fixture(deployments[3]);
    try {
      const result = f.run(false, { [variable]: value });
      assert.equal(result.status, 1);
      assert.match(result.stderr, message);
      assert.equal(existsSync(join(f.root, "docker.log")), false);
      assert.equal(existsSync(join(f.state, "candidate.env")), false);
    } finally { f.cleanup(); }
  });
}

test("an invalid image artifact identifies the failure before Docker runs", () => {
  const f = fixture(deployments[3]);
  try {
    writeFileSync(join(f.state, "releases/1-1/images/landing.txt"), "ghcr.io/example/landing:latest\n");
    const result = f.run();
    assert.equal(result.status, 1);
    assert.match(result.stderr, /images\/landing.txt must contain a GHCR image with a sha256 digest/);
    assert.equal(existsSync(join(f.root, "docker.log")), false);
  } finally { f.cleanup(); }
});

test("a registry login failure reports its stage without exposing the token", () => {
  const f = fixture(deployments[3]);
  try {
    const token = "private-registry-token-for-test";
    const result = f.run(false, { MOCK_LOGIN_FAIL: "true", REGISTRY_PASSWORD: token });
    assert.equal(result.status, 1);
    assert.match(result.stderr, /Release failed while authenticating to GHCR \(line \d+, exit 1\)/);
    assert.equal((result.stdout + result.stderr).includes(token), false);
    assert.equal(existsSync(join(f.state, "candidate.env")), false);
  } finally { f.cleanup(); }
});

function workflowScript(name) {
  const workflow = readFileSync(".github/workflows/deploy.yml", "utf8");
  const step = workflow.split(`      - name: ${name}\n`)[1].split("      - name:")[0];
  return step.split("        run: ")[1].replace(/^\|\n/, "")
    .split("\n").map((line) => line.replace(/^ {10}/, "")).join("\n");
}

for (const deployment of deployments.filter(({ app }) => app === "landing")) {
  test(`native SSH uploads only the selected app and deploys ${deployment.target}`, () => {
    const f = fixture(deployment);
    try {
      const workspace = join(f.root, "workspace");
      const runnerTemp = join(f.root, "runner-temp");
      mkdirSync(join(workspace, "deploy"), { recursive: true });
      mkdirSync(join(workspace, "images"));
      mkdirSync(runnerTemp);
      for (const file of ["compose.yml", "release.sh"]) {
        copyFileSync(`deploy/${file}`, join(workspace, "deploy", file));
      }
      copyFileSync(join(f.state, "releases/1-1/images/landing.txt"), join(workspace, "images/landing.txt"));
      writeFileSync(join(workspace, "images/admin.txt"), "must not upload");
      writeFileSync(join(f.root, "bin/ssh"), `#!/usr/bin/env bash
set -euo pipefail
[[ "$*" == *StrictHostKeyChecking=yes* && "$*" == *BatchMode=yes* && "$*" == *'-p 2222'* ]]
# Execute the remote command locally, preserving streamed stdin.
command="\${!#}"
bash -c "$command"
`, { mode: 0o755 });
      writeFileSync(join(f.root, "bin/scp"), `#!/usr/bin/env bash
set -euo pipefail
[[ "$*" == *StrictHostKeyChecking=yes* && "$*" == *'-P 2222'* ]]
args=("$@")
source_file="\${args[\${#args[@]}-2]}"
destination="\${args[\${#args[@]}-1]}"
cp -- "$source_file" "\${destination#*:}"
`, { mode: 0o755 });
      const token = "private token'\"; $(touch TOKEN_LEAKED) `touch TOKEN_LEAKED`";
      const result = f.run(false, {
        TARGET: "/unused/binary/path",
        DEPLOY_ENVIRONMENT: deployment.target,
        APP_DIR: deployment.directory,
        RUNNER_TEMP: runnerTemp,
        VPS_HOST: "example.co", VPS_USER: "deploy", VPS_SSH_PORT: "2222",
        TRAEFIK_NETWORK: "localhost",
        REGISTRY_PASSWORD: token,
      }, workflowScript("Upload release and deploy").replaceAll("/var/apps/", `${f.root}/`), workspace);
      assert.equal(result.status, 0, result.stderr);
      const state = readFileSync(join(f.state, ".env"), "utf8");
      assert.ok(state.includes(`APP_DOMAIN=${deployment.domain}\n`));
      assert.equal((result.stdout + result.stderr + state).includes(token), false);
      assert.equal(existsSync(join(workspace, "TOKEN_LEAKED")), false);
      assert.equal(existsSync(join(f.state, "releases/1-1/TOKEN_LEAKED")), false);
      assert.equal(existsSync(join(f.state, "releases/1-1/images/admin.txt")), false);
      const cleanup = f.run(false, { RUNNER_TEMP: runnerTemp }, workflowScript("Remove runner SSH credentials"));
      assert.equal(cleanup.status, 0, cleanup.stderr);
      assert.equal(existsSync(join(runnerTemp, "release.tgz")), false);
    } finally { f.cleanup(); }
  });
}

test("SSH setup requires verified host keys and cleans up its private files", () => {
  const f = fixture(deployments[3]);
  try {
    const runnerTemp = join(f.root, "runner-temp");
    mkdirSync(runnerTemp);
    const env = {
      RUNNER_TEMP: runnerTemp, VPS_HOST: "example.co", VPS_USER: "deploy", VPS_SSH_PORT: "2222",
      VPS_SSH_KEY: "test-private-key", VPS_KNOWN_HOSTS: "",
    };
    const missing = f.run(false, env, workflowScript("Configure authenticated SSH"));
    assert.notEqual(missing.status, 0);
    assert.match(missing.stderr, /Configure independently verified VPS_KNOWN_HOSTS/);
    const result = f.run(false, { ...env, VPS_KNOWN_HOSTS: "[example.co]:2222 ssh-ed25519 test-key" }, workflowScript("Configure authenticated SSH"));
    assert.equal(result.status, 0, result.stderr);
    const key = join(runnerTemp, "rexolute-ssh/deploy_key");
    assert.equal(statSync(key).mode & 0o777, 0o600);
    assert.equal(readFileSync(key, "utf8"), "test-private-key\n");
    for (const port of ["0", "65536", "-22", "22;exit"]) {
      assert.notEqual(f.run(false, { ...env, VPS_KNOWN_HOSTS: "test-key", VPS_SSH_PORT: port }, workflowScript("Configure authenticated SSH")).status, 0);
    }
    const cleanup = f.run(false, env, workflowScript("Remove runner SSH credentials"));
    assert.equal(cleanup.status, 0, cleanup.stderr);
    assert.equal(existsSync(key), false);
  } finally { f.cleanup(); }
});
