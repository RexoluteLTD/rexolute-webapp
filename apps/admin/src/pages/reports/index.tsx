import { Fragment } from "react";
import {
  BarChart3,
  Download,
  LineChart,
  Sparkles,
  WalletCards,
} from "lucide-react";

import Head from "@rexolute/ui/head";
import { Button } from "@rexolute/ui/button";

const Page = () => {
  return (
    <Fragment>
      <Head title="Reports & Analytics" />

      <div className="p-6">
        <section className="relative overflow-hidden rounded-[28px] border border-sky-100 bg-[linear-gradient(135deg,#f8fbff_0%,#eef6ff_38%,#f7fffc_100%)] px-6 py-8 shadow-sm md:px-10 md:py-12">
          <div className="absolute left-0 top-0 h-36 w-36 rounded-full bg-sky-200/30 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-40 w-40 rounded-full bg-emerald-200/20 blur-3xl" />

          <div className="relative flex flex-col gap-8">
            <div className="flex flex-col gap-4 md:max-w-2xl">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-sky-200 bg-white/85 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
                <Sparkles className="h-3.5 w-3.5" />
                Coming Soon
              </div>

              <div className="space-y-3">
                <h1 className="font-onest text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
                  Reports and analytics are in progress
                </h1>
                <p className="max-w-xl text-sm leading-6 text-slate-600 md:text-base">
                  This space will bring together exportable insights, growth
                  trends, and operational metrics so the admin team can make
                  faster, clearer decisions from one reporting hub.
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-white/70 bg-white/85 p-5 shadow-sm backdrop-blur">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <h2 className="text-sm font-semibold text-slate-900">
                  Executive dashboards
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  High-level performance snapshots for sessions, users, and key
                  operational signals.
                </p>
              </div>

              <div className="rounded-2xl border border-white/70 bg-white/85 p-5 shadow-sm backdrop-blur">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                  <LineChart className="h-5 w-5" />
                </div>
                <h2 className="text-sm font-semibold text-slate-900">
                  Trend monitoring
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Track platform movement over time with clearer comparisons and
                  easier spotting of unusual changes.
                </p>
              </div>

              <div className="rounded-2xl border border-white/70 bg-white/85 p-5 shadow-sm backdrop-blur">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
                  <Download className="h-5 w-5" />
                </div>
                <h2 className="text-sm font-semibold text-slate-900">
                  Export-ready summaries
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Generate compact reports for stakeholder updates, audits, and
                  internal reviews.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-slate-950 px-5 py-5 text-white">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="max-w-2xl">
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-300">
                    <WalletCards className="h-3.5 w-3.5" />
                    Planned Module
                  </div>
                  <p className="text-sm font-semibold">
                    Reporting tools are being prepared for a future release.
                  </p>
                  <p className="mt-1 text-sm text-slate-300">
                    The rest of the admin workspace remains available while this
                    page is under active design and implementation.
                  </p>
                </div>

                <Button
                  variant="secondary"
                  disabled
                  className="rounded-full bg-white px-5 text-slate-900 hover:bg-white"
                >
                  Analytics in progress
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Fragment>
  );
};

export default Page;
