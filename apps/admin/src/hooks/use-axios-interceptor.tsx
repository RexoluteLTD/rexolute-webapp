import { ApiClient } from "@rexolute/api";

// Interceptors are installed once on the shared client, not per mounted screen.
export function useAxiosInterceptors() { return ApiClient; }
