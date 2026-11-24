import { act, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";
import type { Editor } from "@tiptap/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { authenticatedArticles } from "@rexolute/api/articles";
import type { Article } from "@rexolute/types";
import ArticleDetailsPage from "./article-details";
import NewPostPage, { ArticleEditor } from "./new-post";
import PostsPage from "./posts";
import { articleFormSchema } from "./article-form";
import { postCatalogs } from "@rexolute/api/post-catalogs";
import type { PostCatalogEntry } from "@rexolute/types";
import CategoriesPage, { TagsPage } from "./categories";
import { CatalogForm, catalogSchema } from "./catalog-form";

const auth = vi.hoisted(() => ({ permissions: [] as string[], navigate: vi.fn() }));
vi.mock("../../../hooks/use-auth", () => ({
  useAuth: () => ({ session: { user: { id: "admin-current", role: "admin", permissions: auth.permissions } } }),
}));
vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, className }: { children: ReactNode; className?: string }) => <a href="#" className={className}>{children}</a>,
  useNavigate: () => auth.navigate,
  getRouteApi: () => ({ useParams: () => ({ id: "article-id" }) }),
}));

const article: Article = {
  id: "article-id", postType: "article", title: "First steps",
  category: "wellbeing", tags: ["a, b"], state: "draft",
  featureImage: "/images/existing.png", user_id: "another-admin", username: "Another admin",
  count_comments: 2, count_likes: 5, created_at: "2026-11-24T12:00:00Z", updated_at: "2026-11-24T12:00:00Z",
  content: { type: "doc", content: [
    { type: "orderedList", attrs: { start: 4 }, content: [
      { type: "listItem", content: [{ type: "paragraph", content: [
        { type: "text", text: "Take a moment", marks: [{ type: "bold" }] },
        { type: "text", text: " to breathe", marks: [{ type: "link", attrs: { href: "https://example.com/resource", target: "_blank" } }] },
      ] }] },
    ] },
  ] },
};

const wellbeing: PostCatalogEntry = {
  id: "category-id", postType: "article", name: "Mental Wellbeing", slug: "wellbeing",
  description: "Articles about wellbeing", created_at: article.created_at, updated_at: article.updated_at,
};
const restTag: PostCatalogEntry = { ...wellbeing, id: "tag-id", name: "Rest and Recovery", slug: "rest" };

let container: HTMLDivElement;
let root: Root;
Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

beforeEach(() => {
  vi.spyOn(postCatalogs, "listAll").mockResolvedValue([]);
  auth.permissions = [];
  auth.navigate.mockReset();
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
});

afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

async function render(node: ReactNode) {
  await act(async () => root.render(node));
}

async function fill(id: string, value: string) {
  const input = container.querySelector<HTMLInputElement>(`#${id}`)!;
  await act(async () => {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!.call(input, value);
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
}

async function submit() {
  await act(async () => container.querySelector("form")!.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })));
}

it("preserves existing editor nodes, marks and attributes and submits a title-only PATCH", async () => {
  const update = vi.spyOn(authenticatedArticles, "update").mockResolvedValue(article);
  const onSaved = vi.fn();
  await render(<ArticleEditor article={article} onSaved={onSaved} />);
  const editor = container.querySelector<HTMLElement & { editor: Editor }>(".tiptap")!.editor;
  expect(editor.getJSON()).toMatchObject(article.content);
  expect(container.querySelector('ul[aria-label="Selected tags"]')?.textContent).toContain("a, b");
  expect(container.querySelector(".tiptap ol")?.getAttribute("start")).toBe("4");
  await fill("post-title", "Revised title");
  await submit();
  expect(update).toHaveBeenCalledExactlyOnceWith(article.id, { title: "Revised title" });
  expect(onSaved).toHaveBeenCalledWith(article);
});

