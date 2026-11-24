import { createFileRoute } from "@tanstack/react-router";
import ForgotPasswordForm from "../components/forms/forgot";
import AuthLayout from "../components/layout/auth";
import { validateAuthSearch } from "../lib/auth-search";
export const Route = createFileRoute("/forgot-password")({
  component: () => <AuthLayout title="Forgot password"><ForgotPasswordForm /></AuthLayout>,
  validateSearch: validateAuthSearch,
});
