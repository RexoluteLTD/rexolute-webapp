import { useLocation, useSearch } from "@tanstack/react-router";
import { AdminAuthLayout } from "../components/admin/layout";

export default function AuthPage() {
  const pathname = useLocation({ select: (location) => location.pathname });
  const query = useSearch({ strict: false });
  const slug = pathname.split("/").pop() || "login";
  const titles: Record<string, string> = { login: "Login", "verify-otp": "Verify OTP", "forgot-password": "Forgot password", "create-password": "Create password", "create-pin": "Create pin" };
  return <AdminAuthLayout slug={slug} query={query} title={titles[slug] || "Login"} />;
}
