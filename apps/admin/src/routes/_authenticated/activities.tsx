import { createFileRoute } from "@tanstack/react-router";
import { lazyRouteComponent } from "@tanstack/react-router";
export const Route = createFileRoute("/_authenticated/activities")({ component: lazyRouteComponent(() => import("../../pages/activities")) });
