import { createFileRoute } from "@tanstack/react-router";
import AuthPage from "../pages/auth";
import { validateLoginSearch } from "../lib/auth-search";
export const Route = createFileRoute("/login")({ component: AuthPage, validateSearch: validateLoginSearch });
