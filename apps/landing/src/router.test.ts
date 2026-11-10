import { createMemoryHistory } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";
import { router } from "./router";
describe("landing routes", () => {
  it.each(["/", "/about-us", "/contact-us", "/terms-condition"])("matches %s without Next rewrites", async (path) => {
    router.update({ history: createMemoryHistory({ initialEntries: [path] }) });
    await router.load();
    expect(router.state.matches.at(-1)?.pathname).toBe(path);
    expect(router.state.matches.some((match) => match.status === "error")).toBe(false);
  });
  it("marks unknown paths as not found", async () => {
    router.update({ history: createMemoryHistory({ initialEntries: ["/missing"] }) });
    await router.load();
    expect(router.state.matches.some((match) => match.status === "notFound" || match._notFound)).toBe(true);
  });
});
