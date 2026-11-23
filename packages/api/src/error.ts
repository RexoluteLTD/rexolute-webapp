import { isAxiosError } from "axios";

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  errors?: Record<string, string[]>;
}

function record(value: unknown): Record<string, unknown> | undefined {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown> : undefined;
}

// Backend errors may wrap their human-readable text in { code, message }.
// Only return text to components; rendering a response object crashes React.
function message(value: unknown, depth = 0): string | undefined {
  if (typeof value === "string") return value.trim() || undefined;
  if (depth >= 5) return undefined;
  if (Array.isArray(value)) {
    const messages = value.map((item) => message(item, depth + 1)).filter((item): item is string => Boolean(item));
    return messages.length ? messages.join("; ") : undefined;
  }
  const object = record(value);
  return object ? message(object.message, depth + 1) ?? message(object.error, depth + 1) : undefined;
}

function fieldErrors(value: unknown): ApiError["errors"] {
  const object = record(value);
  if (!object) return undefined;
  const entries = Object.entries(object).flatMap(([field, errors]) => {
    const messages = (Array.isArray(errors) ? errors : [errors])
      .map((error) => message(error)).filter((error): error is string => Boolean(error));
    return messages.length ? [[field, messages] as const] : [];
  });
  return entries.length ? Object.fromEntries(entries) : undefined;
}

export function parseAxiosError(error: unknown): ApiError {
  if (isAxiosError<unknown>(error)) {
    const data = record(error.response?.data);
    const detail = record(data?.error) ?? record(data?.message);
    const code = data?.code ?? detail?.code ?? error.code;
    return {
      message: message(error.response?.data) ?? "Something went wrong",
      status: error.response?.status ?? error.status ?? 500,
      code: typeof code === "string" ? code : undefined,
      errors: fieldErrors(data?.errors ?? detail?.errors),
    };
  }
  return { message: error instanceof Error ? error.message : "Unknown error occurred" };
}
