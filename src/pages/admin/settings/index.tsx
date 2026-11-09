import { Fragment, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronRight,
  Lock,
  MoreVertical,
  Plus,
} from "lucide-react";

import { Head } from "@/components/shared";
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

type TabType =
  | "access-management"
  | "password-reset"
  | "change-authentication-pin";

type AdminAccount = {
  id: number;
  email: string;
  role: string;
  permissionCount: number;
  status: "Active" | "Inactive";
};

const adminAccounts: AdminAccount[] = [
  {
    id: 1,
    email: "Cadbur@gmail.com",
    role: "Super admin",
    permissionCount: 2,
    status: "Active",
  },
  {
    id: 2,
    email: "Reshaped@gmail.com",
    role: "Admin",
    permissionCount: 3,
    status: "Inactive",
  },
  {
    id: 3,
    email: "Factorized@gmail.com",
    role: "Admin",
    permissionCount: 5,
    status: "Active",
  },
  {
    id: 4,
    email: "Asqtech@gmail.com",
    role: "Admin",
    permissionCount: 1,
    status: "Active",
  },
  {
    id: 5,
    email: "TrustMaxwellyou@gmail.com",
    role: "Admin",
    permissionCount: 4,
    status: "Active",
  },
  {
    id: 6,
    email: "Quotient@gmail.com",
    role: "Admin",
    permissionCount: 2,
    status: "Active",
  },
  {
    id: 7,
    email: "FemiUpkon@gmail.com",
    role: "Admin",
    permissionCount: 1,
    status: "Active",
  },
];

const roleOptions = ["Super admin", "Admin", "Regulator"] as const;