it("uploads the selected image and creates a draft using the existing editor's JSON", async () => {
  auth.permissions = ["create"];
  vi.stubEnv("VITE_CLOUDINARY_CLOUD_NAME", "example-cloud");
  vi.stubEnv("VITE_CLOUDINARY_ARTICLE_PRESET", "articles-only");
  const secure_url = "https://res.cloudinary.com/example-cloud/image/upload/article.png";
  const upload = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ secure_url }) });
  vi.stubGlobal("fetch", upload);
  const create = vi.spyOn(authenticatedArticles, "create").mockResolvedValue(article);
  const listAll = vi.mocked(postCatalogs.listAll).mockImplementation(async (_type, resource) =>
    resource === "categories" ? [wellbeing] : [restTag]);
  await render(<NewPostPage />);
  const editor = container.querySelector<HTMLElement & { editor: Editor }>(".tiptap")!.editor;
  await act(async () => { editor.commands.setContent(article.content); });
  await fill("post-title", "First steps");
  const category = container.querySelector<HTMLSelectElement>("#post-category")!;
  expect(category.querySelector('option[value="wellbeing"]')?.textContent).toBe("Mental Wellbeing");
  await act(async () => {
    category.value = "wellbeing";
    category.dispatchEvent(new Event("change", { bubbles: true }));
  });
  const tags = container.querySelector<HTMLSelectElement>("#post-tags")!;
  expect(tags.querySelector('option[value="rest"]')?.textContent).toBe("Rest and Recovery");
  await act(async () => {
    tags.value = "rest";
    tags.dispatchEvent(new Event("change", { bubbles: true }));
  });
  expect(listAll).toHaveBeenCalledWith("article", "categories", expect.any(AbortSignal));
  expect(listAll).toHaveBeenCalledWith("article", "tags", expect.any(AbortSignal));
  const input = container.querySelector<HTMLInputElement>("#post-image")!;
  Object.defineProperty(input, "files", { value: [new File(["image"], "article.png", { type: "image/png" })] });
  await act(async () => input.dispatchEvent(new Event("change", { bubbles: true })));
  await submit();
  expect(upload).toHaveBeenCalledExactlyOnceWith("https://api.cloudinary.com/v1_1/example-cloud/image/upload", {
    method: "POST", body: expect.any(FormData), signal: expect.any(AbortSignal),
  });
  expect(upload.mock.calls[0][1].body.get("upload_preset")).toBe("articles-only");
  expect(create).toHaveBeenCalledExactlyOnceWith({
    title: "First steps", state: "draft", content: editor.getJSON(), tags: ["rest"], category: "wellbeing", featureImage: secure_url,
  });
});

it("keeps an existing category available and clears it with a category-only PATCH", async () => {
  const update = vi.spyOn(authenticatedArticles, "update").mockResolvedValue({ ...article, category: "" });
  await render(<ArticleEditor article={article} onSaved={vi.fn()} />);
  const category = container.querySelector<HTMLSelectElement>("#post-category")!;
  expect(category.value).toBe("wellbeing");
  await act(async () => {
    category.value = "";
    category.dispatchEvent(new Event("change", { bubbles: true }));
  });
  await submit();
  expect(update).toHaveBeenCalledExactlyOnceWith(article.id, { category: "" });
});

it("shows draft and management controls only when permitted, including articles by other admins", async () => {
  const list = vi.spyOn(authenticatedArticles, "list").mockResolvedValue({ items: [], total_count: 0, current_page: 1, limit: 10 });
  await render(<PostsPage />);
  expect(container.textContent).not.toContain("Add article");
  expect(container.querySelector("#article-state")).toBeNull();
  expect(list).toHaveBeenCalledWith(expect.objectContaining({ state: "published" }), expect.any(AbortSignal));

  const get = vi.spyOn(authenticatedArticles, "get").mockResolvedValue(article);
  await render(<ArticleDetailsPage />);
  expect(container.textContent).toContain("Article not found");
  expect(container.textContent).not.toContain(article.title);

  auth.permissions = ["view", "edit"];
  const update = vi.spyOn(authenticatedArticles, "update").mockResolvedValue({ ...article, state: "published" });
  await render(<ArticleDetailsPage />);
  expect(container.textContent).toContain(article.title);
  expect(container.textContent).not.toContain("Delete");
  const publish = [...container.querySelectorAll("button")].find((button) => button.textContent === "Publish")!;
  await act(async () => publish.click());
  expect(update).toHaveBeenCalledExactlyOnceWith(article.id, { state: "published" });
  expect(get).toHaveBeenCalledTimes(2);
});

