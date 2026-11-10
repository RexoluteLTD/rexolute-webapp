import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
import type { DetailsMode } from "@rexolute/types";
const SessionDetails = lazyRouteComponent(() => import("../../../components/admin/sessions/details"));
const modes: DetailsMode[] = ["approve", "default", "reassign", "rescheduled "];
export const Route = createFileRoute("/_authenticated/sessions/details")({
  validateSearch: (search: Record<string, unknown>) => ({
    id: typeof search.id === "string" ? search.id : "",
    mode: modes.includes(search.mode as DetailsMode) ? search.mode as DetailsMode : "default",
  }),
  component: Details,
});
function Details() {
  const { mode } = Route.useSearch();
  return <SessionDetails mode={mode} />;
}
