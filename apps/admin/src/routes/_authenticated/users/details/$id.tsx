import { createFileRoute } from "@tanstack/react-router";
import { lazyRouteComponent } from "@tanstack/react-router";
export const Route = createFileRoute("/_authenticated/users/details/$id")({ component: lazyRouteComponent(() => import("../../../../pages/users/details/[id]")) });
