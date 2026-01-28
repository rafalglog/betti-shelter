"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  createMyAdoptionApp,
  updateMyAdoptionApp,
} from "@/app/lib/actions/my-application.action";
import { INITIAL_FORM_STATE } from "@/app/lib/form-state-types";
import {
  AdoptionApplicationPayload,
  AnimalForApplicationPayload,
} from "@/app/lib/types";
import { MyAdoptionAppFormSchema } from "@/app/lib/zod-schemas/myApplication.schema";
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
import { livingSituationOptions } from "@/app/lib/utils/enum-formatter";
import { useTranslations } from "next-intl";

type MyApplicationFormData = z.infer<typeof MyAdoptionAppFormSchema>;

interface MyApplicationFormProps {
  animal: AnimalForApplicationPayload;
  application?: AdoptionApplicationPayload;
}

export function MyApplicationForm({
  animal,
  application,
}: MyApplicationFormProps) {
  const t = useTranslations("dashboard");
  const isEditMode = !!application;
  const action = isEditMode
    ? updateMyAdoptionApp.bind(null, application.id)
    : createMyAdoptionApp.bind(null, animal.id);
  const [state, formAction, isPending] = useActionState(
    action,
    INITIAL_FORM_STATE
  );

  const form = useForm<MyApplicationFormData>({
    resolver: zodResolver(MyAdoptionAppFormSchema),
    defaultValues: {
      applicantName: application?.applicantName ?? "",
      applicantEmail: application?.applicantEmail ?? "",
      applicantPhone: application?.applicantPhone ?? "",
      applicantAddressLine1: application?.applicantAddressLine1 ?? "",
      applicantAddressLine2: application?.applicantAddressLine2 ?? "",
      applicantCity: application?.applicantCity ?? "",
      applicantState: application?.applicantState ?? "",
      applicantZipCode: application?.applicantZipCode ?? "",
      livingSituation: application?.livingSituation,

      // Convert all initial values to strings for the form
      hasYard: application?.hasYard ? "true" : "false",
      landlordPermission: application?.landlordPermission ? "true" : "false",
      householdSize: String(application?.householdSize ?? "1"),
      hasChildren: application?.hasChildren ? "true" : "false",
      childrenAges: application?.childrenAges?.join(", ") ?? "",
      otherAnimalsDescription: application?.otherAnimalsDescription ?? "",
      animalExperience: application?.animalExperience ?? "",
      reasonForAdoption: application?.reasonForAdoption ?? "",
    },
  });

  const hasChildrenValue = form.watch("hasChildren");

  useEffect(() => {
    if (state.message) {
      toast.error(state.message);
    }

    // If there are specific field errors, update the form fields.
    if (state.errors) {
      for (const [key, value] of Object.entries(state.errors)) {
        if (value) {
          form.setError(key as keyof MyApplicationFormData, {
            type: "server",
            message: value.join(", "),
          });
        }
      }
    }
  }, [state, form]);

  const handleFormSubmit = (data: MyApplicationFormData) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });
    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Animal Information Header */}
      <Card>
        <CardHeader>
          <CardTitle>{t("myApplications.form.title")}</CardTitle>
          <CardDescription>
            {t("myApplications.form.description", {
              name: animal.name,
              breed: animal.breeds.length > 0
                ? `${animal.breeds.map((b) => b.name).join(" / ")} (${animal.species.name})`
                : animal.species.name,
            })}
          </CardDescription>
        </CardHeader>
      </Card>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleFormSubmit)}
          className="space-y-8"
        >
          {/* Section 1: Applicant Information */}
          <Card>
            <CardHeader>
              <CardTitle>{t("myApplications.form.applicant.title")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="applicantName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("myApplications.form.applicant.fullName")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("myApplications.form.applicant.fullNamePlaceholder")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="applicantEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("myApplications.form.applicant.email")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("myApplications.form.applicant.emailPlaceholder")}
                          type="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="applicantPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("myApplications.form.applicant.phone")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("myApplications.form.applicant.phonePlaceholder")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Separator />
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="applicantAddressLine1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("myApplications.form.applicant.address1")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("myApplications.form.applicant.address1Placeholder")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="applicantAddressLine2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("myApplications.form.applicant.address2")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("myApplications.form.applicant.address2Placeholder")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="applicantCity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("myApplications.form.applicant.city")}</FormLabel>
                        <FormControl>
                          <Input placeholder={t("myApplications.form.applicant.cityPlaceholder")} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="applicantState"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("myApplications.form.applicant.state")}</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={t("myApplications.form.applicant.statePlaceholder")} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {US_STATES.map((state) => (
                              <SelectItem key={state.code} value={state.code}>
                                {state.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="applicantZipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("myApplications.form.applicant.zip")}</FormLabel>
                        <FormControl>
                          <Input placeholder={t("myApplications.form.applicant.zipPlaceholder")} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Home & Lifestyle */}
          <Card>
            <CardHeader>
              <CardTitle>{t("myApplications.form.home.title")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="livingSituation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("myApplications.form.home.livingSituation")}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t("myApplications.form.home.livingSituationPlaceholder")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {livingSituationOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {t(`myApplications.livingSituationOptions.${option.value}`)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="householdSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("myApplications.form.home.householdSize")}</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" {...field} />
                      </FormControl>
                      <FormDescription>
                        {t("myApplications.form.home.householdSizeHint")}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="hasYard"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <div className="text-sm font-medium">
                        {t("myApplications.form.home.hasYard")}
                      </div>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex items-center space-x-4"
                        >
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
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="landlordPermission"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <div className="text-sm font-medium">
                        {t("myApplications.form.home.landlordPermission")}
                      </div>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex items-center space-x-4"
                        >
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
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="hasChildren"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <div className="text-sm font-medium">
                        {t("myApplications.form.home.hasChildren")}
                      </div>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex items-center space-x-4"
                        >
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
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Conditional rendering now checks for the string 'true' */}
                {hasChildrenValue === "true" && (
                  <FormField
                    control={form.control}
                    name="childrenAges"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("myApplications.form.home.childrenAges")}</FormLabel>
                        <FormControl>
                          <Input placeholder={t("myApplications.form.home.childrenAgesPlaceholder")} {...field} />
                        </FormControl>
                        <FormDescription>
                          {t("myApplications.form.home.childrenAgesHint")}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
              <Separator />
              <FormField
                control={form.control}
                name="otherAnimalsDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("myApplications.form.home.otherAnimals")}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t("myApplications.form.home.otherAnimalsPlaceholder")}
                        className="resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Section 3: Experience & Intent */}
          <Card>
            <CardHeader>
              <CardTitle>{t("myApplications.form.experience.title")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <FormField
                control={form.control}
                name="animalExperience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("myApplications.form.experience.animalExperience")}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t("myApplications.form.experience.animalExperiencePlaceholder")}
                        className="resize-y min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="reasonForAdoption"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("myApplications.form.experience.reason")}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t("myApplications.form.experience.reasonPlaceholder")}
                        className="resize-y min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4">
            <Button
              asChild
              variant="outline"
              type="button"
              disabled={isPending}
            >
              <Link href="/dashboard/my-applications">{t("common.cancel")}</Link>
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isPending
                ? isEditMode
                  ? t("common.updating")
                  : t("common.submitting")
                : isEditMode
                ? t("myApplications.form.updateButton")
                : t("myApplications.form.submitButton")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
