import { createFileRoute, lazyRouteComponent, notFound } from "@tanstack/react-router";
import { articleIdPattern } from "../../lib/blog";

export const Route = createFileRoute("/blog/$slug")({
  beforeLoad: ({ params }) => {
    if (!articleIdPattern.test(params.slug)) throw notFound();
  },
  component: lazyRouteComponent(() => import("../../pages/blog/article")),
});
