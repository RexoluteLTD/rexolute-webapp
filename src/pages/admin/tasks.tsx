import React, { Fragment, ReactNode, useEffect, useState } from "react";
import Image from "next/image";
import { getSession } from "next-auth/react";
import { GetServerSideProps } from "next/types";
import { useRouter } from "next/router";
import { ArrowRight, Loader } from "lucide-react";

import { Head } from "@/components/shared";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui";
import { useAxiosInterceptors } from "@/hooks";
import { useSharedData } from "@/hooks/use-layout";
import { parseAxiosError } from "@/lib/api";
import { DateTimeFormatter as datetime } from "@/lib/utils";
import { ResponseList, TherapistProfile } from "@/types";

type TaskTab = "sessions" | "therapists" | "students";

type SessionTask = {
  id: string;
  name: string;
  email?: string;
  date?: string;
  gender?: string;
  degree?: string;
  experience?: string;
};

type StudentTask = {
  id: string;
  name: string;
  email?: string;
  date?: string;
  gender?: string;
  degree?: string;
  experience?: string;
};

type TableSectionProps = {
  children: ReactNode;
  emptyMessage: string;
  hasItems: boolean;
};

const ensureArray = <T,>(value: T[] | null | undefined): T[] =>
  Array.isArray(value) ? value : [];

const renderAvatarCell = (
  name: string,
  email?: string,
  imageSrc = "/graphics/svg/placeholder.svg",
) => (
  <div className="flex items-center gap-3">
    <div className="h-10 w-10 overflow-hidden rounded-full">
      <Image
        src={imageSrc}
        alt={name}
        width={40}
        height={40}
        className="h-full w-full object-cover"
      />
    </div>
    <div>
      <div className="font-medium">{name}</div>
      <div className="text-sm text-muted-foreground">{email ?? "-"}</div>
    </div>
  </div>
);

