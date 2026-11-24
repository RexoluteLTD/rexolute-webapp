import React, { Fragment } from "react";
import { Activity, BellDot, Clock3, Sparkles } from "lucide-react";

import Head from "@rexolute/ui/head";
import { Button } from "@rexolute/ui/button";

const Page = () => {
  return (
    <Fragment>
      <Head title="Activities" />

      <div className="p-6">
        <section className="relative overflow-hidden rounded-[28px] border border-emerald-100 bg-[linear-gradient(135deg,#f7faf7_0%,#eef7f0_42%,#fdfdf8_100%)] px-6 py-8 shadow-sm md:px-10 md:py-12">
          <div className="absolute -right-16 top-0 h-40 w-40 rounded-full bg-emerald-200/30 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-lime-200/20 blur-3xl" />

          <div className="relative flex flex-col gap-8">
            <div className="flex flex-col gap-4 md:max-w-2xl">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
                <Sparkles className="h-3.5 w-3.5" />
                Coming Soon
              </div>

              <div className="space-y-3">
                <h1 className="font-onest text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
                  Activities is on the way
                </h1>
                <p className="max-w-xl text-sm leading-6 text-slate-600 md:text-base">
                  We are preparing a dedicated workspace for audit trails,
                  operational events, and review history so admins can track
                  platform activity from one place.
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-white/70 bg-white/85 p-5 shadow-sm backdrop-blur">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                  <Activity className="h-5 w-5" />
                </div>
                <h2 className="text-sm font-semibold text-slate-900">
                  Activity timeline
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  A chronological feed of key admin actions, approvals, and
                  system events.
                </p>
              </div>

              <div className="rounded-2xl border border-white/70 bg-white/85 p-5 shadow-sm backdrop-blur">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
                  <BellDot className="h-5 w-5" />
                </div>
                <h2 className="text-sm font-semibold text-slate-900">
                  Smart alerts
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Important workflow events will be easier to spot, filter, and
                  follow up on.
                </p>
              </div>

              <div className="rounded-2xl border border-white/70 bg-white/85 p-5 shadow-sm backdrop-blur">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
                  <Clock3 className="h-5 w-5" />
                </div>
                <h2 className="text-sm font-semibold text-slate-900">
                  Review history
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Teams will be able to revisit what changed, when it changed,
                  and who made the update.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-slate-950 px-5 py-5 text-white md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold">Planned for a future release</p>
                <p className="mt-1 text-sm text-slate-300">
                  The rest of the admin dashboard is available now while this
                  module is still being prepared.
                </p>
              </div>

              <Button
                variant="secondary"
                disabled
                className="rounded-full bg-white px-5 text-slate-900 hover:bg-white"
              >
                Feature in progress
              </Button>
            </div>
          </div>
        </section>
      </div>
    </Fragment>
  );
};

export default Page;
