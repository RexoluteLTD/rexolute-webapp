

import React, { Fragment, useEffect } from "react";
import type { FC } from "react";

import { Link } from "@tanstack/react-router";

import { useRouter, useLocation } from "@tanstack/react-router";
import { useAuth } from "../../../hooks/use-auth";
import {
  LayoutDashboard,
  Users,
  UserCog,
  Handshake,
  Calendar,
  BarChart2,
  Settings,
  Bell,
  Search,
} from "lucide-react";
import { LayoutProps, MenuProps } from "@rexolute/types";
import { ThemeProvider } from "@rexolute/ui/theme-provider";
import { Toaster } from "./toaster";
import { Sidebar, SidebarProvider, SidebarContent, SidebarFooter, SidebarTrigger, SidebarHeader } from "./sidebar";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@rexolute/ui/dropdown-menu";
import { Button } from "@rexolute/ui/button";
import { logoGreen } from "@rexolute/assets/svg";
import { profileAvatarImg } from "@rexolute/assets/images";
import { SharedLayoutProvider } from "../../../providers/layout-provider";

const Layout: FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
  const pathname = useLocation({ select: (location) => location.pathname });

  const { session, signOut } = useAuth();

  const navigation: MenuProps[] = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Users management", path: "/users", icon: Users },
    { name: "Therapist mgt.", path: "/therapists", icon: UserCog },
    {
      name: "Partnership mgt.",
      path: "/partnerships",
      icon: Handshake,
    },
    { name: "Session mgt.", path: "/sessions", icon: Calendar },
    { name: "Report & analytics", path: "/reports", icon: BarChart2 },
  ];

  const isActive = (path: string) =>
    path === "/" ? pathname === "/" : pathname === path || pathname.startsWith(`${path}/`);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <Toaster />

      <SidebarProvider>
        <Sidebar>
          {/* Sidebar */}
          <SidebarHeader>
            <div className="flex items-center p-4">
              <Link to="/" className="flex items-center">
                <img src={logoGreen} alt="Rexolute Logo" />
              </Link>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <div className="">
              <div className="p-4">
                <div className="flex items-center mb-4">
                  <Link
                    to={"/tasks"}
                    className="flex items-center bg-gray-100 rounded-md p-2 w-full"
                  >
                    <span className="text-sm font-medium text-gray-700">
                      Tasks
                    </span>
                    <span className="ml-auto bg-green-100 text-green-800 text-xs font-semibold px-2 py-0.5 rounded">
                      13
                    </span>
                  </Link>
                </div>

                <div className="flex items-center mb-8">
                  <Link
                    to={"/activities"}
                    className="flex items-center bg-gray-100 rounded-md p-2 w-full"
                  >
                    <span className="text-sm font-medium text-gray-700">
                      Activities
                    </span>
                  </Link>
                </div>

                <div className="mb-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    MAIN
                  </p>
                </div>

                <nav className="space-y-1">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                        isActive(item.path)
                          ? "text-gray-900 bg-gray-100"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <item.icon className="mr-3 h-5 w-5 text-gray-500" />
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          </SidebarContent>
          <SidebarFooter>{/* <SidebarTrigger /> */}</SidebarFooter>
        </Sidebar>

        <div className="w-screen">
          {/* Top header */}
          <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
            <div className="flex items-center justify-between px-6 py-3">
              <div className="flex items-center gap-8">
                <SidebarTrigger />
                <h6 className="text-xl font-bold text-[#17191C]">
                  <span className="block text-[14px] font-medium text-[#5E5959]">
                    Welcome,
                  </span>
                  {
                    // session?.user?.name ||
                    "Admin"
                  }
                </h6>
              </div>

              <div className="flex items-center space-x-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search here..."
                    className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>

                <Button
                  variant={"ghost"}
                  onClick={() => router.navigate({ to: "/settings" })}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <Settings className="h-6 w-6" />
                </Button>

                <Button
                  variant={"ghost"}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <Bell className="h-6 w-6" />
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      {/* <MoreVertical className="h-4 w-4" /> */}
                      <img
                        src={profileAvatarImg}
                        alt="Profile Image"
                        height={40}
                        width={40}
                      />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {/* <DropdownMenuItem>View details</DropdownMenuItem>
                      <DropdownMenuItem>Edit user</DropdownMenuItem> */}

                    <DropdownMenuItem
                      onClick={() => {
                        console.log("logging out...");
                        signOut();
                      }}
                      className="text-red-600"
                    >
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>
          <SharedLayoutProvider>
            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Page content */}
              <main className="flex-1 overflow-auto bg-gray-50">
                {children}
              </main>
            </div>
          </SharedLayoutProvider>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
};

export default Layout;
