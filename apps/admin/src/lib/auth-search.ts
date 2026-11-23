export function validateLoginSearch(search: Record<string, unknown>) {
  return { redirect: typeof search.redirect === "string" ? search.redirect : undefined };
}
export function validateAuthSearch(search: Record<string, unknown>) {
  return { ...validateLoginSearch(search), identity: typeof search.identity === "string" ? search.identity : "", provider: typeof search.provider === "string" ? search.provider : "email" };
}
