import { act } from "react";
import { createRoot } from "react-dom/client";
import { createMemoryHistory, createRouter, RouterProvider } from "@tanstack/react-router";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { publicArticles } from "@rexolute/api/articles";
import { postCatalogs } from "@rexolute/api/post-catalogs";
import type { Article, ArticlePage } from "@rexolute/types";
import { routeTree } from "./routeTree.gen";
const makeRouter = () => createRouter({ routeTree, history: createMemoryHistory({ initialEntries: ["/"] }) });
let router = makeRouter();
Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
beforeEach(() => { router = makeRouter(); vi.spyOn(window, "scrollTo").mockImplementation(() => {}); });
let unmount: (() => void) | undefined;
afterEach(async () => { await act(async () => unmount?.()); document.body.innerHTML = ""; });
it("renders landing through its generated route tree", async () => {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  unmount = () => root.unmount();
  router.update({ history: createMemoryHistory({ initialEntries: ["/"] }) });
  await act(async () => { await router.load(); root.render(<RouterProvider router={router} />); });
  await vi.waitFor(() => expect(container.querySelector("h1")?.textContent).toBe("Mental health support built for Africans"));
});

it("offers a keyboard-accessible mobile menu and restores focus on Escape", async () => {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  unmount = () => root.unmount();
  router.update({ history: createMemoryHistory({ initialEntries: ["/"] }) });
  await act(async () => { await router.load(); root.render(<RouterProvider router={router} />); });
  const button = container.querySelector<HTMLButtonElement>("button[aria-controls='mobile-navigation']")!;
  const menu = container.querySelector<HTMLElement>("#mobile-navigation")!;
  expect(button.getAttribute("aria-expanded")).toBe("false");
  expect(menu.hidden).toBe(true);
  await act(async () => button.click());
  expect(button.getAttribute("aria-expanded")).toBe("true");
  expect(menu.hidden).toBe(false);
  await act(async () => { menu.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })); });
  expect(menu.hidden).toBe(true);
  expect(document.activeElement).toBe(button);
});
it("updates route metadata, has one main and H1, and labels contact fields", async () => {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  unmount = () => root.unmount();
  router.update({ history: createMemoryHistory({ initialEntries: ["/"] }) });
  await act(async () => { await router.load(); root.render(<RouterProvider router={router} />); });
  await act(async () => { await router.navigate({ to: "/contact-us" }); });
  expect(document.title).toContain("Contact Rexolute");
  expect(document.head.querySelectorAll('meta[name="description"]').length).toBe(1);
  expect(document.head.querySelectorAll('link[rel="canonical"]').length).toBe(1);
  expect(container.querySelectorAll("main").length).toBe(1);
  expect(container.querySelectorAll("h1").length).toBe(1);
  for (const input of container.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("input,textarea")) expect(input.labels?.length).toBe(1);
  expect(container.querySelector("form")?.getAttribute("action")).toBe("mailto:hello@example.co");
  expect(container.querySelector("form")?.getAttribute("method")).toBe("post");
  expect(document.activeElement?.id).toBe("main-content");
  expect(container.querySelector('a[href="mailto:hello@example.co"]')).not.toBeNull();
});

const article: Article = {
  id: "10019107-ce18-458c-af79-acb163346878", postType: "article", state: "published", tags: ["rest"],
  title: "A moment to breathe", category: "wellbeing", user_id: "author", username: "Editor",
  count_likes: 0, count_comments: 0, created_at: "2026-11-24T00:00:00Z", updated_at: "2026-11-24T00:00:00Z",
  content: { type: "doc", content: [{ type: "paragraph", content: [
    { type: "text", text: "Slow down.", marks: [{ type: "bold" }] },
  ] }] },
};

async function openBlog(path: string) {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  unmount = () => root.unmount();
  router.update({ history: createMemoryHistory({ initialEntries: [path] }) });
  await act(async () => { await router.load(); root.render(<RouterProvider router={router} />); });
  return container;
}

