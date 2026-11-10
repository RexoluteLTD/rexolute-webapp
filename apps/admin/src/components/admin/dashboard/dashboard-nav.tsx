

import { Link } from "@tanstack/react-router";
import {
  BarChart2,
  FileText,
  LayoutDashboard,
  Users,
  UserCog,
  Handshake,
} from "lucide-react";
import { useLocation } from "@tanstack/react-router";
import { cn } from "@rexolute/utils";

export function DashboardNav() {
  const pathname = useLocation({ select: (location) => location.pathname });

  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="flex flex-col gap-1">
        <div className="text-xs font-medium uppercase text-muted-foreground">
          Main
        </div>
        <nav className="grid gap-1">
          <Link
            to="/"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
              pathname === "/"
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
          <Link
            to="/users"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
              pathname === "/users"
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Users className="h-4 w-4" />
            Users management
          </Link>
          <Link
            to="#"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <UserCog className="h-4 w-4" />
            Therapist mgt.
          </Link>
          <Link
            to="#"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <Handshake className="h-4 w-4" />
            Partnership mgt.
          </Link>
          <Link
            to="#"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <FileText className="h-4 w-4" />
            Session mgt.
          </Link>
          <Link
            to="#"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <BarChart2 className="h-4 w-4" />
            Report & analytics
          </Link>
        </nav>
      </div>
    </div>
  );
}
