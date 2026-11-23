import { Navigate, Outlet, redirect, useLocation } from "@tanstack/react-router";
import { useContext } from "react";
import { AuthContext } from "./provider";
import { getValidSession } from "@rexolute/api/session";
import type { Role } from "@rexolute/types";

// Navigation protection only. Backend endpoints must enforce authorization.
export async function requireRole(role: Role, login: string, href: string) {
  const session = await getValidSession();
  if (!session || session.user.role !== role) throw redirect({ to: login, search: { redirect: href } });
}
export function ProtectedOutlet({ role, login }: { role: Role; login: string }) {
  const auth = useContext(AuthContext);
  const href = useLocation({ select: (location) => location.href });
  if (!auth) throw new Error("ProtectedOutlet must be used inside AuthProvider");
  const { session } = auth;
  return session?.user.role === role ? <Outlet /> : <Navigate to={login} search={{ redirect: href }} replace />;
}
export function safeReturnTo(value: unknown, fallback = "/") {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//") || /[\\\r\n]/.test(value)) return fallback;
  try {
    const target = new URL(value, "https://rexolute.invalid");
    return target.origin === "https://rexolute.invalid" ? `${target.pathname}${target.search}${target.hash}` : fallback;
  } catch { return fallback; }
}
