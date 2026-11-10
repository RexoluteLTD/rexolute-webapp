import { useAuth } from "../hooks/use-auth";
import { Button } from "@rexolute/ui/button";
import { appUrls } from "@rexolute/utils/app-urls";

export default function Dashboard() {
  const { session, signOut } = useAuth();
  return <div className="min-h-screen bg-gray-50">
    <title>Client dashboard | Rexolute</title>
    <header className="flex items-center justify-between border-b bg-white px-6 py-4"><a href={appUrls.landing}><img src="/svg/logos/green.svg" alt="Rexolute" width="140" /></a><Button variant="outline" onClick={signOut}>Log out</Button></header>
    <main className="mx-auto max-w-4xl space-y-6 p-6 py-12"><h1 className="text-3xl font-semibold">Welcome to Rexolute</h1><p className="text-gray-600">Signed in as {session?.user.email || "client"}.</p><section className="rounded-xl border bg-white p-8"><h2 className="text-xl font-semibold">Your client dashboard is coming soon</h2><p className="mt-3 text-gray-600">Your sessions, therapist appointments, and account tools will appear here as they become available.</p></section></main>
  </div>;
}
