"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ApplicationStatus } from "@prisma/client";
import { ArrowRight, Info, Loader2 } from "lucide-react";
import Link from "next/link";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { ApplicationWithOutcome } from "@/app/lib/data/user-application.data";
import { staffUpdateAdoptionApp } from "@/app/lib/actions/adoption-application.actions";
import { INITIAL_FORM_STATE } from "@/app/lib/form-state-types";
import { AnimalForApplicationPayload } from "@/app/lib/types";
import { livingSituationOptions } from "@/app/lib/utils/enum-formatter";
import { StaffUpdateAdoptionAppFormSchema } from "@/app/lib/zod-schemas/application.schemas";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { US_STATES } from "@/app/lib/constants/us-states";
import { useTranslations } from "next-intl";

type StaffUpdateFormData = z.infer<typeof StaffUpdateAdoptionAppFormSchema>;

const updatableApplicationStatuses = [
  ApplicationStatus.PENDING,
  ApplicationStatus.REVIEWING,
  ApplicationStatus.WAITLISTED,
  ApplicationStatus.APPROVED,
  ApplicationStatus.REJECTED,
  ApplicationStatus.WITHDRAWN,
] as const;

type StatusOption = {
  value: ApplicationStatus;
  label: string;
};

interface StaffApplicationUpdateFormProps {
  animal: AnimalForApplicationPayload;
  application: ApplicationWithOutcome;
}

