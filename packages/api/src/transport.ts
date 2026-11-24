import axios from "axios";

// Only the local Vite dev server can override the same-origin deployment route.
const localApiUrl = import.meta.env.DEV ? import.meta.env.VITE_LOCAL_API_URL?.trim() : undefined;

export const publicApi = axios.create({
  baseURL: localApiUrl || "/v1/",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});
