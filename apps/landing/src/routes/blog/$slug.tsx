import { createFileRoute, lazyRouteComponent, notFound } from "@tanstack/react-router";
import { findBlogPost } from "../../lib/blog";

export const Route = createFileRoute("/blog/$slug")({
  beforeLoad: ({ params }) => {
    const post = findBlogPost(params.slug);
    if (!post) throw notFound();
    return { post };
  },
  component: lazyRouteComponent(() => import("../../pages/blog/article")),
});
