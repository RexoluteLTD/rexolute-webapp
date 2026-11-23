import { ArrowLeft, Search } from "lucide-react"
import { Link } from "@tanstack/react-router";

import { Button } from "@rexolute/ui/button"
import { Card, CardContent } from "@rexolute/ui/card"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@rexolute/ui/breadcrumb"

export default function EducationVerificationPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Link to="/therapists/verification">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-semibold">Educational certification</h1>
      </div>

      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/therapists">Therapist management</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/therapists/verification">View details</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="#" className="text-green-600">
              Educational certification
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h2 className="text-xl font-semibold">Validated educational information</h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-6">USER INFORMATION</h3>
            <div className="space-y-6">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Full name</div>
                <div className="font-medium">James Bully</div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground mb-1">Highest degree earned</div>
                <div className="font-medium">B.sc</div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground mb-1">Institution name</div>
                <div className="font-medium">University of Benin</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="relative">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-6">UPLOADED DOCUMENT</h3>
              <div className="relative">
                <div className="aspect-[16/10] overflow-hidden rounded-md">
                  <img
                    src="/placeholder.svg?height=300&width=500"
                    alt="Educational Certificate"
                    width={500}
                    height={300}
                    className="h-full w-full object-cover"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute bottom-2 right-2 h-8 w-8 rounded-full bg-white shadow-md"
                >
                  <Search className="h-4 w-4" />
                  <span className="sr-only">Zoom</span>
                </Button>
              </div>
            </CardContent>
          </Card>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="flex flex-col items-center bg-white rounded-md shadow-md p-2">
              <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                Compare
              </Button>
              <div className="flex flex-col items-center">
                <ArrowLeft className="h-4 w-4 rotate-90" />
                <ArrowLeft className="h-4 w-4 -rotate-90" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-4">
        <Button variant="outline">Reject</Button>
        <Button>Approve</Button>
      </div>
    </div>
  )
}
