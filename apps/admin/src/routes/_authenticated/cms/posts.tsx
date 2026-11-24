import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
export const Route = createFileRoute("/_authenticated/cms/posts")({
  component: lazyRouteComponent(() => import("../../../components/pages/cms/posts")),
});
