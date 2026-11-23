import { createMemoryHistory } from "@tanstack/react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
vi.mock("@rexolute/api/session", () => ({ getValidSession: vi.fn(async () => null), getSession: () => null, clearSession: vi.fn(), subscribeSession: () => () => {}, verifyOtp: vi.fn() }));
import { getValidSession } from "@rexolute/api/session";
import { router } from "./router";
beforeEach(() => { vi.clearAllMocks(); vi.mocked(getValidSession).mockResolvedValue(null); });
describe("client routes", () => {
  it("has its own public login", async () => {
    router.update({ history: createMemoryHistory({ initialEntries: ["/login"] }) });
    await router.load();
    expect(router.state.matches.at(-1)?.routeId).toBe("/login");
  });
  it("renders an authenticated client at the root URL", async () => {
    vi.mocked(getValidSession).mockResolvedValue({ user: { id: "client-1", role: "client", permissions: [], accessToken: "token", refreshToken: "refresh" }, expiresAt: Date.now() + 60000 });
    router.update({ history: createMemoryHistory({ initialEntries: ["/"] }) });
    await router.load();
    expect(router.state.location.pathname).toBe("/");
    expect(router.state.matches.at(-1)?.routeId).toBe("/_authenticated/");
    expect(router.state.matches.some((match) => match.status === "error")).toBe(false);
  });
  it("redirects anonymous clients to the client login", async () => {
    router.update({ history: createMemoryHistory({ initialEntries: ["/"] }) });
    await router.load();
    expect(router.state.location.pathname).toBe("/login");
  });
});
