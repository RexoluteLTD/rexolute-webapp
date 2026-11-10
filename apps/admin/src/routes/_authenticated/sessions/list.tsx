import { createFileRoute } from "@tanstack/react-router";
import { lazyRouteComponent } from "@tanstack/react-router";
const SessionList = lazyRouteComponent(() => import("../../../components/admin/sessions/list"));
export const Route = createFileRoute("/_authenticated/sessions/list")({ component: () => <SessionList mode="total" therapists={[]} /> });
