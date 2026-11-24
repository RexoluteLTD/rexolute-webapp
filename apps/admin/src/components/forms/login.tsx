import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Eye, EyeOff, InfoIcon } from "lucide-react";
import { useRouter } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@rexolute/ui/button";
import { Label } from "@rexolute/ui/label";
import { Input } from "@rexolute/ui/input";
import { publicApi, parseAxiosError } from "@rexolute/api";
import type { LoginChallenge } from "@rexolute/types";
import { challengeTiming } from "../../lib/login-challenge";

import { cn } from "@rexolute/utils";

const schema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

type FormSchema = z.infer<typeof schema>;

const LoginForm = ({ redirect }: { redirect: string | undefined }) => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    setError,
  } = useForm<FormSchema>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: FormSchema) {
    try {
      const response = await publicApi.post<{ data: LoginChallenge }>("/auth/signin", values);
      const challenge = response.data?.data;
      if (!challenge?.challenge_id) throw new Error("Sign-in did not return a verification challenge.");

      await router.navigate({
        to: "/verify-otp",
        search: { challenge_id: challenge.challenge_id, redirect },
        state: { loginChallenge: challengeTiming(challenge) },
      });
    } catch (error) {
      setError("email", { type: "custom", message: parseAxiosError(error).message }, { shouldFocus: true });
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">Login</h1>
        <p className="text-muted-foreground">
          Kindly fill in your email address
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Input
              id="email"
              type={"email"}
              placeholder="someone@mail.com"
              className="pr-10"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">
                <InfoIcon width={14} height={14} className="inline mr-1" />
                <span>{errors.email.message}</span>
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="***********"
              className="pr-10"
              {...register("password")}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>

            {errors.password && (
              <p className="text-sm text-red-500 mt-1">
                <InfoIcon width={12} height={12} className="inline mr-1" />
                <span>{errors.password.message}</span>
              </p>
            )}
          </div>
          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-[#f47425] hover:underline"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <Button
          type="submit"
          disabled={!isValid || isSubmitting}
          className={cn(
            "w-full rounded-full text-white",
            isValid
              ? "bg-primary hover:bg-[#2E8902]/80"
              : "bg-[#8ec3b9]  hover:bg-[#7ab3a9]"
          )}
        >
          {isSubmitting ? "Login..." : "Login"}
        </Button>

        <div className="text-center text-sm hidden">
          Don&apos;t have an account?{" "}
          <Link
            to="/signup"
            className="font-medium text-[#f47425] hover:underline"
          >
            Sign up
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
