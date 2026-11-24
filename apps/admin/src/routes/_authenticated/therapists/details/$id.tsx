import { createFileRoute } from "@tanstack/react-router";
import { lazyRouteComponent } from "@tanstack/react-router";
export const Route = createFileRoute("/_authenticated/therapists/details/$id")({
  component: lazyRouteComponent(
    () => import("../../../../components/pages/therapists/details/[id]"),
  ),
});
