import { createFileRoute } from "@tanstack/react-router";
import { lazyRouteComponent } from "@tanstack/react-router";
export const Route = createFileRoute("/_authenticated/settings/")({ component: lazyRouteComponent(() => import("../../../pages/settings/index")) });
