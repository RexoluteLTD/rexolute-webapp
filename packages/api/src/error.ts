// src/lib/api/parseError.ts
import axios, { AxiosError } from "axios";

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  errors?: Record<string, string[]>;
}

export function parseAxiosError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const axiosErr = error as AxiosError<any>;

    return {
      message:
        axiosErr.response?.data?.message ||
        axiosErr.response?.data?.error ||
        "Something went wrong",

      status: axiosErr.response?.status || axiosErr.status || 500,
      code: axiosErr.response?.data?.code ?? axiosErr.code,
      errors:
        axiosErr.response?.data?.errors,
    };
  }

  // Not Axios → generic error
  return {
    message: error instanceof Error ? error.message : "Unknown error occurred",
  };
}
