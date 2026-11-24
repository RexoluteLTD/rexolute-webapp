import { createFileRoute, useLocation } from "@tanstack/react-router";
import VerifyOTPForm from "../components/forms/verify-otp";
import AuthLayout from "../components/layout/auth";
import { validateOtpSearch } from "../lib/auth-search";
export const Route = createFileRoute("/verify-otp")({
  component: VerifyOTPPage,
  validateSearch: validateOtpSearch,
});

function VerifyOTPPage() {
  const search = Route.useSearch({ shouldThrow: false });
  const initialChallenge = useLocation({ select: (location) => location.state.loginChallenge });
  if (!search) return null;

  return (
    <AuthLayout title="Verify OTP">
      <VerifyOTPForm challengeId={search.challenge_id} redirect={search.redirect} initialChallenge={initialChallenge} />
    </AuthLayout>
  );
}
