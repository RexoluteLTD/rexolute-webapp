import { createFileRoute } from "@tanstack/react-router";
import { lazyRouteComponent } from "@tanstack/react-router";
export const Route = createFileRoute("/_authenticated/reports/")({ component: lazyRouteComponent(() => import("../../../pages/reports/index")) });
