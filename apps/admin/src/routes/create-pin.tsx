import { createFileRoute } from "@tanstack/react-router";
import CreatePINForm from "../components/forms/pin";
import AuthLayout from "../components/layout/auth";
import { validateAuthSearch } from "../lib/auth-search";
export const Route = createFileRoute("/create-pin")({
  component: () => <AuthLayout title="Create pin"><CreatePINForm /></AuthLayout>,
  validateSearch: validateAuthSearch,
});
