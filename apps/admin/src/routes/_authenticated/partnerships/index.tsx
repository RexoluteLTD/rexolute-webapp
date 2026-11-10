import { createFileRoute } from "@tanstack/react-router";
import { lazyRouteComponent } from "@tanstack/react-router";
export const Route = createFileRoute("/_authenticated/partnerships/")({ component: lazyRouteComponent(() => import("../../../pages/partnerships/index")) });
