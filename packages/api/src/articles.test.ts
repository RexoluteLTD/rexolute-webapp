import { expect, it, vi } from "vitest";
import { authenticatedArticles, publicArticles } from "./articles";
import api from "./axios";
import { publicApi } from "./transport";

const base = "/cms/posts/article";

it("keeps public published reads on the unauthenticated client and draft reads on the authenticated client", async () => {
  const read = vi.spyOn(publicApi, "get").mockResolvedValue({ data: { data: { id: "article" } } });
  const adminRead = vi.spyOn(api, "get").mockResolvedValue({ data: { data: { items: [] } } });
  await expect(publicArticles.get("article")).resolves.toMatchObject({ id: "article" });
  expect(read).toHaveBeenCalledWith(`${base}/article`, { signal: undefined });
  await authenticatedArticles.list({ state: "draft", page: 2, category: "wellbeing" });
  expect(adminRead).toHaveBeenCalledWith(base, { params: { state: "draft", page: 2, category: "wellbeing" }, signal: undefined });
});

it("uses the article comment and reply routes with plain text and paginated public reads", async () => {
  const read = vi.spyOn(publicApi, "get").mockResolvedValue({ data: { data: { items: [] } } });
  const post = vi.spyOn(api, "post").mockResolvedValue({ status: 201, data: { data: { content: "Thanks" } } });
  const patch = vi.spyOn(api, "patch").mockResolvedValue({ data: { data: { content: "Updated" } } });
  const remove = vi.spyOn(api, "delete").mockResolvedValue({ status: 204 });
  const article = `${base}/article`;
  await publicArticles.listComments("article", { page: 2 });
  await publicArticles.listComments("article", { limit: 5 }, "parent");
  await publicArticles.getComment("article", "parent");
  expect(read.mock.calls.map(([url]) => url)).toEqual([`${article}/comments`, `${article}/comments/parent/replies`, `${article}/comments/parent`]);
  await expect(authenticatedArticles.addComment("article", "Thanks")).resolves.toMatchObject({ content: "Thanks" });
  await authenticatedArticles.addComment("article", "Thanks", "parent");
  expect(post.mock.calls).toEqual([
    [`${article}/comments`, { content: "Thanks" }],
    [`${article}/comments/parent/replies`, { content: "Thanks" }],
  ]);
  await authenticatedArticles.updateComment("article", "parent", "Updated");
  expect(patch).toHaveBeenCalledWith(`${article}/comments/parent`, { content: "Updated" });
  await authenticatedArticles.deleteComment("article", "parent");
  await authenticatedArticles.delete("article");
  expect(remove.mock.calls).toEqual([[`${article}/comments/parent`], [article]]);
});

it("returns server counters from article and comment like operations, including repeated PUT or DELETE", async () => {
  const request = vi.spyOn(api, "request").mockResolvedValue({ data: { data: { liked: true, count_likes: 5 } } });
  const read = vi.spyOn(publicApi, "get").mockResolvedValue({ data: { data: { items: [], total_count: 0 } } });
  for (let attempt = 0; attempt < 2; attempt++) {
    await expect(authenticatedArticles.setLike("article", true)).resolves.toEqual({ liked: true, count_likes: 5 });
  }
  request.mockResolvedValue({ data: { data: { liked: false, count_likes: 4 } } });
  for (let attempt = 0; attempt < 2; attempt++) {
    await expect(authenticatedArticles.setLike("article", false, "comment")).resolves.toEqual({ liked: false, count_likes: 4 });
  }
  expect(request.mock.calls.map(([config]) => [config.method, config.url])).toEqual([
    ["PUT", `${base}/article/likes`], ["PUT", `${base}/article/likes`],
    ["DELETE", `${base}/article/comments/comment/likes`], ["DELETE", `${base}/article/comments/comment/likes`],
  ]);
  await publicArticles.listLikes("article", { page: 1 });
  await publicArticles.listLikes("article", { page: 2 }, "comment");
  expect(read.mock.calls.map(([url]) => url)).toEqual([`${base}/article/likes`, `${base}/article/comments/comment/likes`]);
});
