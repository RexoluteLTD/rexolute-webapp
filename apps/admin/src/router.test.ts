import { createMemoryHistory } from "@tanstack/react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
vi.mock("@rexolute/api/session", () => ({ getValidSession: vi.fn(), getSession: () => null, clearSession: vi.fn(), subscribeSession: () => () => {}, verifyOtp: vi.fn() }));
import { getValidSession } from "@rexolute/api/session";
import { router } from "./router";

beforeEach(() => { vi.clearAllMocks(); vi.mocked(getValidSession).mockResolvedValue(null); });

describe("admin routes", () => {
  it.each(["/login", "/verify-otp", "/forgot-password", "/create-password", "/create-pin"])("leaves %s publicly accessible", async (path) => {
    router.update({ history: createMemoryHistory({ initialEntries: [path] }) });
    await router.load();
    expect(router.state.matches.at(-1)?.routeId).toBe(path);
    expect(getValidSession).not.toHaveBeenCalled();
  });
  it("redirects an anonymous deep link to login", async () => {
    router.update({ history: createMemoryHistory({ initialEntries: ["/tasks?tab=therapists"] }) });
    await router.load();
    expect(router.state.location.pathname).toBe("/login");
    expect(router.state.location.search).toMatchObject({ redirect: "/tasks?tab=therapists" });
  });
  it("protects the root dashboard", async () => {
    router.update({ history: createMemoryHistory({ initialEntries: ["/"] }) });
    await router.load();
    expect(router.state.location.pathname).toBe("/login");
    expect(router.state.location.search).toMatchObject({ redirect: "/" });
  });
  it("loads an admin deep link and extracts its ID", async () => {
    vi.mocked(getValidSession).mockResolvedValue({ user: { id: "admin-1", role: "admin", permissions: [], accessToken: "token", refreshToken: "refresh" }, expiresAt: Date.now() + 60000 });
    router.update({ history: createMemoryHistory({ initialEntries: ["/settings/users/42"] }) });
    await router.load();
    expect(router.state.matches.at(-1)?.params).toMatchObject({ id: "42" });
    expect(router.state.matches.some((match) => match.status === "error")).toBe(false);
  });
  it("loads the protected folder index without changing its URL", async () => {
    vi.mocked(getValidSession).mockResolvedValue({ user: { id: "admin-1", role: "admin", permissions: [], accessToken: "token", refreshToken: "refresh" }, expiresAt: Date.now() + 60000 });
    router.update({ history: createMemoryHistory({ initialEntries: ["/"] }) });
    await router.load();
    expect(router.state.location.pathname).toBe("/");
    expect(router.state.matches.some((match) => match.status === "error")).toBe(false);
  });
  it("validates session search parameters in the route file", async () => {
    vi.mocked(getValidSession).mockResolvedValue({ user: { id: "admin-1", role: "admin", permissions: [], accessToken: "token", refreshToken: "refresh" }, expiresAt: Date.now() + 60000 });
    router.update({ history: createMemoryHistory({ initialEntries: ["/sessions/details?id=session-1&mode=reassign"] }) });
    await router.load();
    expect(router.state.matches.at(-1)?.search).toMatchObject({ id: "session-1", mode: "reassign" });
  });
  it("rejects an authenticated client from admin routes", async () => {
    vi.mocked(getValidSession).mockResolvedValue({ user: { id: "client-1", role: "client", permissions: [], accessToken: "token", refreshToken: "refresh" }, expiresAt: Date.now() + 60000 });
    router.update({ history: createMemoryHistory({ initialEntries: ["/settings"] }) });
    await router.load();
    expect(router.state.location.pathname).toBe("/login");
  });
});
