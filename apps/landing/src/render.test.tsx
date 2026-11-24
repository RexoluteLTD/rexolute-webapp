import { act } from "react";
import { createRoot } from "react-dom/client";
import { createMemoryHistory, createRouter, RouterProvider } from "@tanstack/react-router";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { publicArticles } from "@rexolute/api/articles";
import type { Article } from "@rexolute/types";
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
  const list = vi.spyOn(publicArticles, "list").mockResolvedValueOnce({
    items: [article, { ...article, id: "draft", title: "Private draft", state: "draft" }], total_count: 11, current_page: 1, limit: 10,
  }).mockResolvedValueOnce({
    items: [], total_count: 11, current_page: 2, limit: 10,
  }).mockResolvedValue({
    items: [article], total_count: 1, current_page: 1, limit: 10,
  });
  const container = await openBlog("/blog");
  expect(container.textContent).toContain(article.title);
  expect(container.textContent).not.toContain("Private draft");
  expect(container.querySelector(".blog-post-grid a")?.getAttribute("href")).toBe(`/blog/${article.id}`);
  const next = [...container.querySelectorAll("button")].find((button) => button.textContent === "Next")!;
  await act(async () => next.click());
  expect(list).toHaveBeenNthCalledWith(2, expect.objectContaining({ page: 2, state: "published" }), expect.any(AbortSignal));
  expect(container.textContent).toContain("No articles found");
  container.querySelector<HTMLInputElement>("#blog-category")!.value = "wellbeing";
  container.querySelector<HTMLInputElement>("#blog-tag")!.value = "rest";
  await act(async () => container.querySelector(".blog-filters")!.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })));
  expect(list).toHaveBeenNthCalledWith(3, { page: 1, state: "published", category: "wellbeing", tag: "rest" }, expect.any(AbortSignal));
});

it("renders a published article as rich text and keeps an inaccessible draft private", async () => {
  const get = vi.spyOn(publicArticles, "get").mockResolvedValueOnce(article);
  const container = await openBlog(`/blog/${article.id}`);
  expect(container.querySelector("h1")?.textContent).toBe(article.title);
  expect(container.querySelector(".blog-prose strong")?.textContent).toBe("Slow down.");
  expect(document.title).toContain(article.title);

  const draftId = "20019107-ce18-458c-af79-acb163346878";
  get.mockResolvedValueOnce({ ...article, id: draftId, title: "Private draft", state: "draft" });
  await act(async () => { await router.navigate({ to: "/blog/$slug", params: { slug: draftId } }); });
  expect(container.querySelector("h1")?.textContent).toBe("Article not found");
  expect(container.textContent).not.toContain("Private draft");
});
