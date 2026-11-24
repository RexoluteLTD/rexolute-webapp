import { afterEach, expect, it, vi } from "vitest";
import type { PostCatalogEntry, PostType } from "@rexolute/types";
import api from "./axios";
import { postCatalogs } from "./post-catalogs";
import { publicApi } from "./transport";

const input = { name: "Wellbeing", slug: "wellbeing", description: "About wellbeing." };
const entry = (postType: PostType): PostCatalogEntry => ({
  ...input, id: "entry", postType, created_at: "2026-11-24T00:00:00Z", updated_at: "2026-11-24T00:00:00Z",
});

afterEach(() => vi.restoreAllMocks());

it("reads each public catalog from its own path without the authenticated client", async () => {
  const read = vi.spyOn(publicApi, "get").mockImplementation(async (url) => {
    const record = entry(url.includes("/community/") ? "community" : "article");
    const data = url.endsWith("/entry") ? record : { items: [record], total_count: 1, current_page: 2, limit: 5 };
    return { data: { status: "success", data } };
  });
  const authenticatedRead = vi.spyOn(api, "get");
  for (const postType of ["article", "community"] as const) {
    for (const resource of ["categories", "tags"] as const) {
      const path = `/cms/posts/${postType}/${resource}`;
      await expect(postCatalogs.list(postType, resource, { page: 2, limit: 5 })).resolves.toMatchObject({ items: [entry(postType)] });
      await expect(postCatalogs.get(postType, resource, "entry")).resolves.toEqual(entry(postType));
      expect(read).toHaveBeenCalledWith(path, { params: { page: 2, limit: 5 }, signal: undefined });
      expect(read).toHaveBeenCalledWith(`${path}/entry`, { signal: undefined });
    }
  }
  expect(authenticatedRead).not.toHaveBeenCalled();
});

it("uses the authenticated client for mutations and accepts a bodyless deletion", async () => {
  const create = vi.spyOn(api, "post").mockResolvedValue({ status: 201, data: { status: "success", data: entry("community") } });
  const update = vi.spyOn(api, "patch").mockResolvedValue({ status: 200, data: { status: "success", data: entry("article") } });
  const remove = vi.spyOn(api, "delete").mockResolvedValue({ status: 204 });
  await expect(postCatalogs.create("community", "tags", input)).resolves.toEqual(entry("community"));
  await expect(postCatalogs.update("article", "categories", "entry", { name: "New" })).resolves.toEqual(entry("article"));
  await expect(postCatalogs.delete("community", "categories", "entry")).resolves.toBeUndefined();
  expect(create).toHaveBeenCalledWith("/cms/posts/community/tags", input);
  expect(update).toHaveBeenCalledWith("/cms/posts/article/categories/entry", { name: "New" });
  expect(remove).toHaveBeenCalledWith("/cms/posts/community/categories/entry");
});

it("propagates wrong-catalog 404 responses and rejects rows from the wrong post type", async () => {
  const wrongCatalog = { response: { status: 404 } };
  const read = vi.spyOn(publicApi, "get").mockRejectedValueOnce(wrongCatalog).mockResolvedValueOnce({
    data: { status: "success", data: { items: [entry("article")], total_count: 1, limit: 10 } },
  });
  await expect(postCatalogs.get("community", "tags", "entry")).rejects.toBe(wrongCatalog);
  expect(read).toHaveBeenCalledWith("/cms/posts/community/tags/entry", { signal: undefined });
  await expect(postCatalogs.list("community", "tags", { page: 1 })).rejects.toThrow("unexpected response");
});
