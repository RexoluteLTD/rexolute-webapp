import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SharedLayoutProvider } from "../providers/layout-provider";
import { useSharedData } from "./use-layout";
import { toast } from "./use-toast";
import { Toaster } from "../components/admin/layout/toaster";
import { SidebarProvider, useSidebar } from "../components/admin/layout/sidebar";

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
