"use client";

import { createAnimal, updateAnimal } from "@/app/lib/actions/animal.actions";
import {
  startTransition,
  useActionState,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  INITIAL_FORM_STATE,
  AnimalFormState,
} from "@/app/lib/form-state-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { AnimalListingStatus } from "@prisma/client";
import {
  animalHealthStatusOptions,
  animalListingStatusOptions,
  animalSexOptions,
  intakeTypeOptions,
} from "@/app/lib/utils/enum-formatter";
import { AnimalFormSchema } from "@/app/lib/zod-schemas/animal.schemas";
import { US_STATES } from "@/app/lib/constants/us-states";
import {
  AnimalIntakeFormPayload,
  ColorPayload,
  PartnerPayload,
  SpeciesPayload,
} from "@/app/lib/types";
import Link from "next/link";
import { IntakeFormFields } from "./intake-form-fields";
import { useTranslations } from "next-intl";

type AnimalFormValues = z.infer<typeof AnimalFormSchema>;

interface AnimalFormProps {
  speciesList: SpeciesPayload[];
  partners: PartnerPayload[];
  colors: ColorPayload[];
  animal?: AnimalIntakeFormPayload;
}

const AnimalForm = ({
  speciesList,
  partners,
  colors,
  animal,
}: AnimalFormProps) => {
  const t = useTranslations("dashboard");
  const isEditMode = !!animal;

  const isStatusLocked =
    animal?.listingStatus === AnimalListingStatus.PENDING_ADOPTION ||
    animal?.listingStatus === AnimalListingStatus.ARCHIVED;

  const availableStatusOptions = useMemo(() => {
    if (!isEditMode) {
      return animalListingStatusOptions.filter(
        (opt) =>
          opt.value === AnimalListingStatus.DRAFT ||
          opt.value === AnimalListingStatus.PUBLISHED
      );
    }
    if (isStatusLocked) {
      return animalListingStatusOptions.filter(
        (opt) => opt.value === animal.listingStatus
      );
    }
    return animalListingStatusOptions.filter(
      (opt) =>
        opt.value === AnimalListingStatus.DRAFT ||
        opt.value === AnimalListingStatus.PUBLISHED
    );
  }, [isEditMode, isStatusLocked, animal]);

  const action = isEditMode ? updateAnimal.bind(null, animal.id) : createAnimal;

  const [state, formAction, isPending] = useActionState<
    AnimalFormState,
    FormData
  >(action, INITIAL_FORM_STATE);
  const [currentSpeciesId, setCurrentSpeciesId] = useState(
    animal?.speciesId || ""
  );

  const form = useForm({
    resolver: standardSchemaResolver(AnimalFormSchema),
    defaultValues: isEditMode
      ? {
          animalName: animal.name,
          species: animal.speciesId,
          breed: animal.breeds[0]?.id || "",
          primaryColor: animal.colors[0]?.id || "",
          sex: animal.sex,
          estimatedBirthDate: new Date(animal.birthDate),
          weightKg: animal.weightKg ?? "",
          heightCm: animal.heightCm ?? "",
          healthStatus:
            animal.healthStatus || animalHealthStatusOptions[0].value,
          microchipNumber: animal.microchipNumber || "",
          listingStatus: animal.listingStatus,
          city: animal.city || "",
          state: animal.state || "",
          description: animal.description || "",
        }
      : {
          intakeDate: new Date(),
          animalName: "",
          city: "",
          state: "",
          description: "",
          intakeType: intakeTypeOptions[0].value,
          species: "",
          sex: animalSexOptions[0].value,
          breed: "",
          primaryColor: "",
          weightKg: "",
          heightCm: "",
          microchipNumber: "",
          listingStatus: AnimalListingStatus.DRAFT,
          notes: "",
          healthStatus: animalHealthStatusOptions[0].value,
          sourcePartnerId: "",
          foundAddress: "",
          foundCity: "",
          foundState: "",
          surrenderingPersonName: "",
          surrenderingPersonPhone: "",
        },
  });

  useEffect(() => {
    if (state.message) {
      toast.error(state.message);
    }

    if (state.errors) {
      for (const [key, value] of Object.entries(state.errors)) {
        form.setError(key as keyof AnimalFormValues, {
          type: "server",
          message: value?.join(", "),
        });
      }
    }
  }, [state, form]);

  const onSubmit = (data: AnimalFormValues) => {
    const formData = new FormData();
    for (const [key, value] of Object.entries(data)) {
      if (value instanceof Date) {
        formData.append(key, value.toISOString());
      } else if (value != null && value !== "") {
        formData.append(key, String(value));
      }
    }
    startTransition(() => {
      formAction(formData);
    });
  };

  const selectedSpecies = speciesList.find((s) => s.id === currentSpeciesId);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>
              {isEditMode ? t("animals.form.editTitle") : t("animals.form.createTitle")}
          </CardTitle>
          <CardDescription>
              {isEditMode
                ? t("animals.form.editDescription", { name: animal.name })
                : t("animals.form.createDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-10">
          {/* Animal Information Section */}
          <div className="space-y-6">
            <h3 className="font-semibold border-b pb-2">
                {t("animals.form.sectionTitle")}
            </h3>
              <div className="grid grid-cols-1 md:grid-cols-6 gap-x-4 gap-y-8">
                <FormField
                  control={form.control}
                  name="animalName"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>{t("animals.fields.name")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("animals.fields.namePlaceholder")}
                          {...field}
                          autoComplete="off"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="species"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>{t("animals.fields.species")}</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          setCurrentSpeciesId(value);
                          form.setValue("breed", "");
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder={t("animals.fields.speciesPlaceholder")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {speciesList.map((s) => (
                            <SelectItem key={s.id} value={s.id}>
                              {s.name}
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
                  name="breed"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>{t("animals.fields.breed")}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={!currentSpeciesId}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder={t("animals.fields.breedPlaceholder")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {(selectedSpecies?.breeds || []).map((b) => (
                            <SelectItem key={b.id} value={b.id}>
                              {b.name}
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
                  name="primaryColor"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>{t("animals.fields.primaryColor")}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder={t("animals.fields.colorPlaceholder")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {colors.map((c) => (
                            <SelectItem key={c.id} value={c.id}>
                              {c.name}
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
                  name="sex"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>{t("animals.fields.sex")}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder={t("animals.fields.sexPlaceholder")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {animalSexOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {t(`animals.sexOptions.${option.value}`)}
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
                  name="estimatedBirthDate"
                  render={({ field }) => {
                    const dateValue = field.value as Date | undefined;

                    return (
                      <FormItem className="col-span-2">
                        <FormLabel>{t("animals.fields.birthDate")}</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !dateValue && "text-muted-foreground"
                                )}
                              >
                                {dateValue ? (
                                  format(dateValue, "PPP")
                                ) : (
                                  <span>{t("animals.fields.datePlaceholder")}</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={dateValue}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date() ||
                                date < new Date("1900-01-01")
                              }
                              autoFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="weightKg"
                  render={({ field }) => {
                    // Convert number to string for the input, handle undefined and empty string
                    const value =
                      field.value === undefined || field.value === ""
                        ? ""
                        : String(field.value);

                    return (
                      <FormItem className="col-span-1">
                        <FormLabel>{t("animals.fields.weight")}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder={t("animals.fields.weightPlaceholder")}
                            {...field}
                            value={value}
                            onChange={(e) => {
                              const val = e.target.value;
                              // Pass empty string as-is, otherwise parse as number
                              field.onChange(val === "" ? "" : parseFloat(val));
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />

                <FormField
                  control={form.control}
                  name="heightCm"
                  render={({ field }) => {
                    const value =
                      field.value === undefined || field.value === ""
                        ? ""
                        : String(field.value);

                    return (
                      <FormItem className="col-span-1">
                        <FormLabel>{t("animals.fields.height")}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder={t("animals.fields.heightPlaceholder")}
                            {...field}
                            value={value}
                            onChange={(e) => {
                              const val = e.target.value;
                              field.onChange(val === "" ? "" : parseFloat(val));
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="healthStatus"
                  render={({ field }) => (
                    <FormItem className="col-span-3">
                      <FormLabel>{t("animals.fields.healthStatus")}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder={t("animals.fields.healthStatusPlaceholder")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {animalHealthStatusOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {t(`animals.healthStatusOptions.${option.value}`)}
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
                  name="microchipNumber"
                  render={({ field }) => (
                    <FormItem className="col-span-3">
                      <FormLabel>{t("animals.fields.microchip")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("animals.fields.microchipPlaceholder")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="listingStatus"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>{t("animals.fields.listingStatus")}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={isStatusLocked}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder={t("animals.fields.listingStatusPlaceholder")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableStatusOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {t(`animals.listingStatusOptions.${option.value}`)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {isStatusLocked && (
                        <FormDescription className="text-amber-600">
                          {t("animals.fields.listingStatusLocked")}
                        </FormDescription>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem className="col-span-3">
                      <FormLabel>{t("animals.fields.city")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("animals.fields.cityPlaceholder")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem className="col-span-3">
                      <FormLabel>{t("animals.fields.state")}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder={t("animals.fields.statePlaceholder")} />
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
                  name="description"
                  render={({ field }) => (
                    <FormItem className="col-span-full">
                      <FormLabel>{t("animals.fields.description")}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t("animals.fields.descriptionPlaceholder")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Intake Section - Only show on CREATE mode */}
            {!isEditMode && (
              <IntakeFormFields
                control={form.control}
                watch={form.watch}
                partners={partners}
                isEditMode={false}
              />
            )}
          </CardContent>

          <CardFooter className="flex justify-end space-x-4">
            <Button
              asChild
              variant="outline"
              type="button"
              disabled={isPending}
            >
              <Link href={`/dashboard/animals`}>{t("common.cancel")}</Link>
            </Button>
            <Button type="submit" size="lg" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isPending
                ? isEditMode
                  ? t("common.updating")
                  : t("animals.form.submitting")
                : isEditMode
                ? t("animals.form.saveChanges")
                : t("animals.form.createButton")}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default AnimalForm;
