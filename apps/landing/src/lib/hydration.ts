import type { AnyRouter } from "@tanstack/react-router";

export async function prepareLandingRouter(router: AnyRouter, hasPrerenderedContent: boolean) {
  // These static routes have no loader data to dehydrate. Preserve the SSR
  // boundary layout so React can hydrate rather than replace the existing HTML.
  if (hasPrerenderedContent) router.ssr = { manifest: undefined };
  await router.load();
}
