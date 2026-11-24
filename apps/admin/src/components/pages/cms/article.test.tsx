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
import { localCategories } from "./local-content";

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

let container: HTMLDivElement;
let root: Root;
Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

beforeEach(() => {
  localStorage.clear();
  auth.permissions = [];
  auth.navigate.mockReset();
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
});

afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
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
  localCategories.update((items) => [...items, { id: "wellbeing", name: "Mental Wellbeing", slug: "wellbeing", description: "", count: 0 }]);
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
  const input = container.querySelector<HTMLInputElement>("#post-image")!;
  Object.defineProperty(input, "files", { value: [new File(["image"], "article.png", { type: "image/png" })] });
  await act(async () => input.dispatchEvent(new Event("change", { bubbles: true })));
  await submit();
  expect(upload).toHaveBeenCalledExactlyOnceWith("https://api.cloudinary.com/v1_1/example-cloud/image/upload", {
    method: "POST", body: expect.any(FormData), signal: expect.any(AbortSignal),
  });
  expect(upload.mock.calls[0][1].body.get("upload_preset")).toBe("articles-only");
  expect(create).toHaveBeenCalledExactlyOnceWith({
    title: "First steps", state: "draft", content: editor.getJSON(), tags: [], category: "wellbeing", featureImage: secure_url,
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
    title: "😀".repeat(64), category: "é".repeat(41), tags: "é".repeat(33), featureImage: "//example.com/image.png",
  });
  expect(invalid.success).toBe(false);
  if (!invalid.success) expect(Object.keys(invalid.error.flatten().fieldErrors)).toEqual(["title", "category", "tags", "featureImage"]);
});
