import { createFileRoute } from "@tanstack/react-router";
import { lazyRouteComponent } from "@tanstack/react-router";
export const Route = createFileRoute("/contact-us")({ component: lazyRouteComponent(() => import("../pages/contact-us")) });
