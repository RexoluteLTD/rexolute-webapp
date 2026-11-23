import { AxiosError, type AxiosResponse } from "axios";
import { describe, expect, it } from "vitest";
import { parseAxiosError } from "./error";

function failure(data: unknown, status = 400) {
  return new AxiosError("Request failed", "ERR_BAD_REQUEST", undefined, undefined, { data, status } as AxiosResponse);
}

describe("API error normalization", () => {
  it.each([
    [{ error: { code: "INVALID_CREDENTIALS", message: "Invalid email or password" } }, "Invalid email or password"],
    [{ message: { code: "INVALID_INPUT", message: "Check your details" } }, "Check your details"],
    [{ error: "Invalid code" }, "Invalid code"],
    [{ message: "Please try again" }, "Please try again"],
    [{ message: ["Email is required", "Password is required"] }, "Email is required; Password is required"],
    [{ message: { unknown: "not a message" }, error: { message: "Fallback detail" } }, "Fallback detail"],
    [{ error: { code: "UNKNOWN" } }, "Something went wrong"],
    [{ message: 42, error: false }, "Something went wrong"],
    [null, "Something went wrong"],
  ])("extracts safe display text from %j", (data, expected) => {
    expect(parseAxiosError(failure(data)).message).toBe(expected);
  });

  it("preserves the HTTP status, nested code and normalized validation errors", () => {
    expect(parseAxiosError(failure({ error: { code: "INVALID_INPUT", message: "Invalid input", errors: {
      email: [{ code: "INVALID_EMAIL", message: "Enter a valid email" }], name: "Name is required", ignored: [{}],
    } } }, 422))).toEqual({
      status: 422, code: "INVALID_INPUT", message: "Invalid input",
      errors: { email: ["Enter a valid email"], name: ["Name is required"] },
    });
  });

  it("handles cyclic or unknown response objects without returning them to React", () => {
    const error: Record<string, unknown> = {};
    error.message = error;
    expect(parseAxiosError(failure(error)).message).toBe("Something went wrong");
  });

  it("handles network and non-Axios failures", () => {
    expect(parseAxiosError(new AxiosError("Network error", "ERR_NETWORK"))).toMatchObject({ message: "Something went wrong", code: "ERR_NETWORK" });
    expect(parseAxiosError(new Error("Try again"))).toEqual({ message: "Try again" });
    expect(parseAxiosError({ message: {} })).toEqual({ message: "Unknown error occurred" });
  });
});
