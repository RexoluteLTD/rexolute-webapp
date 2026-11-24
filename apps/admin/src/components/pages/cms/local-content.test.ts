import { beforeEach, expect, it } from "vitest";
import { localCategories } from "./local-content";

beforeEach(() => localStorage.clear());

it("keeps sample edits and respects an empty category list", () => {
  const [sample, ...other] = localCategories.read();
  const updated = { ...sample, name: "Announcements" };
  localCategories.update(() => [updated, ...other]);
  expect(localCategories.read()).toEqual([updated, ...other]);

  localCategories.update(() => []);
  expect(localCategories.read()).toEqual([]);
});
