import { createFileRoute } from "@tanstack/react-router";
import { lazyRouteComponent } from "@tanstack/react-router";
export const Route = createFileRoute("/_authenticated/therapists/verification/education")({ component: lazyRouteComponent(() => import("../../../../pages/therapists/verification/education/page")) });
