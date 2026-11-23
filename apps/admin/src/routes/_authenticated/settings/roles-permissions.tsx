import { createFileRoute } from "@tanstack/react-router";
import { lazyRouteComponent } from "@tanstack/react-router";
export const Route = createFileRoute("/_authenticated/settings/roles-permissions")({ component: lazyRouteComponent(() => import("../../../pages/settings/roles-permissions")) });