it("loads only published articles, paginates, and applies category and tag filters", async () => {
  let resolveArticles!: (page: ArticlePage<Article>) => void;
  const pending = new Promise<ArticlePage<Article>>((resolve) => { resolveArticles = resolve; });
  const catalog = vi.spyOn(postCatalogs, "list").mockImplementation(async (_postType, resource, { page }) => {
    const base = { postType: "article" as const, description: "", created_at: article.created_at, updated_at: article.updated_at };
    const entry = resource === "categories"
      ? page === 1 ? { id: "c1", name: "Wellbeing", slug: "wellbeing" } : { id: "c2", name: "Managing Stress", slug: "stress-management" }
      : { id: "t1", name: "Rest and Recovery", slug: "rest" };
    return { items: [{ ...base, ...entry }], total_count: resource === "categories" ? 101 : 1, current_page: page!, limit: 100 };
  });
  const list = vi.spyOn(publicArticles, "list").mockImplementation(async ({ page, category, tag }) => {
    if (page === 2) return { items: [], total_count: 11, current_page: page, limit: 10 };
    if (category || tag) return { items: [article], total_count: 1, current_page: 1, limit: 10 };
    return pending;
  });
  const container = await openBlog("/blog");
  expect(container.querySelectorAll('.blog-grid-skeleton[aria-hidden="true"] > li')).toHaveLength(4);
  expect(container.querySelector(".blog-grid-skeleton")?.parentElement?.getAttribute("aria-busy")).toBe("true");
  await act(async () => resolveArticles({
    items: [
      article,
      { ...article, id: "20019107-ce18-458c-af79-acb163346878", featureImage: "/article-cover.webp" },
      { ...article, id: "draft", title: "Private draft", state: "draft" },
    ], total_count: 11, current_page: 1, limit: 10,
  }));
  expect(container.querySelector(".blog-grid-skeleton")).toBeNull();
  expect(container.textContent).toContain(article.title);
  expect(container.textContent).not.toContain("Private draft");
  expect(container.querySelector(".blog-post-grid a")?.getAttribute("href")).toBe(`/blog/${article.id}`);
  expect(Array.from(container.querySelectorAll(".blog-card-image"), (image) => image.getAttribute("src")))
    .toEqual(["/svg/placeholder.svg", "/article-cover.webp"]);
  expect(container.querySelector('.blog-filters button[aria-pressed="true"]')?.textContent).toBe("All");
  expect(container.querySelector(".blog-filters")?.textContent).toContain("Managing Stress");
  expect(container.querySelector(".blog-filters")?.textContent).not.toContain("Private category");
  expect(container.querySelector(".blog-filters")?.textContent).not.toContain("stress-management");
  expect(Array.from(container.querySelectorAll<HTMLOptionElement>("#blog-tag-options option"), (tag) => tag.value))
    .toEqual(["rest"]);
  expect(container.querySelector("#blog-tag-options option")?.getAttribute("label")).toBe("Rest and Recovery");
  expect(catalog).toHaveBeenCalledWith("article", "categories", { page: 2, limit: 100 }, expect.any(AbortSignal));
  expect(catalog).toHaveBeenCalledWith("article", "tags", { page: 1, limit: 100 }, expect.any(AbortSignal));
  const next = [...container.querySelectorAll("button")].find((button) => button.textContent === "Next")!;
  await act(async () => next.click());
  expect(list).toHaveBeenCalledWith({ page: 2, state: "published", category: undefined, tag: undefined }, expect.any(AbortSignal));
  expect(container.textContent).toContain("No articles found");
  const category = Array.from(container.querySelectorAll<HTMLButtonElement>(".blog-filters button"))
    .find((button) => button.textContent === "Managing Stress")!;
  await act(async () => category.click());
  expect(category.getAttribute("aria-pressed")).toBe("true");
  expect(list).toHaveBeenCalledWith({ page: 1, state: "published", category: "stress-management", tag: undefined }, expect.any(AbortSignal));
  container.querySelector<HTMLInputElement>("#blog-tag")!.value = "rest";
  await act(async () => container.querySelector(".blog-search")!.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })));
  expect(list).toHaveBeenCalledWith({ page: 1, state: "published", category: "stress-management", tag: "rest" }, expect.any(AbortSignal));
});

it("renders a published article as rich text and keeps an inaccessible draft private", async () => {
  let resolveArticle!: (post: Article) => void;
  const pending = new Promise<Article>((resolve) => { resolveArticle = resolve; });
  const get = vi.spyOn(publicArticles, "get").mockReturnValueOnce(pending);
  const container = await openBlog(`/blog/${article.id}`);
  expect(container.querySelector(".blog-article")?.getAttribute("aria-busy")).toBe("true");
  expect(container.querySelector('.blog-article-skeleton[aria-hidden="true"] .blog-article-image')).not.toBeNull();
  await act(async () => resolveArticle(article));
  expect(container.querySelector(".blog-article")?.getAttribute("aria-busy")).toBe("false");
  expect(container.querySelector(".blog-article-skeleton")).toBeNull();
  expect(container.querySelector("h1")?.textContent).toBe(article.title);
  expect(container.querySelector(".blog-prose strong")?.textContent).toBe("Slow down.");
  expect(container.querySelector(".blog-article-image")?.getAttribute("src")).toBe("/svg/placeholder.svg");
  expect(document.title).toContain(article.title);

  const draftId = "20019107-ce18-458c-af79-acb163346878";
  get.mockResolvedValueOnce({ ...article, id: draftId, title: "Private draft", state: "draft" });
  await act(async () => { await router.navigate({ to: "/blog/$slug", params: { slug: draftId } }); });
  expect(container.querySelector("h1")?.textContent).toBe("Article not found");
  expect(container.textContent).not.toContain("Private draft");
});
