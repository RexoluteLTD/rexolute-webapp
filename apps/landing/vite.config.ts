import { defineConfig } from "vite";
import { createAppConfig } from "../../vite.shared";
import { articleIdPattern } from "./src/lib/blog";

const appConfig = createAppConfig(import.meta.url);

export default defineConfig((environment) => {
  const config = appConfig(environment);
  return {
    ...config,
    plugins: [config.plugins, {
      name: "rexolute-blog-article-preview",
      configurePreviewServer(server) {
        server.middlewares.use((request, _response, next) => {
          const pathname = request.url?.split("?")[0]?.replace(/\/$/, "");
          if ((request.method === "GET" || request.method === "HEAD") && pathname?.startsWith("/blog/") && articleIdPattern.test(pathname.slice("/blog/".length))) {
            request.url = "/blog-article.html";
          }
          next();
        });
      },
    }],
  };
});
