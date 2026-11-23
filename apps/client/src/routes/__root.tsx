import { createRootRoute, Outlet } from "@tanstack/react-router";
import { NotFound } from "@rexolute/ui/not-found";
export const Route = createRootRoute({ component: Outlet, notFoundComponent: NotFound });
