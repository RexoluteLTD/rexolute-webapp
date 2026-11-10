import { Fragment, useState } from "react";
import { MoreVertical } from "lucide-react";
import { Button } from "@rexolute/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@rexolute/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@rexolute/ui/dropdown-menu";
import { ConfirmModal } from "../modals/indext";
import { useRouter } from "@tanstack/react-router";

export function UserTable() {
  const router = useRouter();
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [isCustomOpen, setIsCustomOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const users = [
    {
      id: 1,
      name: "James Bully",
      email: "catalogapp@gmail.com",
      date: "17th May, 2025",
      gender: "M",
      bookedSession: 2,
      expiryDate: "17th May, 2025",
    },
    {
      id: 2,
      name: "Sarah Dream",
      email: "getcircoles@gmail.com",
      date: "17th May, 2025",
      gender: "M",
      bookedSession: 3,
      expiryDate: "17th May, 2025",
    },
    {
      id: 3,
      name: "Elizabeth Trust",
      email: "cmdr@gmail.com",
      date: "17th May, 2025",
      gender: "F",
      bookedSession: 5,
      expiryDate: "17th May, 2025",
    },
    {
      id: 4,
      name: "Grace Apple",
      email: "hourglass@gmail.com",
      date: "17th May, 2025",
      gender: "F",
      bookedSession: 1,
      expiryDate: "17th May, 2025",
    },
    {
      id: 5,
      name: "Trust Maxwell",
      email: "getlayers@gmail.com",
      date: "17th May, 2025",
      gender: "M",
      bookedSession: 4,
      expiryDate: "17th May, 2025",
    },
    {
      id: 6,
      name: "Quotient Transient",
      email: "quotient@gmail.com",
      date: "17th May, 2025",
      gender: "F",
      bookedSession: 2,
      expiryDate: "17th May, 2025",
    },
    {
      id: 7,
      name: "Femi Upkon",
      email: "sisyphus@gmail.com",
      date: "17th May, 2025",
      gender: "F",
      bookedSession: 1,
      expiryDate: "17th May, 2025",
    },
  ];

  return (
    <Fragment>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">NO</TableHead>
              <TableHead className="min-w-[200px]">User name</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Booked session</TableHead>
              <TableHead>Expiry date</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {user.email}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{user.date}</TableCell>
                <TableCell>{user.gender}</TableCell>
                <TableCell>{user.bookedSession}</TableCell>
                <TableCell>{user.expiryDate}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => router.navigate({ to: "/users/details/1" })}
                      >
                        View details
                      </DropdownMenuItem>
                      <DropdownMenuItem>Edit user</DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setIsConfirmationOpen(true)}
                      >
                        Suspend user
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        Delete user
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ConfirmModal
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        title={""}
        onConfirm={() => {}}
      />
    </Fragment>
  );
}
