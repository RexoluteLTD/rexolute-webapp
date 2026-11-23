import { createFileRoute } from "@tanstack/react-router";
import { lazyRouteComponent } from "@tanstack/react-router";
export const Route = createFileRoute("/_authenticated/therapists/")({ component: lazyRouteComponent(() => import("../../../pages/therapists/index")) });
