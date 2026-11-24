import React, { Fragment } from "react";
import type { FC } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@rexolute/ui/button";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@rexolute/ui/dialog";
import { Label } from "@rexolute/ui/label";
import { Textarea } from "@rexolute/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@rexolute/ui/select";
import { Checkbox } from "@rexolute/ui/checkbox";
import { DialogClose } from "@radix-ui/react-dialog";
import { InfoIcon } from "lucide-react";
import { cn } from "@rexolute/utils";
import { parseAxiosError } from "@rexolute/api";
import { CheckIcon } from "@rexolute/ui/icons";

type FormProps = {
  title: string;
  callback: (value: any) => Promise<any>;
};

type ApproveFormProps = FormProps & { steps: string };

const rejectFormSchema = z.object({
  reason: z.string().nonempty(),
  comment: z
    .string()
    .min(50, "Description must be at least 50 characters.")
    .max(250, "Description must be at most 100 characters."),
});

const approveFormSchema = z.object({
  approved: z.boolean().refine((val) => val === true, {
    message: "Select the checkbox to confirm therapist details.",
  }),
});

export type RejectFormSchema = z.infer<typeof rejectFormSchema>;
export type ApproveFormSchema = z.infer<typeof approveFormSchema>;

export const RejectForm: FC<FormProps> = ({ title, callback }) => {
  const {
    control,
    formState: { errors, isValid, isSubmitting },
    handleSubmit,
    register,
    reset,
    setError,
  } = useForm<RejectFormSchema>({
    resolver: zodResolver(rejectFormSchema),
    mode: "onChange",
    defaultValues: { reason: "", comment: "" },
  });

  const close = () => {
    reset();
  };

  const onSubmit = async (value: RejectFormSchema) => {
    try {
      await callback(value);
      reset();
      close();
    } catch (error) {
      const e = parseAxiosError(error);

      setError(
        "root",
        {
          type: "custom", // Or any other custom error type
          message: e.message,
        },
        { shouldFocus: true },
      );
    }
  };

  return (
    <Fragment>
      <DialogContent>
        <DialogHeader className="flex flex-col justify-center items-center">
          <svg
            width="56"
            height="56"
            viewBox="0 0 56 56"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="4" y="4" width="48" height="48" rx="24" fill="#FEF0C7" />
            <rect
              x="4"
              y="4"
              width="48"
              height="48"
              rx="24"
              stroke="#FFFAEB"
              strokeWidth="8"
            />
            <path
              d="M28.0027 24.0002V28.0002M28.0027 32.0002H28.0127M26.2927 18.8602L17.8227 33.0002C17.6481 33.3026 17.5557 33.6455 17.5547 33.9947C17.5537 34.3439 17.6442 34.6873 17.8171 34.9907C17.9901 35.2941 18.2394 35.547 18.5404 35.7241C18.8414 35.9012 19.1835 35.9964 19.5327 36.0002H36.4727C36.8219 35.9964 37.164 35.9012 37.465 35.7241C37.766 35.547 38.0153 35.2941 38.1883 34.9907C38.3612 34.6873 38.4517 34.3439 38.4507 33.9947C38.4497 33.6455 38.3573 33.3026 38.1827 33.0002L29.7127 18.8602C29.5344 18.5663 29.2834 18.3233 28.9839 18.1547C28.6844 17.9861 28.3464 17.8975 28.0027 17.8975C27.659 17.8975 27.321 17.9861 27.0215 18.1547C26.722 18.3233 26.471 18.5663 26.2927 18.8602Z"
              stroke="#DC6803"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <DialogTitle className="text-center">{title}</DialogTitle>
          <DialogDescription>
            Kindly select reason for rejection.
          </DialogDescription>
        </DialogHeader>

        <form
          id="reject-form"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <div className="grid w-full gap-3">
            <Controller
              name="reason"
              control={control}
              render={({ field, fieldState }) => (
                <Fragment>
                  <Label htmlFor="reason">
                    Choose reason <span className="text-red-500">*</span>
                  </Label>

                  <Select onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select reaseon?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Information mismatch">
                        Information mismatch
                      </SelectItem>
                      <SelectItem value="Wrong document uploaded">
                        Wrong document uploaded
                      </SelectItem>
                      <SelectItem value="Blurred ID image uploaded">
                        Blurred ID image uploaded
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </Fragment>
              )}
            />

            {errors.reason && (
              <p className="text-sm text-red-500 mt-1">
                <InfoIcon width={14} height={14} className="inline mr-1" />
                <span>{errors.reason.message}</span>
              </p>
            )}
          </div>

          <div className="grid w-full gap-3">
            <Label htmlFor="comment">
              Add comment <span className="text-red-500">*</span>
            </Label>
            <Textarea
              placeholder="Type your message here."
              id="comment"
              {...register("comment")}
            />
            {errors.comment && (
              <p className="text-sm text-red-500 mt-1">
                <InfoIcon width={14} height={14} className="inline mr-1" />
                <span>{errors.comment.message}</span>
              </p>
            )}
          </div>
          <div className="grid w-full gap-3">
            {errors.root && (
              <p className="text-sm text-red-500 mt-1">
                <InfoIcon width={14} height={14} className="inline mr-1" />
                <span>{errors.root.message}</span>
              </p>
            )}
          </div>
        </form>

        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="outline"
              className="rounded-full px-4 py-2 w-[50%]"
              onClick={close}
            >
              Go back
            </Button>
          </DialogClose>
          <Button
            className={cn(
              "rounded-full px-4 py-2 w-[50%]",
              isValid ? "bg-[#F04438]" : "bg-[#FAA69A]",
            )}
            disabled={!isValid || isSubmitting}
            type="submit"
            form="reject-form"
          >
            {isSubmitting ? "Submitting..." : "Reject"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Fragment>
  );
};

export const ApproveForm: FC<ApproveFormProps> = ({
  title,
  callback,
  steps,
}) => {
  const {
    control,
    formState: { errors, isValid, isSubmitting },
    handleSubmit,
    reset,
    setError,
  } = useForm<ApproveFormSchema>({
    resolver: zodResolver(approveFormSchema),
    mode: "onChange",
    defaultValues: { approved: false },
  });

  const onSubmit = async (value: ApproveFormSchema) => {
    try {
      await callback(value);
      reset();
    } catch (error) {
      const e = parseAxiosError(error);

      if (e.status === 406) {
        await callback(false);
        reset();
        return;
      }

      setError(
        "root",
        {
          type: "custom", // Or any other custom error type
          message: e.message,
        },
        { shouldFocus: false },
      );
    }
  };

  return (
    <Fragment>
      <DialogContent>
        <DialogHeader className="flex flex-col justify-center items-center">
          <svg
            width="56"
            height="56"
            viewBox="0 0 56 56"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="4" y="4" width="48" height="48" rx="24" fill="#FEF0C7" />
            <rect
              x="4"
              y="4"
              width="48"
              height="48"
              rx="24"
              stroke="#FFFAEB"
              strokeWidth="8"
            />
            <path
              d="M28.0027 24.0002V28.0002M28.0027 32.0002H28.0127M26.2927 18.8602L17.8227 33.0002C17.6481 33.3026 17.5557 33.6455 17.5547 33.9947C17.5537 34.3439 17.6442 34.6873 17.8171 34.9907C17.9901 35.2941 18.2394 35.547 18.5404 35.7241C18.8414 35.9012 19.1835 35.9964 19.5327 36.0002H36.4727C36.8219 35.9964 37.164 35.9012 37.465 35.7241C37.766 35.547 38.0153 35.2941 38.1883 34.9907C38.3612 34.6873 38.4517 34.3439 38.4507 33.9947C38.4497 33.6455 38.3573 33.3026 38.1827 33.0002L29.7127 18.8602C29.5344 18.5663 29.2834 18.3233 28.9839 18.1547C28.6844 17.9861 28.3464 17.8975 28.0027 17.8975C27.659 17.8975 27.321 17.9861 27.0215 18.1547C26.722 18.3233 26.471 18.5663 26.2927 18.8602Z"
              stroke="#DC6803"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <DialogTitle className="text-center">{title}</DialogTitle>
          <DialogDescription className="text-center">
            Confirm that all information aligns with the uploaded supporting
            documents
          </DialogDescription>
        </DialogHeader>

        <form
          id="approve-form"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          {steps === "professional" && (
            <ul className="w-full">
              <li className="flex gap-2 items-center">
                <CheckIcon />
                <span>Therapist full name</span>
              </li>
              <li className="flex gap-2 items-center">
                <CheckIcon />
                <span>Licence issuing authority</span>
              </li>
              <li className="flex gap-2 items-center">
                <CheckIcon />
                <span>Licence no</span>
              </li>
            </ul>
          )}

          {steps === "educational" && (
            <ul className="w-full">
              <li className="flex gap-2 items-center">
                <CheckIcon />
                <span>Therapist full name</span>
              </li>
              <li className="flex gap-2 items-center">
                <CheckIcon />
                <span>Highest degree attained</span>
              </li>
              <li className="flex gap-2 items-center">
                <CheckIcon />
                <span>Institution name</span>
              </li>
            </ul>
          )}

          {steps === "identity" && (
            <ul className="w-full">
              <li className="flex gap-2 items-center">
                <CheckIcon /> Therapist full name
              </li>
              <li className="flex gap-2 items-center">
                <CheckIcon />
                <span>Gender</span>
              </li>
              <li className="flex gap-2 items-center">
                <CheckIcon />
                <span>Date of birth</span>
              </li>
              <li className="flex gap-2 items-center">
                <CheckIcon />
                <span>Id card type</span>
              </li>
            </ul>
          )}

          <div className="grid w-full gap-3">
            <Controller
              name="approved"
              control={control}
              render={({ field, fieldState }) => (
                <div className="flex items-center gap-2">
                  <Checkbox id="approve" onCheckedChange={field.onChange} />
                  <Label htmlFor="approve">
                    I confirm to have verified all the above information
                  </Label>
                </div>
              )}
            />

            {errors.approved && (
              <p className="text-sm text-red-500 mt-1">
                <InfoIcon width={14} height={14} className="inline mr-1" />
                <span>{errors.approved.message}</span>
              </p>
            )}
          </div>

          <div className="grid w-full gap-3">
            {errors.root && (
              <p className="text-sm text-red-500 mt-1">
                <InfoIcon width={14} height={14} className="inline mr-1" />
                <span>{errors.root.message}</span>
              </p>
            )}
          </div>
        </form>

        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="outline"
              className="rounded-2xl w-[50%]"
              onClick={() => reset()}
            >
              Go back
            </Button>
          </DialogClose>
          <Button
            className={cn(
              "rounded-2xl w-[50%]",
              isValid ? "bg-primary" : "bg-[#2E890299]",
            )}
            disabled={!isValid || isSubmitting}
            type="submit"
            form="approve-form"
          >
            {isSubmitting ? "Submitting..." : "Approve"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Fragment>
  );
};