it("counts UTF-8 bytes and rejects invalid image paths and invalid tags", () => {
  const invalid = articleFormSchema.safeParse({
    title: "😀".repeat(64), category: "é".repeat(41), tags: ["é".repeat(33)], featureImage: "//example.com/image.png",
  });
  expect(invalid.success).toBe(false);
  if (!invalid.success) expect(Object.keys(invalid.error.flatten().fieldErrors)).toEqual(["title", "category", "tags", "featureImage"]);
});

it("loads the four catalogs separately and gates management actions", async () => {
  const list = vi.spyOn(postCatalogs, "list").mockImplementation(async (postType, resource, { page }) => ({
    items: [{ ...wellbeing, postType, name: `${postType} ${resource} ${page}` }],
    total_count: 11, current_page: page!, limit: 10,
  }));
  await render(<CategoriesPage />);
  expect(container.textContent).toContain("article categories 1");
  expect(container.querySelector("form")).toBeNull();
  expect(container.querySelector("table")).not.toBeNull();
  expect(container.querySelector('button[aria-label^="Edit "]')).toBeNull();
  expect(container.querySelector('button[aria-label^="Delete "]')).toBeNull();

  const next = [...container.querySelectorAll("button")].find((button) => button.textContent === "Next")!;
  await act(async () => next.click());
  expect(list).toHaveBeenCalledWith("article", "categories", { page: 2 }, expect.any(AbortSignal));
  expect(container.textContent).toContain("article categories 2");
  const select = container.querySelector<HTMLSelectElement>("#catalog-post-type")!;
  await act(async () => {
    select.value = "community";
    select.dispatchEvent(new Event("change", { bubbles: true }));
  });
  expect(container.textContent).toContain("community categories 1");
  expect(container.textContent).not.toContain("article categories 2");

  auth.permissions = ["create", "delete"];
  await render(<TagsPage />);
  expect(container.textContent).toContain("article tags 1");
  expect(container.querySelector("form #catalog-post-type")).not.toBeNull();
  expect(container.querySelector("table")).not.toBeNull();
  expect([...container.querySelectorAll("button")].some((button) => button.textContent === "Add tag")).toBe(false);
  expect(container.querySelector('button[aria-label^="Edit "]')).toBeNull();
  expect(container.querySelector('button[aria-label^="Delete "]')).not.toBeNull();
  const tagsType = container.querySelector<HTMLSelectElement>("#catalog-post-type")!;
  await act(async () => {
    tagsType.value = "community";
    tagsType.dispatchEvent(new Event("change", { bubbles: true }));
  });
  expect(container.textContent).toContain("community tags 1");
  expect(list.mock.calls.map(([type, resource, { page }]) => [type, resource, page])).toEqual([
    ["article", "categories", 1], ["article", "categories", 2], ["community", "categories", 1],
    ["article", "tags", 1], ["community", "tags", 1],
  ]);
});

it("loads entry details and submits a single edited field, then shows duplicate slug feedback inline", async () => {
  auth.permissions = ["edit"];
  const list = vi.spyOn(postCatalogs, "list").mockResolvedValue({ items: [wellbeing], total_count: 1, current_page: 1, limit: 10 });
  const get = vi.spyOn(postCatalogs, "get").mockResolvedValue(wellbeing);
  const update = vi.spyOn(postCatalogs, "update").mockResolvedValueOnce(wellbeing).mockRejectedValueOnce({
    isAxiosError: true, response: { status: 409, data: { error: { message: "Slug exists" } } },
  });
  await render(<CategoriesPage />);
  const edit = () => container.querySelector<HTMLButtonElement>('button[aria-label="Edit Mental Wellbeing"]')!;
  await act(async () => edit().click());
  expect(get).toHaveBeenCalledWith("article", "categories", wellbeing.id, expect.any(AbortSignal));
  await fill("catalog-name", "  Revised Wellbeing  ");
  await submit();
  expect(update).toHaveBeenNthCalledWith(1, "article", "categories", wellbeing.id, { name: "Revised Wellbeing" });
  expect(list).toHaveBeenCalledTimes(2);

  await act(async () => edit().click());
  await fill("catalog-slug", "existing-slug");
  await submit();
  expect(update).toHaveBeenNthCalledWith(2, "article", "categories", wellbeing.id, { slug: "existing-slug" });
  expect(container.querySelector("#catalog-slug-error")?.textContent).toContain("already in use");
  expect(list).toHaveBeenCalledTimes(2);
});

