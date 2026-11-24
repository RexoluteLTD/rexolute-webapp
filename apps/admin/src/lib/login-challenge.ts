import type { LoginChallenge } from "@rexolute/types";

export function challengeTiming(challenge: LoginChallenge) {
  return {
    id: challenge.challenge_id,
    deliveryStatus: challenge.delivery_status,
    expiresAt: Date.parse(challenge.expires_at),
    resendAt: Date.now() + challenge.resend_after_seconds * 1000,
  };
}

declare module "@tanstack/react-router" {
  interface HistoryState {
    loginChallenge?: ReturnType<typeof challengeTiming>;
  }
}
