import { useState } from "react";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { publicApi, parseAxiosError } from "@rexolute/api";
import { safeReturnTo } from "@rexolute/auth/guard";
import { verifyOtp } from "@rexolute/api/session";
import { Button } from "@rexolute/ui/button";
import { Input } from "@rexolute/ui/input";
import { Label } from "@rexolute/ui/label";
import { appUrls } from "@rexolute/utils/app-urls";

export default function Login() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { redirect?: string };
  const [identity, setIdentity] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"credentials" | "otp">("credentials");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true); setError("");
    try {
      if (step === "credentials") {
        await publicApi.post("/auth/signin", { email: identity, password });
        setPassword(""); setStep("otp");
      } else {
        await verifyOtp({ identity, code, provider: "email" }, "client");
        await navigate({ to: safeReturnTo(search.redirect) });
      }
    } catch (cause) { setError(parseAxiosError(cause).message); }
    finally { setBusy(false); }
  }
  return <main className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
    <title>Client login | Rexolute</title>
    <div className="w-full max-w-md space-y-6 rounded-xl border bg-white p-8 shadow-sm">
      <a href={appUrls.landing}><img src="/svg/logos/green.svg" alt="Rexolute" width="140" /></a>
      <h1 className="text-2xl font-semibold">{step === "credentials" ? "Client login" : "Verify your email"}</h1>
      <p className="text-sm text-gray-600">{step === "credentials" ? "Sign in to your Rexolute account." : `Enter the verification code sent to ${identity}.`}</p>
      <form onSubmit={submit} className="space-y-4">
        {step === "credentials" ? <>
          <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" autoComplete="email" value={identity} onChange={(event) => setIdentity(event.target.value)} required /></div>
          <div className="space-y-2"><Label htmlFor="password">Password</Label><Input id="password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={8} required /></div>
        </> : <div className="space-y-2"><Label htmlFor="code">Verification code</Label><Input id="code" inputMode="numeric" autoComplete="one-time-code" value={code} onChange={(event) => setCode(event.target.value)} required /></div>}
        {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
        <Button type="submit" disabled={busy} className="w-full">{busy ? "Please wait…" : step === "credentials" ? "Continue" : "Sign in"}</Button>
        {step === "otp" && <Button type="button" variant="ghost" onClick={() => { setStep("credentials"); setCode(""); setError(""); }}>Use another account</Button>}
      </form>
      <Link to="/" className="text-sm underline">Back to client home</Link>
    </div>
  </main>;
}
