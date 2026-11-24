

import React, { Fragment, useEffect, useState } from "react";
import type { FC } from "react";

import { Link } from "@tanstack/react-router";

import { useRouter, useLocation } from "@tanstack/react-router";
import { useAuth } from "../../hooks/use-auth";
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
  ChevronDown,
  FileText,
  Files,
  FolderTree,
} from "lucide-react";
import { LayoutProps, MenuProps } from "@rexolute/types";
import { ThemeProvider } from "@rexolute/ui/theme-provider";
import { Toaster } from "./toaster";
import { Sidebar, SidebarProvider, SidebarContent, SidebarFooter, SidebarTrigger, SidebarHeader } from "./sidebar";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@rexolute/ui/dropdown-menu";
import { Button } from "@rexolute/ui/button";
import { logoGreen } from "@rexolute/assets/svg";
import { profileAvatarImg } from "@rexolute/assets/images";
import { SharedLayoutProvider } from "../../providers/layout-provider";
import { canManageArticle } from "../pages/cms/article-form";

const Layout: FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
  const pathname = useLocation({ select: (location) => location.pathname });

  const { session, signOut, isSigningOut } = useAuth();
  const [cmsOpen, setCmsOpen] = useState(pathname.startsWith("/cms"));

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

  useEffect(() => {
    if (pathname.startsWith("/cms")) setCmsOpen(true);
  }, [pathname]);

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
                  <div>
                    <button
                      type="button"
                      aria-expanded={cmsOpen}
                      onClick={() => setCmsOpen((open) => !open)}
                      className={`flex w-full items-center rounded-md px-2 py-2 text-sm font-medium ${
                        pathname.startsWith("/cms")
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <Files className="mr-3 h-5 w-5 text-gray-500" />
                      CMS
                      <ChevronDown
                        className={`ml-auto h-4 w-4 transition-transform ${cmsOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    {cmsOpen && (
                      <div className="ml-5 mt-1 space-y-1 border-l border-gray-200 pl-3">
                        {canManageArticle(session?.user, "create") && <Link
                          to="/cms/new-post"
                          className={`flex items-center rounded-md px-2 py-2 text-sm ${
                            isActive("/cms/new-post")
                              ? "bg-gray-100 font-medium text-gray-900"
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                          }`}
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          New article
                        </Link>}
                        <Link
                          to="/cms/posts"
                          className={`flex items-center rounded-md px-2 py-2 text-sm ${
                            isActive("/cms/posts")
                              ? "bg-gray-100 font-medium text-gray-900"
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                          }`}
                        >
                          <Files className="mr-2 h-4 w-4" />
                          Articles
                        </Link>
                        <Link
                          to="/cms/categories"
                          className={`flex items-center rounded-md px-2 py-2 text-sm ${
                            isActive("/cms/categories")
                              ? "bg-gray-100 font-medium text-gray-900"
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                          }`}
                        >
                          <FolderTree className="mr-2 h-4 w-4" />
                          Categories
                        </Link>
                      </div>
                    )}
                  </div>
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

                <DropdownMenu modal={false}>
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
                      onSelect={() => void signOut()}
                      disabled={isSigningOut}
                      className="text-red-600"
                    >
                      {isSigningOut ? "Logging out…" : "Log out"}
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
