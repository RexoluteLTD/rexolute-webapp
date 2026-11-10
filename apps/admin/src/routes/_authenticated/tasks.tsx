import { createFileRoute } from "@tanstack/react-router";
import { lazyRouteComponent } from "@tanstack/react-router";
export const Route = createFileRoute("/_authenticated/tasks")({ component: lazyRouteComponent(() => import("../../pages/tasks")) });
