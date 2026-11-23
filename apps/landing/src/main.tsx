import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import "@rexolute/ui/styles.css";
import "./landing.css";
import { router } from "./router";
import { prepareLandingRouter } from "./lib/hydration";

const container = document.getElementById("root")!;
const app = <StrictMode><RouterProvider router={router} /></StrictMode>;
async function start() {
  await prepareLandingRouter(router, container.hasChildNodes());
  if (container.hasChildNodes()) hydrateRoot(container, app);
  else createRoot(container).render(app);
}
void start();
