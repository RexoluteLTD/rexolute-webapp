import axios from "axios";

// VITE_API_BASE_URL is the backend origin; /api is appended exactly once.
const origin = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
export const publicApi = axios.create({
  baseURL: origin.endsWith("/api") ? origin : `${origin}/api`,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});
