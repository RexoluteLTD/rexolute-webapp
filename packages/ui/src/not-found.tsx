import { Link } from "@tanstack/react-router";
export function NotFound() {
  return <main className="mx-auto max-w-lg p-12 text-center"><title>Page not found | Rexolute</title><h1 className="text-2xl font-semibold">Page not found</h1><p className="my-4">The page you requested does not exist.</p><Link to="/" className="underline">Return home</Link></main>;
}
