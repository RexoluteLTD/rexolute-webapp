import { afterEach, describe, expect, it, vi } from "vitest";
import { featuredBlogPost } from "./blog";
vi.mock("@rexolute/utils/app-urls", () => ({ appUrls: { landing: "https://example.co", client: "https://client.example.co", admin: "https://admin.example.co" } }));
afterEach(() => { vi.unstubAllEnvs(); vi.resetModules(); });
async function seo(indexable: boolean) {
  vi.resetModules();
  vi.stubEnv("VITE_SITE_INDEXABLE", String(indexable));
  return import("./seo");
}
describe("landing metadata", () => {
  it("gives public pages unique titles, descriptions, and clean canonical URLs", async () => {
    const { pageMetadata } = await seo(true);
    const pages = ["/", "/about-us", "/contact-us"].map(pageMetadata);
    expect(new Set(pages.map((page) => page.title)).size).toBe(3);
    expect(new Set(pages.map((page) => page.description)).size).toBe(3);
    expect(pages.every((page) => page.robots === "index, follow")).toBe(true);
    expect(pageMetadata("/about-us/").canonical).toBe("https://example.co/about-us");
  });
  it("keeps development builds out of the index", async () => {
    const { pageMetadata, publicPaths } = await seo(false);
    for (const path of publicPaths) expect(pageMetadata(path).robots).toBe("noindex, follow");
  });
  it("does not index draft policies or canonicalise unknown URLs as real pages", async () => {
    const { pageMetadata } = await seo(true);
    for (const path of ["/privacy", "/policy", "/terms-condition", "/missing"]) expect(pageMetadata(path).robots).toBe("noindex, follow");
    expect(pageMetadata("/missing").canonical).toBeUndefined();
  });
  it("provides social metadata and organization data without invented reviews", async () => {
    const { metadataTags, structuredData } = await seo(true);
    expect(metadataTags("/")).toContainEqual({ property: "og:image", content: "https://example.co/images/pic1.jpg" });
    expect(structuredData()["@graph"][0]).toMatchObject({ "@type": "Organization", email: "hello@example.co" });
    expect(JSON.stringify(structuredData())).not.toMatch(/Review|aggregateRating|Medical/);
  });
  it("prerenders mock articles with article metadata and keeps them out of the index", async () => {
    const { pageMetadata, publicPaths } = await seo(true);
    const path = `/blog/${featuredBlogPost.slug}`;
    expect(publicPaths).toContain(path);
    expect(pageMetadata("/blog").robots).toBe("noindex, follow");
    expect(pageMetadata(path)).toMatchObject({
      canonical: `https://example.co${path}`,
      robots: "noindex, follow",
      description: featuredBlogPost.excerpt,
      type: "article",
    });
    expect(pageMetadata("/blog/missing-article").canonical).toBeUndefined();
  });
});
