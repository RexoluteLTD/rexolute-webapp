import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, appendFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

export const appNames = ["landing", "admin", "client"];

export function affectedApps(files, workspaces) {
  const byName = new Map(workspaces.map((workspace) => [workspace.name, workspace]));
  const changed = new Set();
  for (const file of files) {
    if (/^apps\/[^/]+\/src\/routeTree\.gen\.ts$/.test(file)) continue;
    const workspace = workspaces.find(({ directory }) => file.startsWith(`${directory}/`));
    if (workspace) changed.add(workspace.name);
    else if (/^(apps\/|packages\/|deploy\/|scripts\/|\.github\/|\.dockerignore$|Dockerfile$|docker-compose\.yml$|package\.json$|yarn\.lock$|turbo\.json$|tsconfig[^/]*$|vite[^/]*$|eslint\.config\.mjs$|\.nvmrc$)/.test(file)) {
      return [...appNames];
    }
  }
  function dependsOnChange(name, seen = new Set()) {
    if (changed.has(name)) return true;
    if (seen.has(name)) return false;
    seen.add(name);
    return (byName.get(name)?.dependencies ?? []).some((dependency) => dependsOnChange(dependency, seen));
  }
  return appNames.filter((app) => dependsOnChange(`@rexolute/${app}`));
}

export function loadWorkspaces() {
  return ["apps", "packages"].flatMap((parent) => readdirSync(parent, { withFileTypes: true })
    .filter((entry) => entry.isDirectory()).map(({ name }) => {
      const directory = `${parent}/${name}`;
      const manifest = JSON.parse(readFileSync(`${directory}/package.json`, "utf8"));
      return { directory, name: manifest.name, dependencies: Object.keys({ ...manifest.dependencies, ...manifest.devDependencies, ...manifest.peerDependencies }) };
    }));
}

export function changedApps(base, head = "HEAD") {
  if (!base || /^0+$/.test(base)) return [...appNames];
  let files;
  try {
    // Include both sides of renames, and handle force-pushed/deleted history conservatively.
    execFileSync("git", ["merge-base", "--is-ancestor", base, head], { stdio: "pipe" });
    files = execFileSync("git", ["diff", "--name-only", "--no-renames", "-z", base, head], { encoding: "utf8" }).split("\0").filter(Boolean);
  } catch {
    console.warn("No usable deployment baseline; selecting all apps.");
    return [...appNames];
  }
  return affectedApps(files, loadWorkspaces());
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const apps = changedApps(process.argv[2], process.argv[3]);
  console.log(JSON.stringify(apps));
  if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `apps=${JSON.stringify(apps)}\nchanged=${apps.length > 0}\n`);
}
