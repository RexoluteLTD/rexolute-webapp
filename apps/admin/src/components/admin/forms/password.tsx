

import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@rexolute/ui/button";
import { Input } from "@rexolute/ui/input";
import { Label } from "@rexolute/ui/label";
import { useRouter, useSearch } from "@tanstack/react-router";

import { z } from "zod";

// Define Zod schema for password validation
const passwordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[0-9]/, {
        message: "Password must contain at least one number",
      })
      .regex(/[^A-Za-z0-9]/, {
        message: "Password must contain at least one special character",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // Set error on confirmPassword field
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

const CreatePasswordForm = () => {
  const router = useRouter();
  const query = useSearch({ strict: false });
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // Use an object to store errors for each field
  const [errors, setErrors] =
    useState<z.ZodFormattedError<PasswordFormData> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors(null); // Clear previous errors

    const validationResult = passwordSchema.safeParse({
      password,
      confirmPassword,
    });

    if (!validationResult.success) {
      setErrors(validationResult.error.format());
      setIsLoading(false);
      return;
    }

    // If validation is successful, proceed with your logic



    try {
      // Add your password creation logic here
      // For example, make an API call to save the password
      // await api.createPassword({ token: query.token, password: validationResult.data.password });
      router.navigate({ to: "/" }); // Or a success page
    } catch (error) {
      // Handle API errors
      // For now, setting a generic error
      setErrors({
        _errors: ["An error occurred. Please try again."],
        password: undefined,
        confirmPassword: undefined,
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">
          Create password
        </h1>
        <p className="text-muted-foreground">
          Kindly enter your password to complete sign up
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="***********"
              className={`pr-10 ${errors?.password ? "border-red-500" : ""}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors?.password?._errors && (
            <p className="text-sm text-red-500">
              {errors.password._errors.join(", ")}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="***********"
              className={`pr-10 ${
                errors?.confirmPassword ? "border-red-500" : ""
              }`}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors?.confirmPassword?._errors && (
            <p className="text-sm text-red-500">
              {errors.confirmPassword._errors.join(", ")}
            </p>
          )}
        </div>
        {errors?._errors && errors._errors.length > 0 && (
          <p className="text-sm text-red-500 text-center">
            {errors._errors.join(", ")}
          </p>
        )}

        <Button
          type="submit"
          className="rounded-full w-full bg-[#2E8902] text-white hover:bg-[#2E8902]/80"
          disabled={isLoading || errors !== null}
        >
          {isLoading ? "Submitting..." : "Submit"}
        </Button>

        <div className="text-center text-sm">
          <span>Already have an account? </span>
          <Link
            to="/login"
            className="font-medium text-[#f47425] hover:underline"
          >
            Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default CreatePasswordForm;
