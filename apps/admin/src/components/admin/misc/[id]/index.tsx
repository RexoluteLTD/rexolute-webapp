import { ArrowLeft, Calendar, ChevronDown, Phone } from "lucide-react";
import { Link } from "@tanstack/react-router";


import {
  DashboardHeader,
  DashboardNav,
} from "../../dashboard/index";
import { Button } from "@rexolute/ui/button";
import { Card, CardContent } from "@rexolute/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@rexolute/ui/breadcrumb";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@rexolute/ui/collapsible";

export default function UserDetailsPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="flex flex-1">
        <aside className="hidden w-[240px] flex-col border-r bg-white lg:flex">
          <div className="flex h-14 items-center border-b px-4">
            <Link
              to="/"
              className="flex items-center gap-2 font-semibold text-lg text-green-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
              </svg>
              <span>Resolute</span>
            </Link>
          </div>
          <DashboardNav />
        </aside>
        <div className="flex flex-1 flex-col">
          <DashboardHeader />
          <main className="flex-1 p-6">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-2">
                <Link to="/users">
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                </Link>
                <h1 className="text-2xl font-semibold">Upcoming session</h1>
              </div>

              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/users">
                      User management
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/users">View details</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="#" className="text-green-600">
                      view details
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>

              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
                  EA
                </div>
                <h2 className="text-xl font-semibold">Ekene Dulle</h2>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-6">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-4">
                        Session details:
                      </h3>
                      <div className="bg-slate-50 p-6 rounded-lg space-y-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-green-600" />
                          <span>Wed, 16th May, 2024</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-5 w-5 flex items-center justify-center text-green-600">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <circle cx="12" cy="12" r="10" />
                              <polyline points="12 6 12 12 16 14" />
                            </svg>
                          </div>
                          <span>09:00AM - 09:30AM</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-5 w-5 text-green-600" />
                          <span>Voice call session</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Collapsible className="w-full">
                    <Card>
                      <CollapsibleTrigger className="flex w-full items-center justify-between p-6">
                        <h3 className="text-lg font-semibold">
                          Main reason for seeking therapy
                        </h3>
                        <ChevronDown className="h-5 w-5" />
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <CardContent className="pt-0 pb-6 px-6">
                          <p>
                            The client is seeking therapy to address ongoing
                            anxiety and stress related to work and personal
                            relationships.
                          </p>
                        </CardContent>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>

                  <Collapsible className="w-full">
                    <Card>
                      <CollapsibleTrigger className="flex w-full items-center justify-between p-6">
                        <h3 className="text-lg font-semibold">Symptoms</h3>
                        <ChevronDown className="h-5 w-5" />
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <CardContent className="pt-0 pb-6 px-6">
                          <ul className="list-disc pl-5 space-y-2">
                            <li>Difficulty sleeping</li>
                            <li>Persistent worry</li>
                            <li>Irritability</li>
                            <li>Trouble concentrating</li>
                          </ul>
                        </CardContent>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>

                  <Collapsible className="w-full">
                    <Card>
                      <CollapsibleTrigger className="flex w-full items-center justify-between p-6">
                        <h3 className="text-lg font-semibold">
                          Therapy History
                        </h3>
                        <ChevronDown className="h-5 w-5" />
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <CardContent className="pt-0 pb-6 px-6">
                          <p>
                            The client has previously attended 3 therapy
                            sessions with Dr. Johnson in 2022 but discontinued
                            due to relocation.
                          </p>
                        </CardContent>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>
                </div>

                <div>
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-4">
                        Therapist details
                      </h3>
                      <div className="space-y-4">
                        <h4 className="text-xl font-semibold">Teddy Max</h4>
                        <div className="grid grid-cols-1 gap-4">
                          <div className="aspect-square w-full max-w-[200px] overflow-hidden rounded-lg">
                            <img
                              src="/placeholder.svg?height=200&width=200"
                              alt="Therapist"
                              width={200}
                              height={200}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="bg-green-600 text-white p-4 rounded-lg">
                            <h5 className="font-semibold text-lg mb-2">
                              About
                            </h5>
                            <p className="text-sm">
                              I am a Licensed Mental Health Counselor and
                              Qualified Supervisor in the State of Florida. I
                              earned my Masters Degree in Counseling from
                              University in Fort Lauderdale, Florida in 2000.
                            </p>
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <div className="text-sm text-muted-foreground">
                                EXPERIENCE
                              </div>
                              <div className="text-xl font-semibold">
                                5
                                <span className="text-sm font-normal">yrs</span>
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
                              <span className="text-sm font-medium">
                                Specialty
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mb-4">
                              <div className="h-4 w-4 rounded-full bg-green-600"></div>
                              <span className="text-sm font-medium">
                                Expertise
                              </span>
                            </div>
                            <p className="text-sm">
                              Stress, Anxiety, Addictions, Relationship issues,
                              Self esteem, Depression.
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
