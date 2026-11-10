import React, { FC, Fragment, useState } from "react";
import {
  Calendar,
  ChevronDown,
  Download,
  Filter,
  Search,
  Clock,
  Phone,
  ChevronLeft,
  ArrowUpDown,
} from "lucide-react";

import { Link } from "@tanstack/react-router";

import { Button } from "@rexolute/ui/button";
import { Card, CardContent } from "@rexolute/ui/card";
import { Input } from "@rexolute/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@rexolute/ui/tabs";
import { Therapist } from "@rexolute/types";
import { SessionCard } from "./session-cards";

type ListMode = "total" | "therapists";
type TherapistList = Therapist[];

const List: FC<{ mode: ListMode; therapists: TherapistList }> = ({
  mode,
  therapists,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState([
    "Anxiety",
    "Marriage and relationship",
    "Male",
  ]);
  const removeFilter = (filter: string) => {
    setActiveFilters(activeFilters.filter((f) => f !== filter));
  };

  const handleReassign = (therapistId: string) => {
    // In a real app, you would call your API to reassign the session
    alert(`Session reassigned to therapist ${therapistId}`);
  };

  return (
    <Fragment>
      {mode === "total" && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Session management</h1>
              <p className="text-sm text-muted-foreground">
                Manage and track therapy sessions
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

          <Tabs defaultValue="upcoming">
            <TabsList className="w-full max-w-md grid grid-cols-3">
              <TabsTrigger value="upcoming">Upcoming Sessions</TabsTrigger>
              <TabsTrigger value="completed">Completed Sessions</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled Sessions</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Upcoming Sessions</h2>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search sessions..."
                  className="pl-8 w-[300px]"
                />
              </div>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <SessionCard
              clientName="Ekene Dulle"
              therapistName="Teddy Max"
              therapistTitle="Psychologist (LHCH)"
              date="Wed, 16th May, 2024"
              time="09:00AM - 09:30AM"
              type="Voice call"
              id="1"
            />
            <SessionCard
              clientName="James Bully"
              therapistName="Sarah Dream"
              therapistTitle="Counselor (LMHC)"
              date="Thu, 17th May, 2024"
              time="10:00AM - 10:45AM"
              type="Video call"
              id="2"
            />
            <SessionCard
              clientName="Grace Apple"
              therapistName="Elizabeth Trust"
              therapistTitle="Therapist (LCSW)"
              date="Fri, 18th May, 2024"
              time="02:00PM - 02:45PM"
              type="In-person"
              id="3"
            />
          </div>
        </div>
      )}
      {mode === "therapists" && (
        <div className="py-6 px-8">
          <div className="flex items-center mb-6">
            <Link
              to="/"
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ChevronLeft className="h-5 w-5 mr-1" />
              <span>Review reassigned session</span>
            </Link>
          </div>
          <div className="flex space-x-2 text-sm mb-6">
            <Link
              to="/"
              className="text-gray-500 hover:text-gray-700"
            >
              Pending tasks
            </Link>
            <span className="text-gray-500">/</span>
            <Link
              to="/sessions"
              className="text-gray-500 hover:text-gray-700"
            >
              Reassigned session
            </Link>
            <span className="text-gray-500">/</span>
            <span className="text-green-600">Reassign</span>
          </div>
          <h2 className="text-xl font-bold mb-6">Avaliable therapist</h2>
          action: Action;
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <p className="text-sm text-gray-600">
                Active filter based on patient needs:
              </p>
              {activeFilters.map((filter) => (
                <span
                  key={filter}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                >
                  {filter}
                  <button
                    type="button"
                    className="ml-1.5 inline-flex flex-shrink-0 h-4 w-4 rounded-full items-center justify-center text-green-400 hover:bg-green-200 hover:text-green-500 focus:outline-none focus:bg-green-500 focus:text-white"
                    onClick={() => removeFilter(filter)}
                  >
                    <span className="sr-only">Remove filter for {filter}</span>
                    <svg
                      className="h-2 w-2"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 8 8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeWidth="1.5"
                        d="M1 1l6 6m0-6L1 7"
                      />
                    </svg>
                  </button>
                </span>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search here..."
                  className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>

              <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </button>

              <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                Sort
              </button>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-6">
            {therapists.map((therapist) => (
              <div
                key={therapist.id}
                className="bg-white rounded-lg shadow overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center">
                    <img
                      className="h-12 w-12 rounded-full"
                      src={
                        therapist.profileImg || "/svg/placeholder.svg"
                      }
                      alt={therapist.name}
                    />
                    <div className="ml-4">
                      <h3 className="text-lg font-bold text-gray-900">
                        {therapist.name}
                      </h3>
                      <p className="text-sm text-gray-500">{therapist.role}</p>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-3 gap-4 border-t border-b py-4">
                    <div>
                      <p className="text-xs text-gray-500 uppercase">
                        EXPERIENCE
                      </p>
                      <p className="text-sm font-medium">
                        {therapist.experience} yrs
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase">
                        SPECIALTY AREA
                      </p>
                      <p className="text-sm font-medium">
                        {therapist.specialty}+
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase">RATINGS</p>
                      <p className="text-sm font-medium flex items-center">
                        {therapist.rating.toFixed(1)}
                        <svg
                          className="h-4 w-4 text-yellow-400 ml-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <button
                      onClick={() => {
                        if (therapist.id) handleReassign(therapist.id);
                      }}
                      className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Reassign
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default List;
