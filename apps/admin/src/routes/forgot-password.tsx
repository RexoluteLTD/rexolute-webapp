import { createFileRoute } from "@tanstack/react-router";
import AuthPage from "../pages/auth";
import { validateAuthSearch } from "../lib/auth-search";
export const Route = createFileRoute("/forgot-password")({ component: AuthPage, validateSearch: validateAuthSearch });
