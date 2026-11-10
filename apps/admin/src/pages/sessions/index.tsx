import React, { Fragment } from "react";
import { Calendar, ChevronDown, Download, Filter, Search } from "lucide-react";
import Head from "@rexolute/ui/head";
import { Button } from "@rexolute/ui/button";
import { Input } from "@rexolute/ui/input";
import { SessionStatsCards } from "../../components/admin/dashboard/index";
import { SessionCard } from "../../components/admin/sessions";

const Page = () => {
  const items20 = Array(20).fill("item");
  console.log(items20);
  return (
    <Fragment>
      <Head title="Session mgt." />

      <div className="flex flex-col gap-6 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Session management</h1>
            <p className="text-sm text-muted-foreground">
              Keep track of therapy sessions.
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

        <SessionStatsCards />

        <div className="flex justify-between">
          <h4 className="font-semibold">
            Ongoing Sessions <span className="font-normal">(12)</span>
          </h4>

          <div className="flex gap-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search here..."
                className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>

            <Button
              variant={"outline"}
              className="py-1 px-3 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <Filter className="h-6 w-6" />
              <span> Filter</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items20.map((_, idx) => (
            <SessionCard
              // key={idx}
              clientName="Ekene Dulle"
              therapistName="Teddy Max"
              therapistTitle="Psychologist (LHCH)"
              date="Wed, 16th May, 2024"
              time="09:00AM - 09:30AM"
              type="Voice call"
              profileImg={`/images/avatar${idx + 1}.png`}
              id={idx.toString()}
            />
          ))}
        </div>
      </div>
    </Fragment>
  );
};

export default Page;
