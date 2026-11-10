import axios from "axios";

// Resolve against the current app origin; Traefik forwards this prefix to the backend.
export const publicApi = axios.create({
  baseURL: "/api/v1/",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});
