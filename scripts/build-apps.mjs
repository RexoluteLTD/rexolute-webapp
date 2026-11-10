import { spawnSync } from "node:child_process";
import { appNames } from "./affected-apps.mjs";

const apps = JSON.parse(process.argv[2]);
if (!Array.isArray(apps) || apps.some((app) => !appNames.includes(app))) throw new Error("Invalid app selection");
if (apps.length) {
  const result = spawnSync("yarn", ["turbo", "run", "build", ...apps.map((app) => `--filter=@rexolute/${app}`)], { stdio: "inherit" });
  if (result.error) throw result.error;
  process.exitCode = result.status ?? 1;
} else console.log("No affected apps to build.");
