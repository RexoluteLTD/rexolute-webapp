import { createFileRoute } from "@tanstack/react-router";
import { ProtectedOutlet, requireRole } from "@rexolute/auth/guard";
export const Route = createFileRoute("/_authenticated")({ beforeLoad: ({ location }) => requireRole("client", "/login", location.href), component: () => <ProtectedOutlet role="client" login="/login" /> });
