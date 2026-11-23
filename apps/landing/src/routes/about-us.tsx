import { createFileRoute } from "@tanstack/react-router";
import { lazyRouteComponent } from "@tanstack/react-router";
export const Route = createFileRoute("/about-us")({ component: lazyRouteComponent(() => import("../pages/about-us")) });