it("checks required catalog fields, UTF-8 limits, and resource-specific slugs", () => {
  const entry = { name: "é".repeat(51), slug: "bad--slug", description: " " };
  const invalid = catalogSchema("categories").safeParse(entry);
  expect(invalid.success).toBe(false);
  if (!invalid.success) expect(Object.keys(invalid.error.flatten().fieldErrors)).toEqual(["name", "slug", "description"]);
  const longSlug = { name: "Name", slug: "a".repeat(65), description: "Description" };
  expect(catalogSchema("categories").safeParse(longSlug).success).toBe(true);
  expect(catalogSchema("tags").safeParse(longSlug).success).toBe(false);
});

it("creates a trimmed tag and confirms deletion before refreshing the catalog", async () => {
  auth.permissions = ["create", "delete"];
  const list = vi.spyOn(postCatalogs, "list").mockResolvedValue({
    items: [restTag], total_count: 1, current_page: 1, limit: 10,
  });
  const create = vi.spyOn(postCatalogs, "create").mockResolvedValue(restTag);
  const remove = vi.spyOn(postCatalogs, "delete").mockResolvedValue(undefined);
  await render(<TagsPage />);
  expect(container.querySelector("form h2")?.textContent).toBe("New tag");
  await fill("catalog-name", " Rest and Recovery ");
  expect(container.querySelector<HTMLInputElement>("#catalog-slug")?.value).toBe("rest-and-recovery");
  const description = container.querySelector<HTMLTextAreaElement>("#catalog-description")!;
  await act(async () => {
    Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value")!.set!.call(description, " Time for rest. ");
    description.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await submit();
  expect(create).toHaveBeenCalledExactlyOnceWith("article", "tags", {
    name: "Rest and Recovery", slug: "rest-and-recovery", description: "Time for rest.",
  });
  expect(list).toHaveBeenCalledTimes(2);
  expect(container.querySelector<HTMLInputElement>("#catalog-name")?.value).toBe("");
  expect(container.querySelector<HTMLInputElement>("#catalog-slug")?.value).toBe("");

  const deleteButton = container.querySelector<HTMLButtonElement>('button[aria-label="Delete Rest and Recovery"]')!;
  await act(async () => deleteButton.click());
  expect(remove).not.toHaveBeenCalled();
  const dialog = document.querySelector('[role="alertdialog"]')!;
  list.mockResolvedValue({ items: [], total_count: 0, current_page: 1, limit: 10 });
  const confirm = [...dialog.querySelectorAll("button")].find((button) => button.textContent === "Delete tag")!;
  await act(async () => confirm.click());
  expect(remove).toHaveBeenCalledExactlyOnceWith("article", "tags", restTag.id);
  expect(list).toHaveBeenCalledTimes(3);
  expect(container.querySelector("table")?.textContent).toContain("No tags found.");
  expect(container.querySelector("form #catalog-post-type")).not.toBeNull();
});

it("updates the generated catalog slug until it is edited manually", async () => {
  await render(<CatalogForm postType="article" resource="categories" onPostTypeChange={vi.fn()} onSaved={vi.fn()} />);
  const slug = container.querySelector<HTMLInputElement>("#catalog-slug")!;
  await fill("catalog-name", "  Café & Work–Life Balance ");
  expect(slug.value).toBe("cafe-work-life-balance");
  await fill("catalog-name", "Work Life Balance");
  expect(slug.value).toBe("work-life-balance");
  await fill("catalog-slug", "work-life");
  await fill("catalog-name", "Everyday Balance");
  expect(slug.value).toBe("work-life");
});
