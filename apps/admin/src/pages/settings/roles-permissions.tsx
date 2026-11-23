import { Fragment, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ChevronRight, Plus } from "lucide-react";

import Head from "@rexolute/ui/head";
import { Button } from "@rexolute/ui/button";
import { cn } from "@rexolute/utils";

type RoleRecord = {
  id: string;
  title: string;
  description: string;
  permissions: Array<{ label: string; allowed: boolean }>;
};

const roles: RoleRecord[] = [
  {
    id: "super-admin",
    title: "Super Admin",
    description: "This account can create and manage Merchants",
    permissions: [
      { label: "Add users", allowed: true },
      { label: "Deactivate user", allowed: true },
      { label: "Suspend user", allowed: true },
      { label: "Assign roles", allowed: true },
      { label: "Deactivate customer account", allowed: true },
    ],
  },
  {
    id: "admin",
    title: "Admin",
    description:
      "This account can view and generate detailed transaction reports",
    permissions: [
      { label: "Add users", allowed: false },
      { label: "Deactivate user", allowed: true },
      { label: "Suspend user", allowed: false },
      { label: "Assign roles", allowed: false },
      { label: "Deactivate customer account", allowed: false },
    ],
  },
];

const Page = () => {
  const [activeRoleId, setActiveRoleId] = useState("super-admin");

  const activeRole =
    roles.find((role) => role.id === activeRoleId) ?? roles[0];

  return (
    <Fragment>
      <Head title="Roles and permission" />

      <div className="px-8 py-9">
        <div className="max-w-[1100px]">
          <div className="flex items-center gap-4">
            <Link
              to="/settings"
              className="inline-flex items-center text-[#17191C]"
            >
              <ArrowLeft className="h-[22px] w-[22px]" strokeWidth={2} />
            </Link>
            <h1 className="text-[30px] font-semibold tracking-[-0.02em] text-[#101828]">
              Roles and permission
            </h1>
          </div>

          <div className="mt-4 flex items-center gap-2 text-[14px] text-[#667085]">
            <span>Settings</span>
            <ChevronRight className="h-4 w-4" />
            <span>Access Management</span>
            <ChevronRight className="h-4 w-4" />
            <span className="font-medium text-[#2E8902]">
              Roles &amp; Permissions
            </span>
          </div>

          <section className="pt-10">
            <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <h2 className="text-[17px] font-semibold text-[#101828]">
                View Roles &amp; Permissions
              </h2>

              <Button className="h-[46px] rounded-[10px] bg-[#0D8B78] px-6 text-[15px] font-medium text-white hover:bg-[#0a7363]">
                <Plus className="mr-2 h-4 w-4" />
                Add New Role
              </Button>
            </div>

            <div className="grid gap-12 lg:grid-cols-[1.45fr_0.95fr]">
              <div className="space-y-8">
                {roles.map((role) => {
                  const isActive = role.id === activeRoleId;

                  return (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => setActiveRoleId(role.id)}
                      className={cn(
                        "w-full rounded-[14px] border px-6 py-6 text-left transition-all",
                        isActive
                          ? "border-[#69A10E] bg-white shadow-[0_0_0_1px_rgba(105,161,14,0.08)]"
                          : "border-transparent bg-transparent hover:border-[#E4E7EC]",
                      )}
                    >
                      <h3 className="text-[18px] font-semibold text-[#101828]">
                        {role.title}
                      </h3>
                      <p className="mt-2 text-[15px] leading-[28px] text-[#667085]">
                        {role.description}
                      </p>
                    </button>
                  );
                })}
              </div>

              <div className="pt-[28px]">
                <h3 className="text-[18px] font-semibold text-[#101828]">
                  Permissions
                </h3>
                <p className="mt-3 text-[15px] leading-[28px] text-[#667085]">
                  This account will be able to do the following
                </p>

                <div className="mt-4 h-px w-full bg-[#D0D5DD]" />

                <div className="mt-5 space-y-5">
                  {activeRole.permissions.map((permission) => (
                    <div
                      key={permission.label}
                      className="flex items-center justify-between gap-6"
                    >
                      <p className="text-[15px] leading-[28px] text-[#344054]">
                        {permission.label}
                      </p>
                      <span
                        className={cn(
                          "text-[15px] font-semibold uppercase",
                          permission.allowed
                            ? "text-[#3D9B09]"
                            : "text-[#F04438]",
                        )}
                      >
                        {permission.allowed ? "YES" : "NO"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </Fragment>
  );
};

export default Page;
