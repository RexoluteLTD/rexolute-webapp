import { createFileRoute } from "@tanstack/react-router";
import { ProtectedOutlet, requireRole } from "@rexolute/auth/guard";
import Layout from "../../components/admin/layout/dashboard";
export const Route = createFileRoute("/_authenticated")({ beforeLoad: ({ location }) => requireRole("admin", "/login", location.href), component: () => <Layout><ProtectedOutlet role="admin" login="/login" /></Layout> });
