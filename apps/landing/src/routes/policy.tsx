import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
export const Route = createFileRoute("/policy")({ component: lazyRouteComponent(() => import("../pages/policy")) });
