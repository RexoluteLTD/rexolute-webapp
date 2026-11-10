

import { Fragment, useState } from "react";
import Head from "@rexolute/ui/head";
import { Calendar, ChevronDown, Download } from "lucide-react";
import {
  DashboardStatsCards,
  SessionBreakdown,
  UserSignupChart,
  GenderDistribution,
  TherapyReasons,
  SessionTypeBreakdown,
  OtherStats,
  TopPerformers,
} from "../components/admin/dashboard/index";
import { Button } from "@rexolute/ui/button";

interface Task {
  id: string;
  title: string;
  type: string;
  date: string;
  time: string;
  patient: string;
  therapist: string;
}

interface DashboardProps {
  pendingTasks: Task[];
}

export default function Page() {
  const [activeTab, setActiveTab] = useState("reassigned");

  return (
    <Fragment>
      <Head title="Dashboard" />

      <div className="flex flex-col gap-6 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Below is overview stats of various activities
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2">
              <Calendar className="h-4 w-4" />
              Jan 6, 2022 - Jan 13, 2022
              <ChevronDown className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <DashboardStatsCards />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <SessionBreakdown />
          <UserSignupChart />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <GenderDistribution />
          <TherapyReasons />
        </div>

        <SessionTypeBreakdown />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <OtherStats />
          <TopPerformers />
        </div>
      </div>
    </Fragment>
  );
}

