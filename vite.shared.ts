import { fileURLToPath } from "node:url";
import { basename, dirname, resolve } from "node:path";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import react from "@vitejs/plugin-react";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import { defineConfig, loadEnv, type Plugin } from "vite";

const root = dirname(fileURLToPath(import.meta.url));

function pdfWorkerPlugin(appRoot: string): Plugin {
  const appRequire = createRequire(resolve(appRoot, "package.json"));
  const pdfRequire = createRequire(appRequire.resolve("react-pdf"));
  const workerPath = pdfRequire.resolve("pdfjs-dist/build/pdf.worker.min.js");
  return {
    name: "rexolute-pdf-worker",
    configureServer(server) {
      server.middlewares.use("/pdf.worker.min.js", (_request, response) => {
        response.setHeader("Content-Type", "application/javascript");
        response.end(readFileSync(workerPath));
      });
    },
    generateBundle() {
      this.emitFile({ type: "asset", fileName: "pdf.worker.min.js", source: readFileSync(workerPath) });
    },
  };
}

export function createAppConfig(configUrl: string) {
  const appRoot = dirname(fileURLToPath(configUrl));
  return defineConfig(({ mode }) => {
    // Local-only proxy: the browser still calls its own origin at /api/v1/.
    const { API_PROXY_TARGET } = loadEnv(mode, appRoot, "API_PROXY_");
    const proxy = API_PROXY_TARGET ? { "/api/v1": { target: API_PROXY_TARGET, changeOrigin: true } } : undefined;
    return {
      root: appRoot,
      envDir: appRoot,
      publicDir: resolve(appRoot, "public"),
      plugins: [tanstackRouter({ target: "react", routesDirectory: resolve(appRoot, "src/routes"), generatedRouteTree: resolve(appRoot, "src/routeTree.gen.ts"), autoCodeSplitting: false }), react(), ...(basename(appRoot) === "admin" ? [pdfWorkerPlugin(appRoot)] : [])],
      css: { postcss: resolve(root, "packages/ui") },
      resolve: { dedupe: ["react", "react-dom", "@tanstack/react-router"] },
      build: { outDir: "dist", emptyOutDir: true },
      server: { proxy },
      preview: { proxy },
    };
  });
}
