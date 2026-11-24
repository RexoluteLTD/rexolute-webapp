import { createFileRoute } from "@tanstack/react-router";
import AuthPage from "../components/pages/auth";
import { validateAuthSearch } from "../lib/auth-search";
export const Route = createFileRoute("/create-password")({
  component: AuthPage,
  validateSearch: validateAuthSearch,
});
