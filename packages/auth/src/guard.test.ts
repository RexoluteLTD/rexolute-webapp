import { describe, expect, it } from "vitest";
import { safeReturnTo } from "./guard";

describe("root-level login return paths", () => {
  it.each(["/", "/tasks?tab=therapists", "/settings/users/42#permissions"])("preserves a local path: %s", (path) => {
    expect(safeReturnTo(path)).toBe(path);
  });
  it.each(["https://example.com", "//example.com", "///example.com", "/\\example.com", "/tasks\nLocation: https://example.com", "tasks", "", undefined])("rejects an unsafe destination: %s", (destination) => {
    expect(safeReturnTo(destination)).toBe("/");
  });
  it("normalizes local path segments", () => {
    expect(safeReturnTo("/settings/../tasks")).toBe("/tasks");
  });
});
