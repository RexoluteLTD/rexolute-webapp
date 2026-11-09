"use client";

import { Fragment, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ChevronRight, PencilLine, X } from "lucide-react";

import { Head } from "@/components/shared";
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  RadioGroup,
  RadioGroupItem,
  Switch,
} from "@/components/ui";
import { useToast } from "@/hooks/use-toast";

type AdminRecord = {
  id: number;
  email: string;
  initials: string;
  role: "Admin" | "Super admin" | "Support admin";
  status: "Active" | "Inactive";
  dateCreated: string;
};

const adminsData: Record<string, AdminRecord> = {
  "1": {
    id: 1,
    email: "ekenedulle@gmail.com",
    initials: "EA",
    role: "Admin",
    status: "Active",
    dateCreated: "22nd Sep 2024",
  },
  "2": {
    id: 2,
    email: "seive@gmail.com",
    initials: "SA",
    role: "Support admin",
    status: "Active",
    dateCreated: "17th Sep 2024",
  },
};

const roleOptions = ["Admin", "Super admin", "Support admin"] as const;

const roleContent: Record<
  (typeof roleOptions)[number],
  { description: string; permissions: string[] }
> = {
  Admin: {
    description:
      "This account can view and generate detailed transaction reports",
    permissions: [
      "Review therapist reassignment",
      "Review student registration",
      "Review therapist registration",
    ],
  },
  "Super admin": {
    description:
      "This account can manage platform-wide settings and oversee account-level operations",
    permissions: [
      "Add users",
      "Deactivate user",
      "Suspend user",
      "Assign roles",
      "Deactivate customer account",
    ],
  },
  "Support admin": {
    description:
      "This account can support operational reviews and manage issue-resolution workflows",
    permissions: [
      "Review therapist reassignment",
      "Review student registration",
      "Review support escalations",
    ],
  },
};

