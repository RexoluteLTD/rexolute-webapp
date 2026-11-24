import { act } from "react";
import { createRoot } from "react-dom/client";
import { createMemoryHistory, createRouter, RouterProvider } from "@tanstack/react-router";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { ApiClient, publicApi } from "@rexolute/api";
import { clearSession, verifyAdminLoginChallenge } from "@rexolute/api/session";
import { AuthProvider } from "@rexolute/auth/provider";
import { routeTree } from "./routeTree.gen";
Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
beforeEach(() => { vi.spyOn(window, "scrollTo").mockImplementation(() => {}); });
let unmount: (() => void) | undefined;
afterEach(async () => { await act(async () => unmount?.()); unmount = undefined; document.body.innerHTML = ""; });
it("renders admin through its generated route tree", async () => {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  unmount = () => root.unmount();
  const router = createRouter({ routeTree, history: createMemoryHistory({ initialEntries: ["/login"] }) });
  await act(async () => { await router.load(); root.render(<AuthProvider><RouterProvider router={router} /></AuthProvider>); });
  await vi.waitFor(() => expect(container.textContent).toContain("ADMIN PORTAL"));
});

it("opens the admin dashboard after OTP without rendering an auth route error", async () => {
  vi.stubGlobal("matchMedia", vi.fn(() => ({
    matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn(), addListener: vi.fn(), removeListener: vi.fn(),
  })));
  vi.stubGlobal("ResizeObserver", class {
    observe() {}
    disconnect() {}
  });
  const logError = vi.spyOn(console, "error").mockImplementation(() => {});
  const challengeId = "test-challenge";
  const claims = btoa(JSON.stringify({ sub: "admin-1", role: "admin", exp: Math.floor(Date.now() / 1000) + 3600 }));
  const verify = vi.spyOn(publicApi, "post").mockResolvedValue({
    data: { data: { access_token: `header.${claims}.signature`, refresh_token: "test-refresh" } },
  });
  vi.spyOn(publicApi, "get").mockRejectedValue(new Error("Status unavailable"));
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: [`/verify-otp?challenge_id=${challengeId}`] }),
  });

  try {
    await act(async () => {
      await router.load();
      root.render(<AuthProvider><RouterProvider router={router} /></AuthProvider>);
    });
    const input = container.querySelector<HTMLInputElement>('input[aria-label="Verification code"]')!;
    await act(async () => {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!.call(input, "123456");
      input.dispatchEvent(new Event("input", { bubbles: true }));
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    await act(async () => {
      container.querySelector("form")!.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    });
    await vi.waitFor(() => expect(container.querySelector("main h1")?.textContent).toBe("Dashboard"));
    expect(verify).toHaveBeenCalledExactlyOnceWith(`/auth/login-challenges/${challengeId}/verify`, { code: "123456" }, { signal: expect.any(AbortSignal) });
    expect(router.state.location.pathname).toBe("/");
    expect(logError.mock.calls.flat().map(String).join("\n")).not.toContain("Could not find an active match");
  } finally {
    await act(async () => root.unmount());
    clearSession();
    vi.unstubAllGlobals();
  }
});

it("keeps the page interactive when signing out from the profile menu", async () => {
  vi.stubGlobal("matchMedia", vi.fn(() => ({
    matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn(), addListener: vi.fn(), removeListener: vi.fn(),
  })));
  const claims = btoa(JSON.stringify({ sub: "admin-1", role: "admin", exp: Math.floor(Date.now() / 1000) + 3600 }));
  vi.spyOn(publicApi, "post").mockResolvedValue({
    data: { data: { access_token: `header.${claims}.signature`, refresh_token: "test-refresh" } },
  });
  await verifyAdminLoginChallenge("test-challenge", "123456", new AbortController().signal);
  let complete!: () => void;
  const response = new Promise<void>((resolve) => { complete = resolve; });
  const signOut = vi.spyOn(ApiClient, "post").mockReturnValue(response);
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  const router = createRouter({ routeTree, history: createMemoryHistory({ initialEntries: ["/activities"] }) });
  const navigate = vi.spyOn(router, "navigate");

  try {
    await act(async () => {
      await router.load();
      root.render(<AuthProvider><RouterProvider router={router} /></AuthProvider>);
    });
    const trigger = Array.from(container.querySelectorAll("button")).find((button) => button.textContent?.includes("Open menu"))!;
    await act(async () => trigger.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true })));
    const logout = document.querySelector<HTMLElement>('[role="menuitem"]')!;
    expect(logout.textContent).toBe("Log out");
    expect(document.body.style.pointerEvents).not.toBe("none");

    await act(async () => logout.click());
    expect(signOut).toHaveBeenCalledExactlyOnceWith("/auth/signout");
    expect(document.querySelector('[role="menu"]')).toBeNull();
    expect(document.body.style.pointerEvents).not.toBe("none");

    await act(async () => complete());
    expect(router.state.location.pathname).toBe("/login");
    expect(navigate).toHaveBeenCalledTimes(1);
    expect(router.state.location.search).toMatchObject({ redirect: "/activities" });
    expect(document.body.style.pointerEvents).not.toBe("none");
    const email = container.querySelector<HTMLInputElement>("#email")!;
    email.focus();
    expect(document.activeElement).toBe(email);
  } finally {
    await act(async () => {
      complete();
      root.unmount();
    });
    clearSession();
    vi.unstubAllGlobals();
  }
});