export function StaffApplicationUpdateForm({
  animal,
  application,
}: StaffApplicationUpdateFormProps) {
  const t = useTranslations("dashboard");
  const isAdopted = application.status === "ADOPTED";
  const isApproved = application.status === "APPROVED";
  const outcome = application.outcome;

  const applicationStatusOptions: StatusOption[] =
    updatableApplicationStatuses.map((status) => ({
      value: status,
      label: t(`adoptionApplications.statusOptions.${status}`),
    }));

  if (isAdopted) {
    applicationStatusOptions.unshift({
      value: "ADOPTED",
      label: t("adoptionApplications.statusOptions.ADOPTED"),
    });
  }

  const action = staffUpdateAdoptionApp.bind(null, application.id);
  const [state, formAction, isPending] = useActionState(
    action,
    INITIAL_FORM_STATE
  );

  const form = useForm<StaffUpdateFormData>({
    resolver: zodResolver(StaffUpdateAdoptionAppFormSchema),
    defaultValues: {
      status:
        application.status as (typeof updatableApplicationStatuses)[number],
      internalNotes: application.internalNotes ?? "",
      statusChangeReason: "",
    },
  });

  const currentStatus = application.status;
  const newStatus = form.watch("status");
  const isStatusChanging = newStatus && newStatus !== currentStatus;

  useEffect(() => {
    // If the server returns any message, it's an error. Show a toast.
    if (state.message) {
      toast.error(state.message);
    }

    // If there are specific field errors, update the form fields.
    if (state.errors) {
      for (const [key, value] of Object.entries(state.errors)) {
        if (value) {
          form.setError(key as keyof StaffUpdateFormData, {
            type: "server",
            message: value.join(", "),
          });
        }
      }
    }
  }, [state, form]);

  const handleFormSubmit = (data: StaffUpdateFormData) => {
    if (isAdopted) return;
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, String(value));
      }
    });
    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleFormSubmit)}
          className="space-y-8"
        >
          <Card className="border-primary">
            <CardHeader>
              <CardTitle>{t("adoptionApplications.staff.title")}</CardTitle>
              <CardDescription className="flex items-center pt-1">
                {t.rich("adoptionApplications.staff.description", {
                  applicant: (chunks) => (
                    <span className="font-semibold mx-1">{chunks}</span>
                  ),
                  animal: (chunks) => (
                    <Button variant="link" asChild className="p-1 h-auto">
                      <Link href={`/dashboard/animals/${animal.id}`}>
                        {chunks}
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  ),
                  applicantName: application.applicantName,
                  animalName: animal.name,
                })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isAdopted && outcome && (
                <Alert className="mb-6 border-blue-300 bg-blue-50">
                  <Info className="h-4 w-4 text-blue-600" />
                  <AlertTitle className="text-blue-800">
                    {t("adoptionApplications.staff.finalizedTitle")}
                  </AlertTitle>
                  <AlertDescription className="text-blue-700">
                    {t("adoptionApplications.staff.finalizedDescription", {
                      date: new Date(outcome.outcomeDate).toLocaleDateString(),
                    })}
                    <Link
                      href={`/dashboard/outcomes/${outcome.id}/edit`}
                      className="ml-2 font-semibold text-blue-800 underline hover:text-blue-600"
                    >
                      {t("adoptionApplications.staff.viewOutcome")}
                    </Link>
                  </AlertDescription>
                </Alert>
              )}
              {isApproved && (
                <Alert className="mb-6 border-green-300 bg-green-50">
                  <Info className="h-4 w-4 text-green-600" />
                  <AlertTitle className="text-green-800">
                    {t("adoptionApplications.staff.nextStepTitle")}
                  </AlertTitle>
                  <AlertDescription className="flex items-center justify-between text-green-700">
                    <span>{t("adoptionApplications.staff.nextStepDescription")}</span>
                    <Button asChild>
                      <Link
                        href={`/dashboard/outcomes/create?applicationId=${application.id}`}
                      >
                        {t("adoptionApplications.staff.createOutcome")}
                      </Link>
                    </Button>
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("adoptionApplications.staff.statusLabel")}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isPending || isAdopted}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={t(
                                "adoptionApplications.staff.statusPlaceholder"
                              )}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {applicationStatusOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {isStatusChanging && (
                  <FormField
                    control={form.control}
                    name="statusChangeReason"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("adoptionApplications.staff.statusReasonLabel")}
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={t(
                              "adoptionApplications.staff.statusReasonPlaceholder"
                            )}
                            className="resize-y"
                            disabled={isPending || isAdopted}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          {t("adoptionApplications.staff.statusReasonHint")}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="internalNotes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("adoptionApplications.staff.internalNotesLabel")}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t(
                            "adoptionApplications.staff.internalNotesPlaceholder"
                          )}
                          className="resize-y min-h-[100px]"
                          disabled={isPending || isAdopted}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* All sections below are READ-ONLY */}

          <Card>
            <CardHeader>
              <CardTitle>{t("adoptionApplications.readOnly.applicantTitle")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormItem>
                  <FormLabel>{t("adoptionApplications.readOnly.fullName")}</FormLabel>
                  <FormControl>
                    <Input
                      value={application.applicantName}
                      disabled
                      readOnly
                    />
                  </FormControl>
                </FormItem>
                <FormItem>
                  <FormLabel>{t("adoptionApplications.readOnly.email")}</FormLabel>
                  <FormControl>
                    <Input
                      value={application.applicantEmail}
                      disabled
                      readOnly
                    />
                  </FormControl>
                </FormItem>
                <FormItem>
                  <FormLabel>{t("adoptionApplications.readOnly.phone")}</FormLabel>
                  <FormControl>
                    <Input
                      value={application.applicantPhone}
                      disabled
                      readOnly
                    />
                  </FormControl>
                </FormItem>
              </div>
              <Separator />
              <div className="space-y-6">
                <FormItem>
                  <FormLabel>{t("adoptionApplications.readOnly.address1")}</FormLabel>
                  <FormControl>
                    <Input
                      value={application.applicantAddressLine1}
                      disabled
                      readOnly
                    />
                  </FormControl>
                </FormItem>
                <FormItem>
                  <FormLabel>{t("adoptionApplications.readOnly.address2")}</FormLabel>
                  <FormControl>
                    <Input
                      value={application.applicantAddressLine2 ?? ""}
                      disabled
                      readOnly
                    />
                  </FormControl>
                </FormItem>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormItem>
                    <FormLabel>{t("adoptionApplications.readOnly.city")}</FormLabel>
                    <FormControl>
                      <Input
                        value={application.applicantCity}
                        disabled
                        readOnly
                      />
                    </FormControl>
                  </FormItem>
                  <FormItem>
                    <FormLabel>{t("adoptionApplications.readOnly.state")}</FormLabel>
                    <Select value={application.applicantState} disabled>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {US_STATES.map((state) => (
                          <SelectItem key={state.code} value={state.code}>
                            {state.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                  <FormItem>
                    <FormLabel>{t("adoptionApplications.readOnly.zip")}</FormLabel>
                    <FormControl>
                      <Input
                        value={application.applicantZipCode}
                        disabled
                        readOnly
                      />
                    </FormControl>
                  </FormItem>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("adoptionApplications.readOnly.homeTitle")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormItem>
                  <FormLabel>{t("adoptionApplications.readOnly.livingSituation")}</FormLabel>
                  <Select value={application.livingSituation} disabled>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {livingSituationOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {t(`myApplications.livingSituationOptions.${option.value}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
                <FormItem>
                  <FormLabel>{t("adoptionApplications.readOnly.householdSize")}</FormLabel>
                  <FormControl>
                    <Input
                      value={application.householdSize}
                      disabled
                      readOnly
                    />
                  </FormControl>
                </FormItem>
                <FormItem>
                  <FormLabel>{t("adoptionApplications.readOnly.hasYard")}</FormLabel>
                  <RadioGroup
                    value={application.hasYard ? "true" : "false"}
                    disabled
                  >
                    <div className="flex items-center space-x-4">
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="true" />
                        </FormControl>
                        <FormLabel className="font-normal">{t("common.yes")}</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="false" />
                        </FormControl>
                        <FormLabel className="font-normal">{t("common.no")}</FormLabel>
                      </FormItem>
                    </div>
                  </RadioGroup>
                </FormItem>
                <FormItem>
                  <FormLabel>
                    {t("adoptionApplications.readOnly.landlordPermission")}
                  </FormLabel>
                  <RadioGroup
                    value={application.landlordPermission ? "true" : "false"}
                    disabled
                  >
                    <div className="flex items-center space-x-4">
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="true" />
                        </FormControl>
                        <FormLabel className="font-normal">{t("common.yes")}</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="false" />
                        </FormControl>
                        <FormLabel className="font-normal">{t("common.no")}</FormLabel>
                      </FormItem>
                    </div>
                  </RadioGroup>
                </FormItem>
                <FormItem>
                  <FormLabel>{t("adoptionApplications.readOnly.hasChildren")}</FormLabel>
                  <RadioGroup
                    value={application.hasChildren ? "true" : "false"}
                    disabled
                  >
                    <div className="flex items-center space-x-4">
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="true" />
                        </FormControl>
                        <FormLabel className="font-normal">{t("common.yes")}</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="false" />
                        </FormControl>
                        <FormLabel className="font-normal">{t("common.no")}</FormLabel>
                      </FormItem>
                    </div>
                  </RadioGroup>
                </FormItem>
                {application.hasChildren && (
                  <FormItem>
                    <FormLabel>{t("adoptionApplications.readOnly.childrenAges")}</FormLabel>
                    <FormControl>
                      <Input
                        value={application.childrenAges?.join(", ") ?? t("common.na")}
                        disabled
                        readOnly
                      />
                    </FormControl>
                  </FormItem>
                )}
              </div>
              <Separator />
              <FormItem>
                <FormLabel>{t("adoptionApplications.readOnly.otherAnimals")}</FormLabel>
                <FormControl>
                  <Textarea
                    value={application.otherAnimalsDescription ?? t("common.na")}
                    className="resize-y"
                    disabled
                    readOnly
                  />
                </FormControl>
              </FormItem>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("adoptionApplications.readOnly.experienceTitle")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <FormItem>
                <FormLabel>{t("adoptionApplications.readOnly.animalExperience")}</FormLabel>
                <FormControl>
                  <Textarea
                    value={application.animalExperience ?? t("common.na")}
                    className="resize-y min-h-[100px]"
                    disabled
                    readOnly
                  />
                </FormControl>
              </FormItem>
              <FormItem>
                <FormLabel>{t("adoptionApplications.readOnly.reason")}</FormLabel>
                <FormControl>
                  <Textarea
                    value={application.reasonForAdoption}
                    className="resize-y min-h-[100px]"
                    disabled
                    readOnly
                  />
                </FormControl>
              </FormItem>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4">
            <Button
              asChild
              variant="outline"
              type="button"
              disabled={isPending}
            >
              <Link href="/dashboard/adoption-applications">
                {t("common.cancel")}
              </Link>
            </Button>
            <Button type="submit" disabled={isPending || isAdopted}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isPending
                ? t("common.updating")
                : t("adoptionApplications.staff.updateButton")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
