import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { Generator, getConfig } from "@tanstack/router-generator";

const app = process.argv[2];
if (!["admin", "landing", "client"].includes(app)) throw new Error("Expected an app name: admin, landing, or client");
const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../apps", app);
const config = getConfig({}, appRoot);
await new Generator({ config, root: appRoot }).run();
