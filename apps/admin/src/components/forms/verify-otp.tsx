import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { parseAxiosError } from "@rexolute/api";
import { getLoginChallenge, resendLoginChallenge, verifyAdminLoginChallenge } from "@rexolute/api/session";
import { safeReturnTo } from "@rexolute/auth/guard";
import { Button } from "@rexolute/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@rexolute/ui/input-otp";
import { challengeTiming } from "../../lib/login-challenge";

type ChallengeTiming = ReturnType<typeof challengeTiming>;

function ChallengeForm({ id, redirect, initialChallenge }: {
  id: string;
  redirect: string | undefined;
  initialChallenge: ChallengeTiming | undefined;
}) {
  const router = useRouter();
  const [challenge, setChallenge] = useState(initialChallenge);
  const [checking, setChecking] = useState(!initialChallenge);
  const [now, setNow] = useState(Date.now);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [action, setAction] = useState<"verify" | "resend" | null>(null);
  const request = useRef<AbortController | null>(null);

  useEffect(() => {
    if (action) return;

    const controller = new AbortController();
    let timeout: ReturnType<typeof setTimeout>;
    async function checkDelivery() {
      try {
        const next = challengeTiming(await getLoginChallenge(id, controller.signal));
        if (controller.signal.aborted) return;
        setNow(Date.now());
        setChallenge(next);
        if (next.deliveryStatus === "queued" && next.expiresAt > Date.now()) {
          timeout = setTimeout(checkDelivery, 3000);
        }
      } catch {
        // Status is advisory. The verification and resend endpoints enforce the challenge.
      } finally {
        if (!controller.signal.aborted) setChecking(false);
      }
    }
    void checkDelivery();
    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [id, action]);

  const expiresAt = challenge?.expiresAt ?? Infinity;
  const resendAt = challenge?.resendAt ?? 0;
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => {
      clearInterval(interval);
      request.current?.abort();
    };
  }, []);

  const expired = now >= expiresAt;
  const countdown = Math.max(0, Math.ceil((resendAt - now) / 1000));
  const canVerify = /^\d{6}$/.test(code) && !expired && !action;
  const canResend = !checking && countdown === 0 && !action;

  async function performAction(name: "verify" | "resend", run: (signal: AbortSignal) => Promise<void>) {
    if (request.current) return;
    const controller = new AbortController();
    request.current = controller;
    setAction(name);
    setError("");
    try {
      await run(controller.signal);
    } catch (cause) {
      if (!controller.signal.aborted) setError(parseAxiosError(cause).message);
    } finally {
      request.current = null;
      if (!controller.signal.aborted) setAction(null);
    }
  }

  function handleVerify(event: FormEvent) {
    event.preventDefault();
    if (!canVerify) return;
    void performAction("verify", async (signal) => {
      await verifyAdminLoginChallenge(id, code, signal);
      if (!signal.aborted) await router.navigate({ to: safeReturnTo(redirect), replace: true });
    });
  }

  function handleResend() {
    if (!canResend) return;
    void performAction("resend", async (signal) => {
      const response = await resendLoginChallenge(id, signal);
      if (signal.aborted) return;
      const next = response ? challengeTiming(response) : undefined;
      if (next && next.id !== id) {
        await router.navigate({
          to: "/verify-otp",
          search: { challenge_id: next.id, redirect },
          state: { loginChallenge: next },
          replace: true,
        });
        return;
      }
      setCode("");
      setChallenge(next);
      setChecking(!next);
      setNow(Date.now());
    });
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">Check your email</h1>
        <p className="text-muted-foreground">Enter the six-digit verification code for your admin account.</p>
        <p role="status" className="text-sm text-muted-foreground">
          {expired ? "This code has expired." : challenge?.deliveryStatus === "queued" ? "Your code is queued for delivery." : ""}
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleVerify}>
        <div className="space-y-2">
          <div className="relative flex justify-center">
            <InputOTP
              aria-label="Verification code"
              autoComplete="one-time-code"
              pattern="[0-9]*"
              maxLength={6}
              value={code}
              onChange={setCode}
              disabled={!!action || expired}
            >
              <InputOTPGroup>
                {Array.from({ length: 6 }, (_, index) => <InputOTPSlot key={index} index={index} />)}
              </InputOTPGroup>
            </InputOTP>
          </div>
          {error && <p role="alert" className="text-center text-sm text-red-500">{error}</p>}

          <div className="space-y-1 text-center text-sm">
            <p className="text-muted-foreground">Didn’t receive a code?</p>
            <Button
              variant="link"
              type="button"
              className="h-auto p-0 text-[#f47425]"
              onClick={handleResend}
              disabled={!canResend}
            >
              {action === "resend" ? "Requesting code…" : countdown > 0 ? `Resend code in ${countdown}s` : "Resend code"}
            </Button>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full rounded-full bg-[#2E8902] text-white hover:bg-[#2E8902]/80"
          disabled={!canVerify}
        >
          {action === "verify" ? "Verifying…" : "Verify code"}
        </Button>
      </form>

      <div className="text-center text-sm">
        <Link to="/login" search={{ redirect }} className="font-medium text-[#f47425] hover:underline">
          Go back to login
        </Link>
      </div>
    </div>
  );
}

export default function VerifyOTPForm({ challengeId, redirect, initialChallenge }: {
  challengeId: string | undefined;
  redirect: string | undefined;
  initialChallenge?: ChallengeTiming;
}) {
  if (challengeId) {
    return (
      <ChallengeForm
        key={challengeId}
        id={challengeId}
        redirect={redirect}
        initialChallenge={initialChallenge?.id === challengeId ? initialChallenge : undefined}
      />
    );
  }

  return (
    <div className="space-y-4 text-center">
      <h1 className="text-3xl font-semibold tracking-tight">Verification unavailable</h1>
      <p className="text-muted-foreground">Sign in to request a verification code.</p>
      <Link to="/login" search={{ redirect }} className="font-medium text-[#f47425] hover:underline">
        Go back to login
      </Link>
    </div>
  );
}
