import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { AuthProvider } from "@rexolute/auth/provider";
import "@rexolute/ui/styles.css";
import { router } from "./router";

createRoot(document.getElementById("root")!).render(
  <StrictMode><AuthProvider><RouterProvider router={router} /></AuthProvider></StrictMode>,
);
