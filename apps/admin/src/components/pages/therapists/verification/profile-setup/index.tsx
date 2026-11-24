import { PaginatedDocument } from "../../../../components/documents/file-viewer";


import { Fragment, useEffect, useState } from "react";
import { useRouter } from "@tanstack/react-router";

import { ArrowLeft } from "lucide-react";
import { Dialog, DialogTrigger } from "@rexolute/ui/dialog";
import { Button } from "@rexolute/ui/button";
import { Card, CardContent } from "@rexolute/ui/card";
import { Tabs, TabsContent } from "@rexolute/ui/tabs";
import { Skeleton } from "@rexolute/ui/skeleton";
import { CheckIcon } from "@rexolute/ui/icons";
import Head from "@rexolute/ui/head";

import { useAxiosInterceptors, useToast } from "../../../../hooks";
import {
  ApproveForm,
  ApproveFormSchema,
  RejectForm,
  RejectFormSchema,
} from "../../../../components/admin/forms";
import {
  accountApproval,
  accountRejected,
  therapistApprovalSteps as steps,
} from "../../../../lib/constants";
import { useSharedData } from "../../../../hooks/use-layout";
import {
  AccountApproval,
  AccountRejected,
  GalleryItem,
  Reason,
  Task,
  TherapistProfile,
} from "@rexolute/types";
import {
  capitalizeFirstLetter,
  DateTimeFormatter as datetime,
} from "@rexolute/utils";

type TabStep = {
  id: string;
  valid: "valid" | "invalid";
  data: Reason | null;
};

