import { createRootRoute, Outlet } from "@tanstack/react-router";
import Layout from "../components/home/layout";
import { NotFound } from "@rexolute/ui/not-found";
export const Route = createRootRoute({ component: () => <Layout><Outlet /></Layout>, notFoundComponent: NotFound });
