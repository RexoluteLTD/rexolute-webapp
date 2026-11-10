import { act } from "react";
import { createRoot } from "react-dom/client";
import { createMemoryHistory, RouterProvider } from "@tanstack/react-router";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { router } from "./router";
Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
beforeEach(() => { vi.spyOn(window, "scrollTo").mockImplementation(() => {}); });
let unmount: (() => void) | undefined;
afterEach(async () => { await act(async () => unmount?.()); document.body.innerHTML = ""; });
it("renders landing through its generated route tree", async () => {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  unmount = () => root.unmount();
  router.update({ history: createMemoryHistory({ initialEntries: ["/"] }) });
  await act(async () => { await router.load(); root.render(<RouterProvider router={router} />); });
  await vi.waitFor(() => expect(container.textContent).toContain("Starts Here"));
});
