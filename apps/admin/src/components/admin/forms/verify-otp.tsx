

import { useState, useEffect, FC } from "react"; // Import useEffect
import { useRouter } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";

import { verifyOtp } from "@rexolute/api/session";
import { safeReturnTo } from "@rexolute/auth/guard";
import { parseAxiosError } from "@rexolute/api";
import { useSearch } from "@tanstack/react-router";

import { Button } from "@rexolute/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@rexolute/ui/input-otp";

const RESEND_INTERVAL = 30; // Countdown time in seconds

const VerifyOTPForm: FC<{ provider: string; identity: string }> = ({
  provider,
  identity,
}) => {
  const router = useRouter();
  const [otp, setOtp] = useState<string>("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(RESEND_INTERVAL);
  const [resendDisabled, setResendDisabled] = useState(true);
  const email = identity;
  const search = useSearch({ strict: false }) as { redirect?: string };

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (resendDisabled && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      setResendDisabled(false);
      if (timer) clearInterval(timer);
    }

    // Cleanup function to clear interval on component unmount or when timer stops
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [resendDisabled, countdown]);

  const handleResend = async () => {
    if (resendDisabled) return; // Prevent resend if already disabled

    console.log("Resending OTP...");
    // Add logic here to call the API to resend the OTP
    try {
      setError(""); // Clear previous errors
    } catch (resendError) {
      setError("Failed to resend OTP. Please try again.");
      // Reset timer
      setResendDisabled(true);
      setCountdown(RESEND_INTERVAL);
      return; // Stop if resend fails
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");


    try {
      await verifyOtp({ code: otp, identity: email, provider }, "admin");
      await router.navigate({ to: safeReturnTo(search.redirect) });
    } catch (error) {
      // setIsLoading(false);
      setError(parseAxiosError(error).message);
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* ... header section ... */}
      <div className="space-y-2 text-center">
        {/* ... Image, h1, p ... */}
        <img
          className="mx-auto hidden" // Consider removing 'hidden' if the image should be visible
          src="/svg/locks.svg"
          alt="Rexolute Logo"
          width={140}
          height={40}
        />
        <h1 className="text-3xl font-semibold tracking-tight">
          Check your email
        </h1>
        <p className="text-muted-foreground">
          {/* Consider making the email dynamic */}
          Enter OTP send to your email “{email}”
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <div className="relative flex justify-center">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(value) => setOtp(value)}
            >
              {/* ... InputOTPGroup and InputOTPSlots ... */}

              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTP>
          </div>
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <div className="text-center text-sm space-y-1">
            <p className="text-muted-foreground">Didn’t receive a code?</p>
            <Button
              variant="link"
              type="button"
              className={`p-0 h-auto ${
                resendDisabled
                  ? "text-muted-foreground cursor-not-allowed"
                  : "text-[#f47425]"
              }`}
              onClick={handleResend} // Add onClick handler
              disabled={resendDisabled} // Disable button based on state
            >
              {resendDisabled
                ? `Re-send code in ${countdown}s`
                : "Re-send code"}
            </Button>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-[#2E8902] text-white hover:bg-[#2E8902]/80 rounded-full"
          disabled={isLoading || otp.length !== 6}
        >
          {isLoading ? "Verifying..." : "Submit"}
        </Button>

        <div className="text-center text-sm ">
          <Link
            to="/login"
            className="font-medium text-[#f47425] hover:underline"
          >
            Go back to login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default VerifyOTPForm;
