"use client";

import { createAnimal, updateAnimal } from "@/app/lib/actions/animal.actions";
import { startTransition, useActionState, useEffect, useState } from "react";
import {
  INITIAL_FORM_STATE,
  AnimalFormState,
} from "@/app/lib/form-state-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  Check as CheckIcon,
  Loader2,
} from "lucide-react";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { IntakeType } from "@prisma/client";
import {
  animalHealthStatusOptions,
  animalSexOptions,
  intakeTypeOptions,
} from "@/app/lib/utils/enum-formatter";
import { AnimalFormSchema } from "@/app/lib/zod-schemas/pet.schemas";
import { US_STATES } from "@/app/lib/constants/us-states";
import {
  AnimalWithDetailsPayload,
  ColorPayload,
  PartnerPayload,
  SpeciesPayload,
} from "@/app/lib/types";
import Link from "next/link";

type AnimalFormValues = z.infer<typeof AnimalFormSchema>;

interface AnimalFormProps {
  speciesList: SpeciesPayload[];
  partners: PartnerPayload[];
  colors: ColorPayload[];
  animal?: AnimalWithDetailsPayload;
}

const AnimalForm = ({
  speciesList,
  partners,
  colors,
  animal,
}: AnimalFormProps) => {
  const isEditMode = !!animal;
  const action = isEditMode ? updateAnimal.bind(null, animal.id) : createAnimal;

  const [state, formAction, isPending] = useActionState<
    AnimalFormState,
    FormData
  >(action, INITIAL_FORM_STATE);
  const [currentSpeciesId, setCurrentSpeciesId] = useState(
    animal?.speciesId || ""
  );

  const form = useForm<AnimalFormValues>({
    resolver: zodResolver(AnimalFormSchema),
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
  const intakeType = form.watch("intakeType");

  useEffect(() => {
    if (state.message && state.errors) {
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
    console.log("Client-side form data being submitted:", data);
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
              {isEditMode ? "Edit Animal Details" : "New Animal Intake"}
            </CardTitle>
            <CardDescription>
              {isEditMode
                ? `Editing the record for ${animal.name}.`
                : "Enter all details for the incoming animal on this single form."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-10">
            <div className="space-y-6">
              <h3 className="font-semibold border-b pb-2">
                Animal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-6 gap-x-4 gap-y-8">
                <FormField
                  control={form.control}
                  name="animalName"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Animal Name</FormLabel>

                      <FormControl>
                        <Input
                          placeholder="e.g., Buddy"
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
                      <FormLabel>Species</FormLabel>
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
                            <SelectValue placeholder="Select a species" />
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
                      <FormLabel>Breed</FormLabel>

                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={!currentSpeciesId}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a breed" />
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
                      <FormLabel>Primary Color</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a color" />
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
                      <FormLabel>Sex</FormLabel>

                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select sex" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {animalSexOptions.map((option) => (
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
                <FormField
                  control={form.control}
                  name="estimatedBirthDate"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Estimated Birth Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            autoFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="weightKg"
                  render={({ field }) => (
                    <FormItem className="col-span-1">
                      <FormLabel>Weight (kg)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="e.g., 15.5"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="heightCm"
                  render={({ field }) => (
                    <FormItem className="col-span-1">
                      <FormLabel>Height (cm)</FormLabel>

                      <FormControl>
                        <Input
                          type="number"
                          placeholder="e.g., 55"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="healthStatus"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Health Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select health status" />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent>
                          {animalHealthStatusOptions.map((option) => (
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
                <FormField
                  control={form.control}
                  name="microchipNumber"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Microchip Number</FormLabel>

                      <FormControl>
                        <Input placeholder="e.g., 900123000456789" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem className="col-span-3">
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Anytown" {...field} />
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
                      <FormLabel>State</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a state" />
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
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us about this animal's personality, quirks, and what makes them special! Help potential adopters imagine them in a loving home."
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* --- INTAKE EVENT & SOURCE --- */}
            <div className="space-y-6">
              <h3 className="font-semibold border-b pb-2">
                Intake & Source Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-6 gap-x-4 gap-y-8">
                <FormField
                  control={form.control}
                  name="intakeType"
                  render={({ field }) => (
                    <FormItem className="col-span-3">
                      <FormLabel>Intake Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={isEditMode}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {intakeTypeOptions.map((option) => (
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

                <FormField
                  control={form.control}
                  name="intakeDate"
                  render={({ field }) => (
                    <FormItem className="col-span-3">
                      <FormLabel>Intake Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                              disabled={isEditMode}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            autoFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem className="col-span-full">
                      <FormLabel>Internal Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Any notes about the intake event..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* --- CONDITIONAL SOURCE FIELDS --- */}
              <div className="pt-6">
                {!isEditMode && !intakeType && (
                  <p className="text-sm text-center text-muted-foreground p-4 border border-dashed rounded-md">
                    Please select an Intake Type above to enter source details.
                  </p>
                )}
                {intakeType === IntakeType.TRANSFER_IN && (
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-x-4 gap-y-8 p-4 border rounded-md">
                    <h4 className="font-semibold col-span-full">
                      Transfer Details
                    </h4>
                    <FormField
                      control={form.control}
                      name="sourcePartnerId"
                      render={({ field }) => (
                        <FormItem className="col-span-full">
                          <FormLabel>Source Partner</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={isEditMode}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a partner shelter/rescue" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {partners.map((p) => (
                                <SelectItem key={p.id} value={p.id}>
                                  {p.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
                {intakeType === IntakeType.STRAY && (
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-x-4 gap-y-8 p-4 border rounded-md">
                    <h4 className="font-semibold col-span-full">
                      Location Found
                    </h4>
                    <FormField
                      control={form.control}
                      name="foundCity"
                      render={({ field }) => (
                        <FormItem className="col-span-3">
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Anytown"
                              {...field}
                              disabled={isEditMode}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="foundState"
                      render={({ field }) => (
                        <FormItem className="col-span-3">
                          <FormLabel>State</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={isEditMode}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a state" />
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
                      name="foundAddress"
                      render={({ field }) => (
                        <FormItem className="col-span-full">
                          <FormLabel>Address / Cross Streets</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Corner of Main St & Park Ave"
                              {...field}
                              disabled={isEditMode}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
                {intakeType === IntakeType.OWNER_SURRENDER && (
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-x-4 gap-y-8 p-4 border rounded-md">
                    <h4 className="font-semibold col-span-full">
                      Surrendering Person Details
                    </h4>
                    <FormField
                      control={form.control}
                      name="surrenderingPersonName"
                      render={({ field }) => (
                        <FormItem className="col-span-3">
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Mary Public"
                              {...field}
                              disabled={isEditMode}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="surrenderingPersonPhone"
                      render={({ field }) => (
                        <FormItem className="col-span-3">
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="(555) 123-4567"
                              {...field}
                              disabled={isEditMode}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="justify-end">
            <Button
              asChild
              variant="outline"
              type="button"
              disabled={isPending}
            >
              <Link href={`/dashboard/animals`}>
                Cancel
              </Link>
            </Button>
            <Button type="submit" size="lg" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isPending
                ? isEditMode
                  ? "Updating..."
                  : "Submitting..."
                : isEditMode
                ? "Save Changes"
                : "Create Intake"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default AnimalForm;
