import { createFileRoute } from "@tanstack/react-router";
import LoginForm from "../components/forms/login";
import AuthLayout from "../components/layout/auth";
import { validateLoginSearch } from "../lib/auth-search";
export const Route = createFileRoute("/login")({
  component: LoginPage,
  validateSearch: validateLoginSearch,
});

function LoginPage() {
  const search = Route.useSearch({ shouldThrow: false });
  if (!search) return null;

  return <AuthLayout title="Login"><LoginForm redirect={search.redirect} /></AuthLayout>;
}
