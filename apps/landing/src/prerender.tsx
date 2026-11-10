import { createMemoryHistory, createRouter, RouterProvider } from "@tanstack/react-router";
import { renderToString } from "react-dom/server";
import { routeTree } from "./routeTree.gen";
export { metadataTags, pageMetadata, publicPaths, siteOrigin, siteIndexable, structuredData } from "./lib/seo";

export async function renderPage(path: string) {
  const router = createRouter({ routeTree, history: createMemoryHistory({ initialEntries: [path] }), isServer: true });
  await router.load();
  for (const route of Object.values(router.routesById)) await route.options.component?.preload?.();
  const html = renderToString(<RouterProvider router={router} />);
  if (!html.includes("<h1")) throw new Error(`Prerender did not produce content for ${path}`);
  return html;
}
