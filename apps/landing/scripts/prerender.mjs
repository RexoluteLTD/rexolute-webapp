import { build } from "vite";
import { readFile, writeFile, rm, mkdtemp } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const temporary = await mkdtemp(resolve(root, "../../node_modules/.rexolute-prerender-"));
const escape = (value) => String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
try {
  await build({ configFile: resolve(root, "vite.config.ts"), ssr: { noExternal: [/^@rexolute\//] }, build: {
    ssr: resolve(root, "src/prerender.tsx"), outDir: temporary, emptyOutDir: true,
    rollupOptions: { output: { entryFileNames: "entry.mjs" } },
  } });
  await writeFile(resolve(temporary, "package.json"), '{"type":"module"}');
  const renderer = await import(pathToFileURL(resolve(temporary, "entry.mjs")).href);
  if (renderer.siteIndexable && (!renderer.siteOrigin.startsWith("https://") || new URL(renderer.siteOrigin).hostname === "localhost")) {
    throw new Error("Indexable builds require VITE_LANDING_URL set to the public HTTPS site origin.");
  }
  const template = await readFile(resolve(root, "dist/index.html"), "utf8");
  if (!template.includes('<!--landing-seo-->') || !template.includes('<div id="root"></div>')) throw new Error("Landing HTML is missing its prerender placeholders.");
  for (const path of [...renderer.publicPaths, "/404"]) {
    const metadata = renderer.pageMetadata(path);
    const tags = renderer.metadataTags(path).map((attributes) => `<meta data-landing-seo ${Object.entries(attributes).map(([key, value]) => `${key}="${escape(value)}"`).join(" ")} />`);
    if (metadata.canonical) tags.push(`<link data-landing-seo rel="canonical" href="${escape(metadata.canonical)}" />`);
    tags.push(`<script data-landing-seo type="application/ld+json">${JSON.stringify(renderer.structuredData()).replace(/</g, "\\u003c")}</script>`);
    const content = await renderer.renderPage(path);
    const html = template.replace(/<title>.*?<\/title>/s, () => `<title>${escape(metadata.title)}</title>`)
      .replace("<!--landing-seo-->", () => tags.join("\n    "))
      .replace('<div id="root"></div>', () => `<div id="root">${content}</div>`);
    const file = path === "/" ? "index.html" : `${path.slice(1)}.html`;
    await writeFile(resolve(root, "dist", file), html);
    console.log(`Prerendered ${path}`);
  }
  const paths = renderer.publicPaths.filter((path) => renderer.pageMetadata(path).robots.startsWith("index"));
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map((path) => `<url><loc>${escape(new URL(path, renderer.siteOrigin).href)}</loc></url>`).join("")}</urlset>\n`;
  await writeFile(resolve(root, "dist/sitemap.xml"), sitemap);
  const robots = renderer.siteIndexable ? `User-agent: *\nAllow: /\nSitemap: ${renderer.siteOrigin}/sitemap.xml\n` : "User-agent: *\nDisallow: /\n";
  await writeFile(resolve(root, "dist/robots.txt"), robots);
} finally { await rm(temporary, { recursive: true, force: true }); }
