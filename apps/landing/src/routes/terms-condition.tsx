import { createFileRoute } from "@tanstack/react-router";
import { lazyRouteComponent } from "@tanstack/react-router";
export const Route = createFileRoute("/terms-condition")({ component: lazyRouteComponent(() => import("../pages/terms-condition")) });
