import { createFileRoute } from "@tanstack/react-router";
import { lazyRouteComponent } from "@tanstack/react-router";
export const Route = createFileRoute("/_authenticated/sessions/")({ component: lazyRouteComponent(() => import("../../../pages/sessions/index")) });
