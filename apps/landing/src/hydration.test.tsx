import { act, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { createRouter, createMemoryHistory, RouterProvider } from "@tanstack/react-router";
import { expect, it, vi } from "vitest";
import { routeTree } from "./routeTree.gen";
import { renderPage } from "./prerender";
import { prepareLandingRouter } from "./lib/hydration";
Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
it.each(["/", "/about-us", "/contact-us", "/privacy", "/policy", "/terms-condition", "/missing"])("hydrates %s without replacing its HTML", async (path) => {
  vi.spyOn(window, "scrollTo").mockImplementation(() => {});
  const container = document.createElement("div");
  container.innerHTML = await renderPage(path === "/missing" ? "/404" : path);
  document.body.append(container);
  const heading = container.querySelector("h1");
  const router = createRouter({ routeTree, history: createMemoryHistory({ initialEntries: [path] }), isServer: false, scrollRestoration: true });
  await prepareLandingRouter(router, true);
  const errors: string[] = [];
  let root: ReturnType<typeof hydrateRoot> | undefined;
  try {
    await act(async () => { root = hydrateRoot(container, <StrictMode><RouterProvider router={router} /></StrictMode>, { onRecoverableError: (error) => { errors.push(String(error)); } }); });
    expect(errors).toEqual([]);
    expect(container.querySelector("h1")).toBe(heading);
  } finally { await act(async () => root?.unmount()); container.remove(); }
});