const Page = () => {
  const params = useParams();
  const { toast } = useToast();
  const adminId = params.id as string;
  const admin = adminsData[adminId] ?? adminsData["1"];

  const [role, setRole] = useState(admin.role);
  const [draftRole, setDraftRole] = useState(admin.role);
  const [status, setStatus] = useState(admin.status);
  const [draftStatus, setDraftStatus] = useState(admin.status === "Active");
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  const handleSaveRole = () => {
    setRole(draftRole);
    setIsRoleModalOpen(false);
    toast({
      variant: "success",
      title: "Admin role updated",
      description: `${admin.email} role has been changed to ${draftRole}.`,
    });
  };

  const handleSaveStatus = () => {
    const nextStatus = draftStatus ? "Active" : "Inactive";
    setStatus(nextStatus);
    setIsStatusModalOpen(false);
    toast({
      variant: "success",
      title: "Profile status updated",
      description: `${admin.email} account is now ${nextStatus.toLowerCase()}.`,
    });
  };

  const currentRoleContent = roleContent[role];

  return (
    <Fragment>
      <Head title="Settings - View Admin" />

      <div className="px-8 py-9">
        <div className="max-w-[1098px]">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/settings"
              className="inline-flex items-center text-[#17191C]"
            >
              <ArrowLeft className="h-[18px] w-[18px]" strokeWidth={2} />
            </Link>
            <h1 className="text-[18px] font-semibold leading-none text-[#17191C]">
              Settings
            </h1>
          </div>

          <div className="mt-3 flex items-center gap-2 text-[14px] text-[#667085]">
            <span>Settings</span>
            <ChevronRight className="h-4 w-4" />
            <span className="font-medium text-[#2E8902]">View admin</span>
          </div>

          <div className="mt-5 rounded-[16px] border border-[#EAECF0] bg-white px-6 py-6">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-5">
                <div className="flex h-[84px] w-[84px] items-center justify-center rounded-full bg-[#F0FEFB]">
                  <span className="text-[24px] font-semibold text-[#2E8902]">
                    {admin.initials}
                  </span>
                </div>

                <div>
                  <p className="text-[14px] font-semibold text-[#344054] md:text-[17px]">
                    {admin.email}
                  </p>

                  <div className="mt-4 flex items-center gap-2">
                    <span className="text-[12px] font-medium text-[#2E8902]">
                      {status}
                    </span>
                    <button
                      type="button"
                      aria-label="Edit status"
                      onClick={() => {
                        setDraftStatus(status === "Active");
                        setIsStatusModalOpen(true);
                      }}
                      className="inline-flex items-center text-[#2E8902]"
                    >
                      <PencilLine className="h-[14px] w-[14px]" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="pr-1 text-left md:text-right">
                <span className="text-[14px] font-medium text-[#667085]">
                  Date created :
                </span>{" "}
                <span className="text-[14px] font-medium text-[#B54708]">
                  {admin.dateCreated}
                </span>
              </div>
            </div>
          </div>

          <section className="mt-8">
            <h2 className="text-[17px] font-semibold text-[#17191C]">
              User roles
            </h2>

            <div className="mt-10 grid gap-10 lg:grid-cols-[1.4fr_150px_1fr]">
              <div>
                <h3 className="text-[18px] font-semibold text-[#17191C]">
                  {role}
                </h3>
                <p className="mt-3 max-w-[455px] text-[15px] leading-[28px] text-[#667085]">
                  {currentRoleContent.description}
                </p>
              </div>

              <div className="pt-[2px]">
                <button
                  type="button"
                  onClick={() => {
                    setDraftRole(role);
                    setIsRoleModalOpen(true);
                  }}
                  className="text-[15px] font-semibold text-[#2E8902] underline underline-offset-2"
                >
                  Change Role
                </button>
              </div>

              <div>
                <h3 className="text-[18px] font-semibold text-[#17191C]">
                  Permissions
                </h3>
                <p className="mt-3 text-[15px] leading-[28px] text-[#667085]">
                  This account will be able to do the following
                </p>

                <div className="mt-4 h-px w-full bg-[#D0D5DD]" />

                <div className="mt-6 space-y-5">
                  {currentRoleContent.permissions.map((permission) => (
                    <p
                      key={permission}
                      className="text-[15px] leading-[28px] text-[#667085]"
                    >
                      {permission}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <Dialog open={isRoleModalOpen} onOpenChange={setIsRoleModalOpen}>
        <DialogContent className="max-w-[534px] rounded-[22px] border-none p-0 shadow-[0_24px_60px_rgba(16,24,40,0.18)]">
          <div className="relative px-10 pb-9 pt-10">
            <DialogClose className="absolute right-8 top-7 flex h-8 w-8 items-center justify-center rounded-full border border-[#667085] text-[#667085] transition hover:bg-slate-50">
              <X className="h-4 w-4" />
            </DialogClose>

            <h2 className="text-[18px] font-semibold text-[#101828]">
              Change Admin Role
            </h2>

            <RadioGroup
              value={draftRole}
              onValueChange={(value) => setDraftRole(value as (typeof roleOptions)[number])}
              className="mt-8 gap-8"
            >
              {roleOptions.map((option) => (
                <label
                  key={option}
                  className="flex cursor-pointer items-center justify-between gap-4"
                >
                  <span className="text-[15px] font-medium text-[#344054]">
                    {option === "Super admin" ? "Super Admin" : option}
                  </span>
                  <RadioGroupItem
                    value={option}
                    className="h-[21px] w-[21px] border-[#D0D5DD] text-[#2E8902] data-[state=checked]:border-[#2E8902]"
                  />
                </label>
              ))}
            </RadioGroup>

            <div className="mt-12 flex justify-center gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setDraftRole(role);
                  setIsRoleModalOpen(false);
                }}
                className="h-[43px] w-[162px] rounded-[9px] border-[#D0D5DD] bg-white text-[#344054] hover:bg-slate-50"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveRole}
                className="h-[43px] w-[162px] rounded-[9px] bg-[#2E8902] text-white hover:bg-[#256f01]"
              >
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isStatusModalOpen} onOpenChange={setIsStatusModalOpen}>
        <DialogContent className="max-w-[534px] rounded-[22px] border-none p-0 shadow-[0_24px_60px_rgba(16,24,40,0.18)]">
          <div className="relative px-12 pb-12 pt-14">
            <DialogClose className="absolute right-8 top-7 flex h-8 w-8 items-center justify-center rounded-full border border-[#667085] text-[#667085] transition hover:bg-slate-50">
              <X className="h-4 w-4" />
            </DialogClose>

            <h2 className="text-center text-[18px] font-semibold text-[#101828]">
              Profile status
            </h2>

            <div className="mx-auto mt-10 max-w-[345px]">
              <p className="text-[15px] font-semibold text-[#344054]">Status:</p>

              <div className="mt-4 flex items-center justify-between gap-6">
                <div>
                  <p
                    className={draftStatus ? "text-[15px] font-medium text-[#2E8902]" : "text-[15px] font-medium text-[#667085]"}
                  >
                    {draftStatus ? "Active" : "Inactive"}
                  </p>
                  <p className="mt-1 text-[15px] leading-6 text-[#344054]">
                    {admin.email} account is {draftStatus ? "active" : "inactive"}
                  </p>
                </div>

                <Switch
                  checked={draftStatus}
                  onCheckedChange={setDraftStatus}
                  className="h-[28px] w-[46px] border-0 bg-[#D0D5DD] data-[state=checked]:bg-[#2E8902]"
                />
              </div>
            </div>

            <div className="mt-10 flex justify-center">
              <Button
                onClick={handleSaveStatus}
                className="h-[43px] min-w-[162px] rounded-[9px] bg-[#2E8902] text-white hover:bg-[#256f01]"
              >
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
};

export default Page;
