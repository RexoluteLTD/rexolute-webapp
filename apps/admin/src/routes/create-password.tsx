import { createFileRoute } from "@tanstack/react-router";
import CreatePasswordForm from "../components/forms/password";
import AuthLayout from "../components/layout/auth";
import { validateAuthSearch } from "../lib/auth-search";
export const Route = createFileRoute("/create-password")({
  component: () => <AuthLayout title="Create password"><CreatePasswordForm /></AuthLayout>,
  validateSearch: validateAuthSearch,
});
