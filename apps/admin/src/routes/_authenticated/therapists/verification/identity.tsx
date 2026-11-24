import { createFileRoute } from "@tanstack/react-router";
import { lazyRouteComponent } from "@tanstack/react-router";
export const Route = createFileRoute(
  "/_authenticated/therapists/verification/identity",
)({
  component: lazyRouteComponent(
    () =>
      import("../../../../components/pages/therapists/verification/identity/page"),
  ),
});