const Compare = () => {
  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
      <div className="flex flex-col items-center bg-white rounded-md shadow-md p-2">
        <div className="flex flex-col items-center">
          {/* <ArrowLeft className="h-4 w-4 rotate-90" /> */}
          {/* <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
          Compare
        </Button> */}
          {/* <ArrowLeft className="h-4 w-4 -rotate-90" /> */}
          <svg
            width="80"
            height="40"
            viewBox="0 0 50 33"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M37.3536 4.03568C37.5488 3.84042 37.5488 3.52384 37.3536 3.32858L34.1716 0.146597C33.9763 -0.0486654 33.6597 -0.0486654 33.4645 0.146597C33.2692 0.341859 33.2692 0.658441 33.4645 0.853704L36.2929 3.68213L33.4645 6.51056C33.2692 6.70582 33.2692 7.0224 33.4645 7.21766C33.6597 7.41293 33.9763 7.41293 34.1716 7.21766L37.3536 4.03568ZM13 4.18213L37 4.18213L37 3.18213L13 3.18213L13 4.18213Z"
              fill="#5E5959"
            />
            <path
              d="M8.20465 19.7621C7.47798 19.7621 6.86798 19.6088 6.37465 19.3021C5.88798 18.9955 5.52132 18.5721 5.27465 18.0321C5.02798 17.4921 4.90465 16.8688 4.90465 16.1621C4.90465 15.4555 5.02798 14.8288 5.27465 14.2821C5.52798 13.7355 5.89798 13.3088 6.38465 13.0021C6.87798 12.6888 7.48798 12.5321 8.21465 12.5321C8.74132 12.5321 9.20132 12.6188 9.59465 12.7921C9.98798 12.9588 10.3046 13.1988 10.5446 13.5121C10.7913 13.8188 10.9546 14.1855 11.0346 14.6121H9.99465C9.89465 14.2721 9.69132 14.0021 9.38465 13.8021C9.07798 13.6021 8.68465 13.5021 8.20465 13.5021C7.67132 13.5021 7.24132 13.6255 6.91465 13.8721C6.59465 14.1188 6.36132 14.4421 6.21465 14.8421C6.06798 15.2355 5.99465 15.6621 5.99465 16.1221C5.99465 16.5955 6.07132 17.0355 6.22465 17.4421C6.37798 17.8488 6.62132 18.1755 6.95465 18.4221C7.28798 18.6688 7.71465 18.7921 8.23465 18.7921C8.55465 18.7921 8.83798 18.7488 9.08465 18.6621C9.33132 18.5688 9.53798 18.4388 9.70465 18.2721C9.87132 18.0988 9.98465 17.8988 10.0446 17.6721H11.1546C11.068 18.1055 10.8913 18.4788 10.6246 18.7921C10.358 19.1055 10.0213 19.3455 9.61465 19.5121C9.20798 19.6788 8.73798 19.7621 8.20465 19.7621ZM14.315 19.7421C13.7683 19.7421 13.305 19.6321 12.925 19.4121C12.545 19.1855 12.255 18.8688 12.055 18.4621C11.8616 18.0555 11.765 17.5855 11.765 17.0521C11.765 16.5121 11.865 16.0421 12.065 15.6421C12.265 15.2355 12.555 14.9188 12.935 14.6921C13.315 14.4588 13.7783 14.3421 14.325 14.3421C14.8716 14.3421 15.335 14.4588 15.715 14.6921C16.095 14.9188 16.3816 15.2355 16.575 15.6421C16.7683 16.0488 16.865 16.5221 16.865 17.0621C16.865 17.5888 16.765 18.0555 16.565 18.4621C16.3716 18.8688 16.085 19.1855 15.705 19.4121C15.3316 19.6321 14.8683 19.7421 14.315 19.7421ZM14.315 18.8221C14.675 18.8221 14.965 18.7421 15.185 18.5821C15.4116 18.4221 15.5783 18.2088 15.685 17.9421C15.7916 17.6688 15.845 17.3721 15.845 17.0521C15.845 16.7321 15.7916 16.4388 15.685 16.1721C15.5783 15.9055 15.4116 15.6921 15.185 15.5321C14.965 15.3655 14.675 15.2821 14.315 15.2821C13.9616 15.2821 13.6716 15.3655 13.445 15.5321C13.2183 15.6921 13.0516 15.9055 12.945 16.1721C12.845 16.4388 12.795 16.7321 12.795 17.0521C12.795 17.3788 12.845 17.6755 12.945 17.9421C13.0516 18.2088 13.2183 18.4221 13.445 18.5821C13.6716 18.7421 13.9616 18.8221 14.315 18.8221ZM17.722 19.6821V14.4121H18.692L18.752 15.0321C18.872 14.8588 19.0053 14.7255 19.152 14.6321C19.3053 14.5321 19.4687 14.4588 19.642 14.4121C19.8153 14.3655 19.992 14.3421 20.172 14.3421C20.5253 14.3421 20.8153 14.4155 21.042 14.5621C21.2753 14.7088 21.4553 14.9088 21.582 15.1621C21.7087 14.9821 21.852 14.8321 22.012 14.7121C22.172 14.5855 22.3487 14.4921 22.542 14.4321C22.7353 14.3721 22.942 14.3421 23.162 14.3421C23.5553 14.3421 23.872 14.4288 24.112 14.6021C24.3587 14.7688 24.5353 14.9955 24.642 15.2821C24.7553 15.5688 24.812 15.8988 24.812 16.2721V19.6821H23.772V16.6821C23.772 16.5221 23.7653 16.3621 23.752 16.2021C23.7387 16.0421 23.6987 15.8921 23.632 15.7521C23.572 15.6055 23.482 15.4888 23.362 15.4021C23.2487 15.3088 23.0853 15.2621 22.872 15.2621C22.6653 15.2621 22.492 15.3088 22.352 15.4021C22.2187 15.4955 22.1087 15.6221 22.022 15.7821C21.942 15.9355 21.882 16.1021 21.842 16.2821C21.8087 16.4621 21.792 16.6421 21.792 16.8221V19.6821H20.752V16.6721C20.752 16.5188 20.7453 16.3621 20.732 16.2021C20.7187 16.0421 20.6853 15.8921 20.632 15.7521C20.5787 15.6055 20.4887 15.4888 20.362 15.4021C20.242 15.3088 20.0787 15.2621 19.872 15.2621C19.572 15.2621 19.3387 15.3488 19.172 15.5221C19.012 15.6888 18.902 15.8955 18.842 16.1421C18.782 16.3821 18.752 16.6121 18.752 16.8321V19.6821H17.722ZM25.8228 21.6021V14.4121H26.8028L26.8528 15.1621C27.0394 14.8888 27.2828 14.6855 27.5828 14.5521C27.8828 14.4121 28.2094 14.3421 28.5628 14.3421C29.0894 14.3421 29.5228 14.4621 29.8628 14.7021C30.2028 14.9355 30.4561 15.2588 30.6228 15.6721C30.7894 16.0788 30.8728 16.5355 30.8728 17.0421C30.8728 17.5621 30.7861 18.0255 30.6128 18.4321C30.4461 18.8388 30.1861 19.1588 29.8328 19.3921C29.4861 19.6255 29.0461 19.7421 28.5128 19.7421C28.2594 19.7421 28.0261 19.7155 27.8128 19.6621C27.6061 19.6088 27.4228 19.5321 27.2628 19.4321C27.1094 19.3255 26.9728 19.2021 26.8528 19.0621V21.6021H25.8228ZM28.3828 18.8221C28.7428 18.8221 29.0294 18.7421 29.2428 18.5821C29.4561 18.4155 29.6094 18.1988 29.7028 17.9321C29.7961 17.6655 29.8428 17.3755 29.8428 17.0621C29.8428 16.7355 29.7928 16.4388 29.6928 16.1721C29.5994 15.8988 29.4428 15.6821 29.2228 15.5221C29.0094 15.3555 28.7228 15.2721 28.3628 15.2721C28.0361 15.2721 27.7594 15.3555 27.5328 15.5221C27.3061 15.6821 27.1328 15.8988 27.0128 16.1721C26.8994 16.4455 26.8428 16.7421 26.8428 17.0621C26.8428 17.3888 26.8961 17.6888 27.0028 17.9621C27.1161 18.2288 27.2861 18.4388 27.5128 18.5921C27.7461 18.7455 28.0361 18.8221 28.3828 18.8221ZM33.4161 19.7421C33.1761 19.7421 32.9427 19.7121 32.7161 19.6521C32.4961 19.5855 32.2994 19.4888 32.1261 19.3621C31.9527 19.2288 31.8127 19.0655 31.7061 18.8721C31.6061 18.6721 31.5561 18.4388 31.5561 18.1721C31.5561 17.8521 31.6161 17.5888 31.7361 17.3821C31.8627 17.1688 32.0294 17.0055 32.2361 16.8921C32.4427 16.7721 32.6794 16.6888 32.9461 16.6421C33.2194 16.5888 33.5027 16.5621 33.7961 16.5621H35.0861C35.0861 16.3021 35.0461 16.0755 34.9661 15.8821C34.8861 15.6821 34.7594 15.5288 34.5861 15.4221C34.4194 15.3088 34.1961 15.2521 33.9161 15.2521C33.7494 15.2521 33.5894 15.2721 33.4361 15.3121C33.2894 15.3455 33.1627 15.4021 33.0561 15.4821C32.9494 15.5621 32.8761 15.6688 32.8361 15.8021H31.7561C31.7961 15.5488 31.8861 15.3321 32.0261 15.1521C32.1661 14.9655 32.3394 14.8121 32.5461 14.6921C32.7527 14.5721 32.9727 14.4855 33.2061 14.4321C33.4461 14.3721 33.6894 14.3421 33.9361 14.3421C34.6961 14.3421 35.2427 14.5655 35.5761 15.0121C35.9161 15.4521 36.0861 16.0588 36.0861 16.8321V19.6821H35.1961L35.1561 19.0121C35.0027 19.2188 34.8194 19.3755 34.6061 19.4821C34.3994 19.5888 34.1927 19.6588 33.9861 19.6921C33.7794 19.7255 33.5894 19.7421 33.4161 19.7421ZM33.5761 18.8721C33.8761 18.8721 34.1394 18.8221 34.3661 18.7221C34.5927 18.6155 34.7694 18.4655 34.8961 18.2721C35.0227 18.0721 35.0861 17.8388 35.0861 17.5721V17.3521H34.1461C33.9527 17.3521 33.7627 17.3588 33.5761 17.3721C33.3961 17.3788 33.2294 17.4055 33.0761 17.4521C32.9294 17.4921 32.8094 17.5621 32.7161 17.6621C32.6294 17.7621 32.5861 17.9055 32.5861 18.0921C32.5861 18.2721 32.6327 18.4188 32.7261 18.5321C32.8194 18.6455 32.9427 18.7321 33.0961 18.7921C33.2494 18.8455 33.4094 18.8721 33.5761 18.8721ZM37.122 19.6821V14.4121H38.092L38.142 15.1721C38.2753 14.9655 38.4287 14.8021 38.602 14.6821C38.7753 14.5621 38.9653 14.4755 39.172 14.4221C39.3787 14.3688 39.5953 14.3421 39.822 14.3421C39.882 14.3421 39.9387 14.3421 39.992 14.3421C40.0453 14.3421 40.0953 14.3421 40.142 14.3421V15.3321H39.822C39.442 15.3321 39.1253 15.4088 38.872 15.5621C38.6253 15.7155 38.442 15.9288 38.322 16.2021C38.2087 16.4755 38.152 16.7888 38.152 17.1421V19.6821H37.122ZM42.9432 19.7421C42.3898 19.7421 41.9265 19.6288 41.5532 19.4021C41.1798 19.1755 40.8965 18.8621 40.7032 18.4621C40.5165 18.0555 40.4232 17.5888 40.4232 17.0621C40.4232 16.5288 40.5198 16.0588 40.7132 15.6521C40.9132 15.2455 41.1998 14.9255 41.5732 14.6921C41.9532 14.4588 42.4098 14.3421 42.9432 14.3421C43.3498 14.3421 43.7032 14.4188 44.0032 14.5721C44.3032 14.7188 44.5498 14.9188 44.7432 15.1721C44.9432 15.4255 45.0898 15.7088 45.1832 16.0221C45.2765 16.3288 45.3165 16.6488 45.3032 16.9821C45.3032 17.0555 45.2998 17.1255 45.2932 17.1921C45.2865 17.2588 45.2798 17.3288 45.2732 17.4021H41.4632C41.4832 17.6688 41.5498 17.9121 41.6632 18.1321C41.7832 18.3521 41.9498 18.5288 42.1632 18.6621C42.3765 18.7888 42.6398 18.8521 42.9532 18.8521C43.1265 18.8521 43.2932 18.8321 43.4532 18.7921C43.6198 18.7455 43.7665 18.6755 43.8932 18.5821C44.0265 18.4821 44.1198 18.3555 44.1732 18.2021H45.2132C45.1265 18.5555 44.9698 18.8488 44.7432 19.0821C44.5232 19.3088 44.2532 19.4755 43.9332 19.5821C43.6198 19.6888 43.2898 19.7421 42.9432 19.7421ZM41.4832 16.5821H44.2832C44.2765 16.3221 44.2165 16.0921 44.1032 15.8921C43.9898 15.6855 43.8332 15.5255 43.6332 15.4121C43.4332 15.2921 43.1932 15.2321 42.9132 15.2321C42.6065 15.2321 42.3498 15.2955 42.1432 15.4221C41.9432 15.5488 41.7865 15.7155 41.6732 15.9221C41.5665 16.1221 41.5032 16.3421 41.4832 16.5821Z"
              fill="#5E5959"
            />
            <path
              d="M12.1464 28.3286C11.9512 28.5238 11.9512 28.8404 12.1464 29.0357L15.3284 32.2177C15.5237 32.4129 15.8403 32.4129 16.0355 32.2177C16.2308 32.0224 16.2308 31.7058 16.0355 31.5106L13.2071 28.6821L16.0355 25.8537C16.2308 25.6584 16.2308 25.3419 16.0355 25.1466C15.8403 24.9513 15.5237 24.9513 15.3284 25.1466L12.1464 28.3286ZM37.5 28.1821L12.5 28.1821V29.1821L37.5 29.1821V28.1821Z"
              fill="#5E5959"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default function ProfileSetupPage() {
  const {
    setIsLoading: setIsLoadingData,
    isLoading: isLoadingData,
    data: contextData,
  } = useSharedData();
  const { toast } = useToast();
  const router = useRouter();
  const api = useAxiosInterceptors();

  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [isApprovedOpen, setIsApprovedOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<TabStep[]>([]);
  const [data, setData] = useState<TherapistProfile | null>(null);
  const [docs, setDocs] = useState<GalleryItem[]>([]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (contextData) {
        const profile = contextData as TherapistProfile;
        setDocs((profile.doc?.licenses ?? []).map(({ url }, index) => ({
          id: index, url: url ?? "/cert1.png", title: `Document ${index + 1}`,
        })));
        setData(profile);
      }
      setIsLoadingData(false);
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [contextData, setIsLoadingData]);

  const handleStepChange = (tab: TabStep) => {
    if (activeStep < steps.length - 1) {
      setCompletedSteps((prev) => [...prev, tab]);
      setActiveStep(activeStep + 1);
      return;
    }
  };

  const handleTabChange = (value: string) => {
    const index = steps.findIndex((step) => step.id === value);
    setActiveStep(index);
  };

  const onSubmit = async (value: ApproveFormSchema | RejectFormSchema) => {
    console.log("submitting...", value);

    if (activeStep >= steps.length - 1) {
      const steps = completedSteps.filter(({ data }) => data !== null);
      const reasons: Reason[] = [
        ...steps.map(({ data, id }) => ({
          ...data!,
          value: `${data?.value} (${capitalizeFirstLetter(id)} Documents)`,
        })),
      ];

      if ("reason" in value) {
        reasons.push({
          value: `${value.reason} (Identification Documents)`,
          comment: value.comment,
        });
      }

      const approvalPayload: AccountApproval = {
        email: data?.email ?? "",
        user_id: data?.user_id ?? "",
        phone_number: data?.phone_number ?? "",
      };

      const rejectedPayload: AccountRejected = {
        ...approvalPayload,
        reasons,
      };

      const event = reasons.length > 0 ? accountRejected : accountApproval;
      const payload = reasons.length > 0 ? rejectedPayload : approvalPayload;

      const body: Task = {
        event,
        payload,
      };

      await api.patch(`/account/verify/therapists/${data?.user_id}`, body);

      // Final approval
      reasons.length > 0
        ? toast({
            variant: "destructive",
            title: "Profile set-up not approved",
            description: `${data?.name} account has not been approved.`,
          })
        : toast({
            variant: "success",
            title: "Profile set-up approved",
            description: `${data?.name} account has been approved.`,
          });

      // Redirect to the dashboard after a short delay
      setTimeout(() => router.history.back(), 2000);
    }

    if ("reason" in value) {
      // Reject form: mark the current step as invalid with provided reason/comment
      handleStepChange({
        id: steps[activeStep].id,
        valid: "invalid",
        data: { value: value.reason, comment: value.comment },
      });
      setIsRejectOpen(false);
      return;
    } else {
      // Approve form: mark the current step as valid
      handleStepChange({
        id: steps[activeStep].id,
        valid: "valid",
        data: null,
      });
      setIsApprovedOpen(false);
      return;
    }
  };

  // const onApproveSubmit = async (value: ApproveFormSchema) => {
  // await new Promise((resolve, reject) => {
  //   setTimeout(() => {
  //     resolve({ data: "success!" });
  //   }, 3000);
  // });

  // await new Promise((resolve, reject) => {
  //   setTimeout(() => {
  //     reject(new Error("Async operation failed after 1 second"));
  //   }, 5000);
  // });
  // console.log("submitting...", value);

  // if (activeStep >= steps.length - 1) {
  //   await new Promise((resolve, reject) => {
  //     setTimeout(() => {
  //       resolve({ data: "success!" });
  //     }, 3000);
  //   });

  // Final approval
  //     toast({
  //       variant: "success",
  //       title: "Profile set-up approved",
  //       description: "James Bully account has been approved.",
  //     });

  //     // Redirect to the dashboard after a short delay
  //     setTimeout(() => {
  //       router.replace("/therapists");
  //     }, 2000);
  //   }

  //   handleStepChange({ id: steps[activeStep].id, valid: "valid", data: null });
  //   setIsApprovedOpen(false);
  // };

  return (
    <Fragment>
      <Head title="Therapist Verification" />
      <div className="py-6">
        <div className="flex flex-col gap-6 px-6 mb-12">
          <div className="flex items-center gap-2">
            {/* <Link to="/therapists/verification"> */}
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => router.history.back()}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            {/* </Link> */}
            <h1 className="text-2xl font-semibold">Review profile setup</h1>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Pending task</span>
            <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full">
              Profile setup
            </span>
          </div>

          {isLoadingData && (
            <div className="container space-y-2 py-12">
              <div className="space-y-2 ">
                <Skeleton className="h-[100px] w-[100%]" />
                <Skeleton className="h-[65px]  w-[80%]" />
                <Skeleton className="h-[35px] w-[65%]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>

              <div className="space-y-2 py-12">
                <Skeleton className="h-[100px] w-[100%]" />
                <Skeleton className="h-[65px]  w-[80%]" />
                <Skeleton className="h-[35px] w-[65%]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
              {/* <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div> */}
            </div>
          )}

          {!isLoadingData && data && (
            <Fragment>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <Card className="md:col-span-1">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-full overflow-hidden mb-4">
                      <img
                        src={
                          data.profile_img ??
                          "/svg/placeholder.svg?height=80&width=80"
                        }
                        alt={data.name}
                        width={80}
                        height={80}
                        className="object-cover"
                      />
                    </div>
                    <h2 className="text-xl font-semibold">{data.name}</h2>
                    <p className="text-sm text-muted-foreground">
                      {data.email}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {data.phone_number}
                    </p>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2">
                  <CardContent className="p-6">
                    <div className="mb-6">
                      <h3 className="text-sm font-medium mb-4">
                        AREA OF EXPERTISE ({data.expertise.length})
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {data.expertise.map((item) => (
                          <span
                            key={item?.id}
                            className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                          >
                            {item?.value}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-4">
                        AREA OF SPECIALTIES ({data.specialities.length})
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {data.specialities.map((item) => (
                          <span
                            key={item?.id}
                            className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                          >
                            {item?.value}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {steps.map((step, index) => {
                  const completed = completedSteps.find(
                    (s) => s.id === step.id,
                  );
                  const isActive = activeStep === index;
                  const isUpcoming = index > activeStep;

                  console.log(completed);

                  return (
                    <Card
                      key={step.id}
                      className={`relative ${
                        isActive ? "ring-2 ring-green-600" : ""
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-2">
                          <div>
                            <h3 className="font-medium">{step.title}</h3>
                            <p className="text-xs text-muted-foreground">
                              {step.description}
                            </p>
                          </div>
                          {completed ? (
                            <div className="mt-1 flex h-5 w-5 items-center justify-center rounded-full ">
                              <CheckIcon
                                className="h-3 w-3"
                                fill={
                                  completed.valid === "valid"
                                    ? "#2E8902"
                                    : "#F04438"
                                }
                              />
                            </div>
                          ) : (
                            <div className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-gray-100">
                              <span className="text-xs">{index + 1}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <Tabs
                value={steps[activeStep].id}
                onValueChange={handleTabChange}
              >
                <TabsContent value="professional">
                  <div className="relative grid grid-cols-1 gap-6 md:grid-cols-2">
                    <Card>
                      <CardContent className="p-6">
                        <h3 className="text-lg font-medium mb-6">
                          USER INFORMATION
                        </h3>
                        <div className="space-y-6">
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">
                              Full name
                            </div>
                            <div className="font-medium">{data.name}</div>
                          </div>

                          <div>
                            <div className="text-sm text-muted-foreground mb-1">
                              Issuing authority
                            </div>
                            <div className="font-medium">
                              {data.doc.license_issuer}
                            </div>
                          </div>

                          <div>
                            <div className="text-sm text-muted-foreground mb-1">
                              Licence number
                            </div>
                            <div className="font-medium">
                              {data.doc.license_number}
                            </div>
                          </div>

                          <div>
                            <div className="text-sm text-muted-foreground mb-1">
                              Years of experience
                            </div>
                            <div className="font-medium">
                              {data.doc.years_exp}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Compare />

                    <div className="relative">
                      <Card>
                        <CardContent className="p-6">
                          <h3 className="text-lg font-medium mb-6">
                            UPLOADED DOCUMENT
                          </h3>

                          <PaginatedDocument items={docs} />

                          {/* <DocumentViewer
                          fileUrl={"/cert1.png"}
                          filename="Professional License"
                        /> */}
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="educational">
                  <div className="relative grid grid-cols-1 gap-6 md:grid-cols-2">
                    <Card>
                      <CardContent className="p-6">
                        <h3 className="text-lg font-medium mb-6">
                          USER INFORMATION
                        </h3>
                        <div className="space-y-6">
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">
                              Full name
                            </div>
                            <div className="font-medium">{data.name}</div>
                          </div>

                          <div>
                            <div className="text-sm text-muted-foreground mb-1">
                              Highest degree earned
                            </div>
                            <div className="font-medium">
                              {data.doc.degree_type}
                            </div>
                          </div>

                          <div>
                            <div className="text-sm text-muted-foreground mb-1">
                              Institution name
                            </div>
                            <div className="font-medium">
                              {data.doc.degree_issuer}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Compare />

                    <div className="relative">
                      <Card>
                        <CardContent className="p-6">
                          <h3 className="text-lg font-medium mb-6">
                            UPLOADED DOCUMENT
                          </h3>

                          <PaginatedDocument items={docs} />

                          {/* <DocumentViewer
                          fileUrl={"/cert1.png"}
                          filename="Professional License"
                        /> */}
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="identity">
                  <div className="relative grid grid-cols-1 gap-6 md:grid-cols-2">
                    <Card>
                      <CardContent className="p-6">
                        <h3 className="text-lg font-medium mb-6">
                          USER INFORMATION
                        </h3>
                        <div className="space-y-6">
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">
                              Full name
                            </div>
                            <div className="font-medium">{data.name}</div>
                          </div>

                          <div className="grid grid-cols-2 gap-6">
                            <div>
                              <div className="text-sm text-muted-foreground mb-1">
                                Sex
                              </div>
                              <div className="font-medium capitalize">
                                {data.gender}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm text-muted-foreground mb-1">
                                Date of birth
                              </div>
                              <div className="font-medium">
                                {datetime.formatWithPattern(
                                  datetime.toDateTime(data.dob),
                                  "D MMM, YYYY",
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-6">
                            <div>
                              <div className="text-sm text-muted-foreground mb-1">
                                ID type
                              </div>
                              <div className="font-medium">
                                {data.doc.id_type}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm text-muted-foreground mb-1">
                                Country of residence
                              </div>
                              <div className="font-medium">{data.country}</div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Compare />

                    <div className="relative">
                      <Card>
                        <CardContent className="p-6">
                          <h3 className="text-lg font-medium mb-6">
                            UPLOADED DOCUMENT
                          </h3>

                          <PaginatedDocument items={docs} />

                          {/* <DocumentViewer
                          fileUrl={"/cert1.png"}
                          filename="Professional License"
                        /> */}
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-end gap-4 mt-4">
                <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="rounded-3xl w-[20%]">
                      Reject
                    </Button>
                  </DialogTrigger>
                  <RejectForm
                    title="Reject Professional information"
                    callback={onSubmit}
                  />
                </Dialog>
                <Dialog open={isApprovedOpen} onOpenChange={setIsApprovedOpen}>
                  <DialogTrigger asChild>
                    <Button className="rounded-3xl w-[20%]">Approve</Button>
                  </DialogTrigger>
                  <ApproveForm
                    title={steps[activeStep].heading}
                    callback={onSubmit}
                    steps={steps[activeStep].id}
                  />
                </Dialog>
              </div>
            </Fragment>
          )}
        </div>
      </div>
    </Fragment>
  );
}
