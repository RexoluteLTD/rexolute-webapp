

import React, { FC, Fragment, useState } from "react";
import {
  ArrowLeft,
  Calendar,
  Check,
  ChevronDown,
  Clock,
  Phone,
} from "lucide-react";
import { Link } from "@tanstack/react-router";

import { Button } from "@rexolute/ui/button";
import { Card, CardContent } from "@rexolute/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@rexolute/ui/collapsible";
import { DetailsMode } from "@rexolute/types";

const Details: FC<{ mode: DetailsMode }> = ({ mode = "default" }) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    reason: false,
    symptoms: false,
    history: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };
  return (
    <Fragment>
      <div className="flex flex-col gap-6 px-6">
        <div className="flex items-center gap-2">
          <Link to="/sessions">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-semibold">Review reassigned session</h1>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/tasks" className="hover:text-foreground">
            Pending tasks
          </Link>
          <span className="text-muted-foreground">›</span>
          <span className="text-green-600">Reassigned session</span>
        </div>

        {/* Client Information */}
        <div className="flex gap-6">
          <div className="flex flex-col items-center text-center p-6 border rounded-lg bg-white">
            <div className="w-16 h-16 rounded-full overflow-hidden mb-4">
              <img
                src="/placeholder.svg?height=64&width=64"
                alt="James Bully"
                width={64}
                height={64}
                className="object-cover"
              />
            </div>
            <h2 className="text-xl font-semibold">James Bully</h2>
            <p className="text-sm text-muted-foreground">
              Quotientspecialist@gmail.com
            </p>
            <p className="text-sm text-muted-foreground">08105201636</p>
          </div>

          <Card className="flex-1">
            <CardContent className="p-6">
              {/* <div className="grid grid-cols-1 gap-6 md:grid-cols-2">  </div> */}
              <div className="flex">
                {/* Reason for Reassignment */}
                <div className="p-6 flex-1">
                  <h2 className="text-sm font-medium uppercase text-muted-foreground mb-4">
                    REASON FOR REASSIGNMENT
                  </h2>
                  <Card>
                    <CardContent className="p-4">
                      <div className="space-y-4">
                        <p className="font-medium">Health issues;</p>
                        <p className="text-muted-foreground">
                          I fell ill yesterday, am wouldn't be 100% mentally
                          before the session date.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Sessions Stats */}
                <div className="p-6 flex-1">
                  <h2 className="text-sm font-medium uppercase text-muted-foreground mb-4">
                    SESSIONS STATS
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                        <Check className="h-3 w-3 text-green-600" />
                      </div>
                      <span>34 completed sessions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 rounded-full bg-red-100 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-red-600"
                        >
                          <path d="M18 6 6 18" />
                          <path d="m6 6 12 12" />
                        </svg>
                      </div>
                      <span>2 reassigned sessions</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1 pt-4">
                      REASSIGNMENT FREQUENCY:
                      <span className="font-medium">4%</span>
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-12">
          <CardContent className="p-6">
            {/* <div className="grid grid-cols-1 gap-6 md:grid-cols-2"></div> */}

            <div className="flex gap-6">
              {/* Session Details */}
              <div className="flex-1 space-y-6">
                <h2 className="text-xl font-semibold">Session details:</h2>
                <Card>
                  <CardContent className="p-6 space-y-6">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600">
                        GF
                      </div>
                      <h3 className="text-lg font-medium">Grace Fabian</h3>
                    </div>

                    <div className="bg-[#F4F4F4] p-6 rounded-lg space-y-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-green-600" />
                        <span>Wed, 16th May, 2024</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-green-600" />
                        <span>09:00AM - 09:30AM</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-5 w-5 text-green-600" />
                        <span>Voice call session</span>
                      </div>
                    </div>

                    <Collapsible
                      open={openSections.reason}
                      onOpenChange={() => toggleSection("reason")}
                      className="w-full"
                    >
                      <Card>
                        <CollapsibleTrigger asChild>
                          <div className="flex w-full items-center justify-between p-6 cursor-pointer">
                            <h3 className="text-lg font-semibold">
                              Main reason for seeking therapy
                            </h3>
                            <ChevronDown
                              className={`h-5 w-5 transition-transform ${
                                openSections.reason ? "rotate-180" : ""
                              }`}
                            />
                          </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <CardContent className="pt-0 pb-6 px-6">
                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                                  <Check className="h-3 w-3 text-green-600" />
                                </div>
                                <span>Depression and other mood problems</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                                  <Check className="h-3 w-3 text-green-600" />
                                </div>
                                <span>Relationship problem</span>
                              </div>
                            </div>
                          </CardContent>
                        </CollapsibleContent>
                      </Card>
                    </Collapsible>

                    <Collapsible
                      open={openSections.symptoms}
                      onOpenChange={() => toggleSection("symptoms")}
                      className="w-full"
                    >
                      <Card>
                        <CollapsibleTrigger asChild>
                          <div className="flex w-full items-center justify-between p-6 cursor-pointer">
                            <h3 className="text-lg font-semibold">Symptoms</h3>
                            <ChevronDown
                              className={`h-5 w-5 transition-transform ${
                                openSections.symptoms ? "rotate-180" : ""
                              }`}
                            />
                          </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <CardContent className="pt-0 pb-6 px-6">
                            <ul className="list-disc pl-5 space-y-2">
                              <li>Difficulty sleeping</li>
                              <li>Persistent worry</li>
                              <li>Irritability</li>
                              <li>Trouble concentrating</li>
                              <li>Feeling overwhelmed</li>
                              <li>Physical tension and restlessness</li>
                            </ul>
                          </CardContent>
                        </CollapsibleContent>
                      </Card>
                    </Collapsible>

                    <Collapsible
                      open={openSections.history}
                      onOpenChange={() => toggleSection("history")}
                      className="w-full"
                    >
                      <Card>
                        <CollapsibleTrigger asChild>
                          <div className="flex w-full items-center justify-between p-6 cursor-pointer">
                            <h3 className="text-lg font-semibold">
                              Therapy History
                            </h3>
                            <ChevronDown
                              className={`h-5 w-5 transition-transform ${
                                openSections.history ? "rotate-180" : ""
                              }`}
                            />
                          </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <CardContent className="pt-0 pb-6 px-6">
                            <div className="space-y-4">
                              <p>
                                The client has previously attended 3 therapy
                                sessions with Dr. Johnson in 2022 but
                                discontinued due to relocation. They reported
                                some improvement in managing anxiety during that
                                time but have experienced a recurrence of
                                symptoms in recent months.
                              </p>
                              <p>
                                Previous treatment approaches included cognitive
                                behavioral therapy techniques and mindfulness
                                practices. The client found the mindfulness
                                exercises particularly helpful.
                              </p>
                            </div>
                          </CardContent>
                        </CollapsibleContent>
                      </Card>
                    </Collapsible>
                  </CardContent>
                </Card>
              </div>

              {/* Reassigned To */}
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-6">Reassigned to:</h2>
                <Card>
                  <CardContent className="p-6 bg-[#F4F4F4]">
                    <h3 className="text-xl font-semibold mb-4">Teddy Max</h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="flex">
                        <div className="aspect-square w-full max-w-[200px] overflow-hidden rounded-lg">
                          <img
                            src="/placeholder.svg?height=200&width=200"
                            alt="Therapist"
                            width={200}
                            height={200}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="bg-green-600 text-white p-4 rounded-lg flex-1">
                          <h4 className="font-semibold text-lg mb-2">About</h4>
                          <p className="text-sm">
                            I am a Licensed Mental Health Counselor and
                            Qualified Supervisor in the State of Florida. I
                            earned my Masters Degree in Counseling from
                            University in Fort Lauderdale, Florida in 2000.
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <div className="text-sm text-muted-foreground">
                            EXPERIENCE
                          </div>
                          <div className="text-xl font-semibold">
                            5<span className="text-sm font-normal">yrs</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">
                            SPECIALTY AREA
                          </div>
                          <div className="text-xl font-semibold">7+</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">
                            RATINGS
                          </div>
                          <div className="text-xl font-semibold flex items-center">
                            5.0
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="text-yellow-400 ml-1"
                            >
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="h-4 w-4 rounded-full bg-green-600"></div>
                          <span className="text-sm font-medium">Specialty</span>
                        </div>
                        <div className="flex items-center gap-2 mb-4">
                          <div className="h-4 w-4 rounded-full bg-green-600"></div>
                          <span className="text-sm font-medium">Expertise</span>
                        </div>
                        <p className="text-sm">
                          Stress, Anxiety, Addictions, Relationship issues, Self
                          esteem, Depression.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <Button variant="outline">Reassign</Button>
              <Button className="bg-green-600 hover:bg-green-700">
                Approve
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Fragment>
  );
};

export default Details;
