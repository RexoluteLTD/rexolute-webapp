import { createRootRoute, Outlet } from "@tanstack/react-router";
import Layout from "../components/home/layout";
import { LandingNotFound } from "../components/not-found";
export const Route = createRootRoute({ component: () => <Layout><Outlet /></Layout>, notFoundComponent: LandingNotFound });
