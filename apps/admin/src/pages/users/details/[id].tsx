import { ArrowLeft, Calendar, Check, MessageCircle } from "lucide-react";
import { Link } from "@tanstack/react-router";


import { Button } from "@rexolute/ui/button";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@rexolute/ui/breadcrumb";
import { Card, CardContent } from "@rexolute/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@rexolute/ui/tabs";
import { SessionCard } from "../../../components/admin/sessions";
import { Fragment } from "react";
import Head from "@rexolute/ui/head";

const Page = () => {
  return (
    <Fragment>
      <Head title="User Details" />

      <div className="flex min-h-screen w-full flex-col px-6 py-4">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <Link to="/users">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-2xl font-semibold">View user details</h1>
          </div>

          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/users">User management</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#" className="text-green-600">
                  View details
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Card className="md:col-span-1">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600 text-xl mb-4">
                  EA
                </div>
                <h2 className="text-2xl font-semibold mb-2">Ekene Dulle</h2>
                <div className="flex items-center gap-1 text-green-600">
                  <span>Active</span>
                  <Check className="h-4 w-4" />
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">
                      PHONE NUMBER
                    </div>
                    <div>08142056773</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">
                      EMAIL
                    </div>
                    <div>@gmail.com</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">
                      DOB
                    </div>
                    <div>12th Jan, 1998</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">
                      GENDER
                    </div>
                    <div>Male</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">
                      REGISTRATION DATE
                    </div>
                    <div>02-2-2025</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">
                      EXPIRY DATE
                    </div>
                    <div>02-2-2026</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="upcoming">
            <TabsList>
              <TabsTrigger value="upcoming">Upcoming sessions (2)</TabsTrigger>
              <TabsTrigger value="completed">
                Completed session (10)
              </TabsTrigger>
            </TabsList>
            <TabsContent value="upcoming" className="pt-4">
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
              </div>
            </TabsContent>
            <TabsContent value="completed" className="pt-4">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Completed sessions would go here */}
                <div className="text-muted-foreground">
                  No completed sessions to display.
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Fragment>
  );
};

export default Page;