const Page = () => {
  const [activeTab, setActiveTab] = useState<TabType>("access-management");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
  });
  const { toast } = useToast();

  const pageSummary = useMemo(() => {
    const activeCount = adminAccounts.filter(
      ({ status }) => status === "Active",
    ).length;

    return {
      total: adminAccounts.length,
      active: activeCount,
      inactive: adminAccounts.length - activeCount,
    };
  }, []);

  const handleAddAdmin = () => {
    setIsAddModalOpen(false);
    toast({
      variant: "success",
      title: "Admin added successfully",
      description: `${formData.firstName} ${formData.lastName} has been added as ${formData.role}.`,
    });
    setFormData({ firstName: "", lastName: "", email: "", role: "" });
  };

  return (
    <Fragment>
      <Head title="Settings" />

      <div className="px-8 py-9">
        <div className="max-w-[1110px]">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="inline-flex items-center text-[#17191C]"
            >
              <ArrowLeft className="h-[18px] w-[18px]" strokeWidth={2} />
            </Link>
            <h1 className="text-[18px] font-semibold leading-none text-[#17191C]">
              Settings
            </h1>
          </div>

          <div className="mt-7 border-b border-[#EAECF0]">
            <nav className="flex items-center gap-9">
              <button
                type="button"
                onClick={() => setActiveTab("access-management")}
                className={cn(
                  "relative pb-5 text-[15px] font-medium transition-colors",
                  activeTab === "access-management"
                    ? "text-[#2E8902]"
                    : "text-[#667085]",
                )}
              >
                Access management
                {activeTab === "access-management" && (
                  <span className="absolute inset-x-0 bottom-0 h-[2px] bg-[#2E8902]" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("password-reset")}
                className={cn(
                  "relative pb-5 text-[15px] font-medium transition-colors",
                  activeTab === "password-reset"
                    ? "text-[#2E8902]"
                    : "text-[#667085]",
                )}
              >
                Password reset
                {activeTab === "password-reset" && (
                  <span className="absolute inset-x-0 bottom-0 h-[2px] bg-[#2E8902]" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("change-authentication-pin")}
                className={cn(
                  "relative pb-5 text-[15px] font-medium transition-colors",
                  activeTab === "change-authentication-pin"
                    ? "text-[#2E8902]"
                    : "text-[#667085]",
                )}
              >
                Change authentication pin
                {activeTab === "change-authentication-pin" && (
                  <span className="absolute inset-x-0 bottom-0 h-[2px] bg-[#2E8902]" />
                )}
              </button>
            </nav>
          </div>

          {activeTab === "access-management" && (
            <section className="pt-10">
              <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-[17px] font-semibold text-[#101828]">
                    View Admin Accounts
                  </h2>
                  <p className="mt-1 text-sm text-[#667085]">
                    {pageSummary.total} accounts, {pageSummary.active} active,{" "}
                    {pageSummary.inactive} inactive.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-6">
                  <Link
                    href="/admin/settings/roles-permissions"
                    className="inline-flex items-center gap-2 text-[15px] font-medium text-[#69A10E]"
                  >
                    <Lock className="h-[16px] w-[16px]" />
                    <span>Manage Roles And Permissions</span>
                  </Link>

                  <Button
                    onClick={() => setIsAddModalOpen(true)}
                    className="h-[46px] rounded-full bg-[#3D9B09] px-6 text-[15px] font-medium text-white hover:bg-[#318106]"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Admin
                  </Button>
                </div>
              </div>

              <div className="overflow-hidden rounded-[16px] border border-[#EAECF0] bg-white">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-[#EAECF0] bg-white">
                      <th className="w-[60px] px-5 py-4 text-left text-[13px] font-medium text-[#667085]">
                        NO
                      </th>
                      <th className="px-5 py-4 text-left text-[13px] font-medium text-[#667085]">
                        <div className="flex items-center gap-1">
                          Email
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M8 3.33301V12.6663M8 12.6663L12 8.66634M8 12.6663L4 8.66634"
                              stroke="#667085"
                              strokeWidth="1.2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      </th>
                      <th className="px-5 py-4 text-left text-[13px] font-medium text-[#667085]">
                        User role
                      </th>
                      <th className="px-5 py-4 text-left text-[13px] font-medium text-[#667085]">
                        Permission
                      </th>
                      <th className="px-5 py-4 text-left text-[13px] font-medium text-[#667085]">
                        Status
                      </th>
                      <th className="w-[52px] px-5 py-4" />
                    </tr>
                  </thead>

                  <tbody>
                    {adminAccounts.map((admin, index) => (
                      <tr
                        key={admin.id}
                        className="border-b border-[#EAECF0] last:border-b-0"
                      >
                        <td className="px-5 py-[22px] text-[15px] text-[#101828]">
                          {index + 1}
                        </td>
                        <td className="px-5 py-[22px] text-[15px] font-medium text-[#101828]">
                          {admin.email}
                        </td>
                        <td className="px-5 py-[22px] text-[15px] text-[#101828]">
                          {admin.role}
                        </td>
                        <td className="px-5 py-[22px] text-[15px] text-[#101828]">
                          {admin.permissionCount}
                        </td>
                        <td className="px-5 py-[22px]">
                          <span
                            className={cn(
                              "inline-flex rounded-full px-3 py-1 text-[13px] font-medium",
                              admin.status === "Active"
                                ? "bg-[#F1FFFC] text-[#12B76A]"
                                : "bg-[#FFF5F4] text-[#F04438]",
                            )}
                          >
                            {admin.status}
                          </span>
                        </td>
                        <td className="px-5 py-[22px] text-right">
                          <Link
                            href={`/admin/settings/users/${admin.id}`}
                            className="inline-flex text-[#98A2B3]"
                          >
                            <MoreVertical className="h-5 w-5" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="flex items-center justify-between border-t border-[#EAECF0] px-5 py-4">
                  <Button
                    variant="outline"
                    className="h-[38px] rounded-[8px] border-[#D0D5DD] bg-white px-5 text-[#344054]"
                  >
                    Previous
                  </Button>

                  <p className="text-[15px] text-[#344054]">Page 1 of 10</p>

                  <Button
                    variant="outline"
                    className="h-[38px] rounded-[8px] border-[#D0D5DD] bg-white px-5 text-[#344054]"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </section>
          )}

          {activeTab === "password-reset" && (
            <section className="pt-10">
              <div className="rounded-[16px] border border-[#EAECF0] bg-white p-6">
                <h2 className="text-[17px] font-semibold text-[#101828]">
                  Password reset
                </h2>
                <p className="mt-2 text-[15px] text-[#667085]">
                  Password reset settings will appear here.
                </p>
              </div>
            </section>
          )}

          {activeTab === "change-authentication-pin" && (
            <section className="pt-10">
              <div className="rounded-[16px] border border-[#EAECF0] bg-white p-6">
                <h2 className="text-[17px] font-semibold text-[#101828]">
                  Change authentication pin
                </h2>
                <p className="mt-2 text-[15px] text-[#667085]">
                  Authentication pin settings will appear here.
                </p>
              </div>
            </section>
          )}
        </div>
      </div>

      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-[520px] rounded-[22px] border-none p-0 shadow-[0_24px_60px_rgba(16,24,40,0.18)]">
          <div className="px-8 py-8">
            <div className="mb-6">
              <h3 className="text-[18px] font-semibold text-[#101828]">
                Add New Admin
              </h3>
              <p className="mt-1 text-sm text-[#667085]">
                Create a new admin account and assign a role.
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="first-name">First name</Label>
                  <Input
                    id="first-name"
                    className="mt-2 h-11 rounded-[10px]"
                    value={formData.firstName}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        firstName: event.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="last-name">Last name</Label>
                  <Input
                    id="last-name"
                    className="mt-2 h-11 rounded-[10px]"
                    value={formData.lastName}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        lastName: event.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  className="mt-2 h-11 rounded-[10px]"
                  value={formData.email}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      email: event.target.value,
                    }))
                  }
                />
              </div>

              <div>
                <Label htmlFor="role">Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, role: value }))
                  }
                >
                  <SelectTrigger
                    id="role"
                    className="mt-2 h-11 rounded-[10px]"
                  >
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roleOptions.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <DialogClose asChild>
                <Button
                  variant="outline"
                  className="h-11 rounded-[10px] border-[#D0D5DD] bg-white px-5 text-[#344054]"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                onClick={handleAddAdmin}
                className="h-11 rounded-[10px] bg-[#2E8902] px-5 text-white hover:bg-[#256f01]"
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
