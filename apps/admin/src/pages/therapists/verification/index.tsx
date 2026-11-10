

import { Link } from "@tanstack/react-router";

import { Button } from "@rexolute/ui/button"
import { Card, CardContent } from "@rexolute/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@rexolute/ui/table"
import { MoreVertical } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@rexolute/ui/dropdown-menu"

export default function VerificationPage() {
  const pendingTherapists = [
    {
      id: 1,
      name: "Sarah Dream",
      email: "getcircoles@gmail.com",
      date: "17th May, 2025",
      gender: "Female",
      degree: "M.sc",
      experience: "10 years",
    },
    {
      id: 2,
      name: "Elizabeth Trust",
      email: "cmdr@gmail.com",
      date: "17th May, 2025",
      gender: "Female",
      degree: "M.sc",
      experience: "8 years",
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Pending Task (13)</h1>
      </div>

      <div className="flex flex-wrap gap-4">
        <Card className="inline-flex">
          <CardContent className="flex items-center gap-2 p-3">
            <span>Reassigned sessions</span>
            <span className="bg-gray-200 px-2 py-1 rounded-full text-xs">7</span>
          </CardContent>
        </Card>

        <Card className="inline-flex bg-green-50 border-green-200">
          <CardContent className="flex items-center gap-2 p-3">
            <span className="text-green-700">Profile set-up</span>
            <span className="bg-green-200 text-green-700 px-2 py-1 rounded-full text-xs">2</span>
          </CardContent>
        </Card>

        <Card className="inline-flex">
          <CardContent className="flex items-center gap-2 p-3">
            <span>Student registration</span>
            <span className="bg-gray-200 px-2 py-1 rounded-full text-xs">3</span>
          </CardContent>
        </Card>
      </div>

      <p className="text-muted-foreground">These are list of session therapist profile setup awaiting your review.</p>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Therapist name</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Highest degree</TableHead>
              <TableHead>Years of experience</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pendingTherapists.map((therapist) => (
              <TableRow key={therapist.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 overflow-hidden rounded-full">
                      <img
                        src="/placeholder.svg?height=40&width=40"
                        alt={therapist.name}
                        width={40}
                        height={40}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-medium">{therapist.name}</div>
                      <div className="text-sm text-muted-foreground">{therapist.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{therapist.date}</TableCell>
                <TableCell>{therapist.gender}</TableCell>
                <TableCell>{therapist.degree}</TableCell>
                <TableCell>{therapist.experience}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Link to="/therapists/verification/profile-setup">View details</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>Reject</DropdownMenuItem>
                      <DropdownMenuItem>Approve</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
