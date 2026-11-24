import { beforeEach, expect, it } from "vitest";
import { localCategories, localPosts } from "./local-content";

beforeEach(() => localStorage.clear());

it("keeps an existing draft when a sample post is deleted", () => {
  const [sample, other] = localPosts.read();
  const draft = { ...other, id: "custom", slug: "custom-draft", content: "<p>Draft</p>" };
  localStorage.setItem("rexolute-cms-posts", JSON.stringify([draft]));

  localPosts.update((posts) => posts.filter((post) => post.id !== sample.id));
  expect(localPosts.read()).toEqual([draft, other]);
});

it("keeps sample edits and respects an empty category list", () => {
  const [sample, ...other] = localCategories.read();
  const updated = { ...sample, name: "Announcements" };
  localCategories.update(() => [updated, ...other]);
  expect(localCategories.read()).toEqual([updated, ...other]);

  localCategories.update(() => []);
  expect(localCategories.read()).toEqual([]);
});