const TableSection = ({
  children,
  emptyMessage,
  hasItems,
}: TableSectionProps) => {
  if (!hasItems) {
    return (
      <div className="rounded-md border bg-white px-4 py-10 text-center text-sm text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return <div className="rounded-md border">{children}</div>;
};

const Page = () => {
  const router = useRouter();
  const api = useAxiosInterceptors();
  const { setData, setIsLoading: setIsLoadingData } = useSharedData();

  const [currentTab, setCurrentTab] = useState<TaskTab>("therapists");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [newTherapists, setNewTherapists] = useState<TherapistProfile[] | null>(
    [],
  );
  const [newSessions, setNewSessions] = useState<SessionTask[] | null>([]);
  const [newStudents, setNewStudents] = useState<StudentTask[] | null>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      const [therapistsResult, sessionsResult, studentsResult] =
        await Promise.allSettled([
          api.get(
            "/account/profile/therapists?where=is_approved:false,is_onboarded:true",
          ),
          api.get("/cms/sessions/therapy?where=status:resheduled"),
          api.get(
            "/account/profile/clients?where=subscription:student,status:pending",
          ),
        ]);

      const errors: string[] = [];

      if (therapistsResult.status === "fulfilled") {
        const { items } = (therapistsResult.value.data?.data ??
          {}) as ResponseList;
        setNewTherapists(ensureArray(items as TherapistProfile[] | null));
      } else {
        setNewTherapists([]);
        errors.push(parseAxiosError(therapistsResult.reason).message);
      }

      if (sessionsResult.status === "fulfilled") {
        const { items } = (sessionsResult.value.data?.data ??
          {}) as ResponseList;
        setNewSessions(ensureArray(items as SessionTask[] | null));
      } else {
        setNewSessions([]);
        errors.push(parseAxiosError(sessionsResult.reason).message);
      }

      if (studentsResult.status === "fulfilled") {
        const { items } = (studentsResult.value.data?.data ??
          {}) as ResponseList;
        setNewStudents(ensureArray(items as StudentTask[] | null));
      } else {
        setNewStudents([]);
        errors.push(parseAxiosError(studentsResult.reason).message);
      }

      if (errors.length > 0) {
        setErrorMessage(errors[0]);
      }

      setIsLoading(false);
    };

    fetchTasks();
  }, [api]);

  const gotoTherapistProfile = (therapist: TherapistProfile) => {
    setData(therapist);
    setIsLoadingData(true);
    router.push("/admin/therapists/verification/profile-setup");
  };

  const therapistTasks = ensureArray(newTherapists);
  const sessionTasks = ensureArray(newSessions);
  const studentTasks = ensureArray(newStudents);

  const totalPendingTasks =
    sessionTasks.length + studentTasks.length + therapistTasks.length;

  return (
    <Fragment>
      <Head title="Pending Tasks" />

      <div className="px-6">
        <div className="py-6 md:max-w-[80%]">
          <h1 className="text-2xl font-bold text-gray-900">
            Pending Tasks ({totalPendingTasks})
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Below are the pending tasks needing your attention.
          </p>
        </div>

        {isLoading ? (
          <div className="flex min-h-[240px] items-center justify-center rounded-md border bg-white">
            <Loader className="h-6 w-6 animate-spin text-gray-500" />
          </div>
        ) : (
          <Tabs value={currentTab} onValueChange={(value) => setCurrentTab(value as TaskTab)}>
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="sessions">
                Reassigned sessions ({sessionTasks.length})
              </TabsTrigger>
              <TabsTrigger value="therapists">
                Profile set-up ({therapistTasks.length})
              </TabsTrigger>
              <TabsTrigger value="students">
                Student registration ({studentTasks.length})
              </TabsTrigger>
            </TabsList>

            {errorMessage && (
              <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorMessage}
              </p>
            )}

            <TabsContent value="sessions" className="mt-6">
              <TableSection
                hasItems={sessionTasks.length > 0}
                emptyMessage="No reassigned sessions found."
              >
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
                    {sessionTasks.map((session) => (
                      <TableRow key={session.id}>
                        <TableCell>
                          {renderAvatarCell(session.name, session.email)}
                        </TableCell>
                        <TableCell>{session.date ?? "-"}</TableCell>
                        <TableCell>{session.gender ?? "-"}</TableCell>
                        <TableCell>{session.degree ?? "-"}</TableCell>
                        <TableCell>{session.experience ?? "-"}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            onClick={() => router.push("/admin/sessions")}
                            aria-label="View session tasks"
                            title="View session tasks"
                          >
                            <ArrowRight />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableSection>
            </TabsContent>

            <TabsContent value="therapists" className="mt-6">
              <TableSection
                hasItems={therapistTasks.length > 0}
                emptyMessage="No therapist profile set-up tasks found."
              >
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Therapist name</TableHead>
                      <TableHead>Date of birth</TableHead>
                      <TableHead>Gender</TableHead>
                      <TableHead>Highest degree</TableHead>
                      <TableHead>Years of experience</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {therapistTasks.map((therapist) => (
                      <TableRow key={therapist.user_id}>
                        <TableCell>
                          {renderAvatarCell(
                            therapist.name,
                            therapist.email,
                            therapist.profile_img,
                          )}
                        </TableCell>
                        <TableCell>
                          {datetime.formatWithPattern(
                            datetime.toDateTime(therapist.dob),
                            "D MMM, YYYY",
                          )}
                        </TableCell>
                        <TableCell>{therapist.gender}</TableCell>
                        <TableCell>{therapist.doc.degree_type}</TableCell>
                        <TableCell>{therapist.doc.years_exp}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            onClick={() => gotoTherapistProfile(therapist)}
                            aria-label="View therapist details"
                            title="View therapist details"
                          >
                            <ArrowRight />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableSection>
            </TabsContent>

            <TabsContent value="students" className="mt-6">
              <TableSection
                hasItems={studentTasks.length > 0}
                emptyMessage="No student registration tasks found."
              >
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student name</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Gender</TableHead>
                      <TableHead>Highest degree</TableHead>
                      <TableHead>Years of experience</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {studentTasks.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>
                          {renderAvatarCell(student.name, student.email)}
                        </TableCell>
                        <TableCell>{student.date ?? "-"}</TableCell>
                        <TableCell>{student.gender ?? "-"}</TableCell>
                        <TableCell>{student.degree ?? "-"}</TableCell>
                        <TableCell>{student.experience ?? "-"}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            onClick={() => router.push("/admin/users")}
                            aria-label="View student registrations"
                            title="View student registrations"
                          >
                            <ArrowRight />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableSection>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </Fragment>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/admin/login",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default Page;
