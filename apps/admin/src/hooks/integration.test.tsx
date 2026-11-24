import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ApiClient, publicApi } from "@rexolute/api";
import { clearSession, verifyAdminLoginChallenge } from "@rexolute/api/session";
import { AuthProvider } from "@rexolute/auth/provider";
import { SharedLayoutProvider } from "../providers/layout-provider";
import { useAuth } from "./use-auth";
import { useSharedData } from "./use-layout";
import { toast } from "./use-toast";
import { Toaster } from "../components/layout/toaster";
import { SidebarProvider, useSidebar } from "../components/layout/sidebar";

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
let container: HTMLDivElement;
let root: Root;
beforeEach(() => {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
});
afterEach(async () => {
  await act(async () => root.unmount());
  document.body.innerHTML = "";
  vi.unstubAllGlobals();
});

describe("admin-owned hooks and integration components", () => {
  it.each([
    { outcome: "succeeds", fails: false },
    { outcome: "fails", fails: true },
  ])("signs out the admin locally when the request $outcome", async ({ fails }) => {
    const claims = btoa(JSON.stringify({ sub: "admin-1", role: "admin", exp: Math.floor(Date.now() / 1000) + 3600 }));
    const accessToken = `header.${claims}.signature`;
    vi.spyOn(publicApi, "post").mockResolvedValue({
      data: { data: { access_token: accessToken, refresh_token: "test-refresh" } },
    });
    await verifyAdminLoginChallenge("test-challenge", "123456", new AbortController().signal);

    const request = vi.fn();
    const previousAdapter = ApiClient.defaults.adapter;
    ApiClient.defaults.adapter = async (config) => {
      request(config.url, config.method, config.headers.get("Authorization"), config.data);
      if (fails) throw new Error("Signout unavailable");
      return { config, status: 204, statusText: "No Content", headers: {}, data: undefined };
    };
    function Logout() {
      const { session, signOut } = useAuth();
      return session ? <button onClick={() => void signOut()}>Log out</button> : <p>Signed out</p>;
    }

    try {
      await act(async () => root.render(<AuthProvider><Logout /></AuthProvider>));
      await act(async () => container.querySelector("button")!.click());
      expect(request).toHaveBeenCalledExactlyOnceWith("/auth/signout", "post", `Bearer ${accessToken}`, undefined);
      expect(container.textContent).toBe("Signed out");
      expect(sessionStorage.getItem("rexolute.session.v1")).toBeNull();
    } finally {
      ApiClient.defaults.adapter = previousAdapter;
      await act(async () => clearSession());
    }
  });

  it("shares verification state through the admin provider", async () => {
    function Profile() {
      const { data, setData } = useSharedData();
      return <button onClick={() => setData({ name: "Selected therapist" })}>{data?.name ?? "Select therapist"}</button>;
    }
    await act(async () => root.render(<SharedLayoutProvider><Profile /></SharedLayoutProvider>));
    await act(async () => container.querySelector("button")!.click());
    expect(container.textContent).toBe("Selected therapist");
  });

  it("renders notifications from the admin toast store", async () => {
    await act(async () => root.render(<Toaster />));
    await act(async () => { toast({ title: "Profile saved", description: "Your changes were saved." }); });
    expect(document.body.textContent).toContain("Profile saved");
    expect(document.body.textContent).toContain("Your changes were saved.");
  });

  it("passes the local mobile hook state to the admin sidebar", async () => {
    vi.stubGlobal("innerWidth", 600);
    vi.stubGlobal("matchMedia", vi.fn(() => ({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() })));
    function Status() {
      const { isMobile } = useSidebar();
      return <span>{isMobile ? "Mobile sidebar" : "Desktop sidebar"}</span>;
    }
    await act(async () => root.render(<SidebarProvider><Status /></SidebarProvider>));
    expect(container.textContent).toBe("Mobile sidebar");
  });
});
