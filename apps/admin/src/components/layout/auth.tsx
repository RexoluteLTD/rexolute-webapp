import { type ReactNode } from "react";
import { appUrls } from "@rexolute/utils/app-urls";
import Head from "@rexolute/ui/head";

export default function AuthLayout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <>
      <Head title={title} />

      <div className="flex min-h-screen">
        {/* Left side - Green background with illustration */}
        <div className="hidden w-1/3 flex-col bg-[#205406] p-8 md:flex">
          <div className="flex flex-col items-center gap-6 my-8">
            <a href={appUrls.landing}>
              <img
                src="/svg/logos/white.svg"
                alt="Rexolute Logo"
                width={140}
                height={40}
              />
            </a>
            <h2 className="text-xl font-medium text-white">ADMIN PORTAL</h2>
          </div>

          <div className="flex flex-1 ">
            <img
              src="/svg/admin-cuate.svg"
              alt="Admin Portal Illustration"
              width={500}
              height={500}
            />
          </div>
        </div>

        <div className="flex-1 flex w-full flex-col items-center justify-center p-8">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </>
  );
}
