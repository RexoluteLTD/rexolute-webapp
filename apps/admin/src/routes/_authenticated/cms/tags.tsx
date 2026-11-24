import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/cms/tags")({
  component: lazyRouteComponent(() => import("../../../components/pages/cms/categories"), "TagsPage"),
});
