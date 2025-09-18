"use client";

import { createAnimal } from "@/app/lib/actions/animal.actions";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimalHealthStatus, IntakeType } from "@prisma/client";
import {
  animalHealthStatusOptions,
  animalSexOptions,
  intakeTypeOptions,
} from "@/app/lib/utils/enum-formatter";
import { IntakeFormSchema } from "@/app/lib/zod-schemas/pet.schemas";
import { US_STATES } from "@/app/lib/constants/us-states";
import { ColorPayload, PartnerPayload, SpeciesPayload } from "@/app/lib/types";

type IntakeFormValues = z.infer<typeof IntakeFormSchema>;

const stepFields: (keyof IntakeFormValues)[][] = [
  [
    "animalName",
    "species",
    "city",
    "state",
    "breed",
    "primaryColor",
    "sex",
    "weightKg",
    "heightCm",
    "estimatedBirthDate",
    "healthStatus",
  ],
  ["intakeType", "intakeDate"],
  [
    "sourcePartnerId",
    "foundAddress",
    "foundCity",
    "foundState",
    "surrenderingPersonName",
    "surrenderingPersonPhone",
  ],
];

interface CreateAnimalFormProps {
  speciesList: SpeciesPayload[];
  partners: PartnerPayload[];
  colors: ColorPayload[];
}

const CreateAnimalForm = ({
  speciesList,
  partners,
  colors,
}: CreateAnimalFormProps) => {
  const [state, formAction, isPending] = useActionState<
    AnimalFormState,
    FormData
  >(createAnimal, INITIAL_FORM_STATE);

  const [currentSpeciesId, setCurrentSpeciesId] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const form = useForm<IntakeFormValues>({
    resolver: zodResolver(IntakeFormSchema),
    defaultValues: {
      intakeDate: new Date(),
      animalName: "",
      city: "",
      state: "",
      description: "",
      intakeType: undefined,
      species: "",
      sex: undefined,
      breed: "",
      primaryColor: "",
      weightKg: "",
      heightCm: "",
      microchipNumber: "",
      notes: "",
      healthStatus: AnimalHealthStatus.AWAITING_VET_EXAM,
      sourcePartnerId: undefined,
      foundAddress: "",
      foundCity: "",
      foundState: "",
      surrenderingPersonName: "",
      surrenderingPersonPhone: "",
    },
  });
  const intakeType = form.watch("intakeType");

  useEffect(() => {
    if (state.message || state.errors) {
      if (state.message && !state.errors) {
        setFormSubmitted(true);
      }
      if (state.errors) {
        for (const [key, value] of Object.entries(state.errors)) {
          form.setError(key as keyof IntakeFormValues, {
            type: "server",
            message: value?.join(", "),
          });
        }
      }
    }
  }, [state, form]);

  const onSubmit = (data: IntakeFormValues) => {
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

  const handleNextStep = async () => {
    const fieldsToValidate = stepFields[currentStep];
    const isValid = await form.trigger(fieldsToValidate as any);
    if (!isValid) return;

    if (currentStep < 3) {
      setCurrentStep((prev: number) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev: number) => prev - 1);
    }
  };

  if (formSubmitted) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="items-center text-center">
          <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <CheckIcon className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle>Intake Record Created!</CardTitle>
          <CardDescription>
            The new animal has been successfully added to the system.
          </CardDescription>
        </CardHeader>
        <CardFooter className="justify-center">
          <Button onClick={() => window.location.reload()}>
            Create Another Intake
          </Button>
        </CardFooter>
      </Card>
    );
  }

  const stepNames = ["step1", "step2", "step3", "step4"];
  const selectedSpecies = speciesList.find((s) => s.id === currentSpeciesId);

  return (
    <div className="h-[520px]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Tabs
            value={stepNames[currentStep]}
            onValueChange={(tab) => setCurrentStep(stepNames.indexOf(tab))}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="step1">Step 1: Animal Details</TabsTrigger>
              <TabsTrigger value="step2">Step 2: Intake Details</TabsTrigger>
              <TabsTrigger value="step3">Step 3: Source</TabsTrigger>
              <TabsTrigger value="step4">Step 4: Review & Submit</TabsTrigger>
            </TabsList>

            <TabsContent value="step1">
              <Card>
                <CardHeader>
                  <CardTitle>Animal Information</CardTitle>
                  <CardDescription>
                    Details for the incoming animal.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-x-4 gap-y-8">
                    <FormField
                      control={form.control}
                      name="animalName"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Animal Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Buddy" {...field} />
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
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
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
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
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
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
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
                            <Input
                              placeholder="e.g., 900123000456789"
                              {...field}
                            />
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
                  </div>
                </CardContent>
                <CardFooter className="justify-end">
                  <Button type="button" onClick={handleNextStep}>
                    Next Step &rarr;
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* STEP 2: INTAKE DETAILS */}
            <TabsContent value="step2">
              <Card>
                <CardHeader>
                  <CardTitle>Intake Event</CardTitle>
                  <CardDescription>
                    Record the details of how and when the animal arrived.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                    <FormField
                      control={form.control}
                      name="intakeType"
                      render={({ field }) => (
                        <FormItem className="col-span-3">
                          <FormLabel>Intake Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {intakeTypeOptions.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
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
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
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
                </CardContent>
                <CardFooter className="justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevStep}
                  >
                    &larr; Previous Step
                  </Button>
                  <Button type="button" onClick={handleNextStep}>
                    Next Step &rarr;
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* STEP 3: SOURCE (CONDITIONAL) */}
            <TabsContent value="step3">
              <Card>
                <CardHeader>
                  <CardTitle>Source Information</CardTitle>
                  <CardDescription>
                    Where did this animal come from? This section changes based
                    on the Intake Type.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!intakeType && (
                    <p className="text-sm text-muted-foreground">
                      Please select an Intake Type in Step 2 to see the relevant
                      fields here.
                    </p>
                  )}
                  {intakeType === IntakeType.TRANSFER_IN && (
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
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
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
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
                              <Input placeholder="Anytown" {...field} />
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
                            >
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select a state" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {US_STATES.map((state) => (
                                  <SelectItem
                                    key={state.code}
                                    value={state.code}
                                  >
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
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {intakeType === IntakeType.OWNER_SURRENDER && (
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
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
                              <Input placeholder="(555) 123-4567" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </CardContent>
                <CardFooter className="justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevStep}
                  >
                    &larr; Previous Step
                  </Button>
                  <Button type="button" onClick={handleNextStep}>
                    Next Step &rarr;
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* STEP 4: REVIEW & SUBMIT */}
            <TabsContent value="step4">
              <Card>
                <CardHeader>
                  <CardTitle>Review & Submit</CardTitle>
                  <CardDescription>
                    Please review all details before creating the intake record.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* --- Animal Information --- */}
                  <div className="p-4 bg-muted rounded-lg border space-y-2">
                    <h4 className="font-semibold text-lg mb-2 border-b pb-2">
                      Animal Information
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2 text-sm">
                      <strong>Name:</strong>
                      <span className="md:col-span-1">
                        {form.watch("animalName") || "N/A"}
                      </span>
                      <strong>Species:</strong>
                      <span className="md:col-span-1">
                        {speciesList.find((s) => s.id === form.watch("species"))
                          ?.name || "N/A"}
                      </span>
                      <strong>Breed:</strong>
                      <span className="md:col-span-1">
                        {speciesList
                          .find((s) => s.id === form.watch("species"))
                          ?.breeds.find((b) => b.id === form.watch("breed"))
                          ?.name || "N/A"}
                      </span>
                      <strong>Sex:</strong>
                      <span className="md:col-span-1">
                        {animalSexOptions.find(
                          (o) => o.value === form.watch("sex")
                        )?.label || "N/A"}
                      </span>
                      <strong>Primary Color:</strong>
                      <span className="md:col-span-1">
                        {colors.find((c) => c.id === form.watch("primaryColor"))
                          ?.name || "N/A"}
                      </span>
                      <strong>Est. Birth Date:</strong>
                      <span className="md:col-span-1">
                        {form.watch("estimatedBirthDate")
                          ? format(form.watch("estimatedBirthDate"), "PPP")
                          : "N/A"}
                      </span>
                      <strong>Weight:</strong>
                      <span className="md:col-span-1">
                        {form.watch("weightKg")
                          ? `${form.watch("weightKg")} kg`
                          : "N/A"}
                      </span>
                      <strong>Height:</strong>
                      <span className="md:col-span-1">
                        {form.watch("heightCm")
                          ? `${form.watch("heightCm")} cm`
                          : "N/A"}
                      </span>
                      <strong>Health Status:</strong>
                      <span className="md:col-span-1">
                        {animalHealthStatusOptions.find(
                          (o) => o.value === form.watch("healthStatus")
                        )?.label || "N/A"}
                      </span>
                      <strong>Microchip:</strong>
                      <span className="md:col-span-1">
                        {form.watch("microchipNumber") || "N/A"}
                      </span>
                      <strong>Location:</strong>
                      <span className="md:col-span-3">
                        {form.watch("city") || "N/A"},{" "}
                        {US_STATES.find((s) => s.code === form.watch("state"))
                          ?.name || "N/A"}
                      </span>
                    </div>
                  </div>

                  {/* --- Intake & Source Information --- */}
                  <div className="p-4 bg-muted rounded-lg border space-y-2">
                    <h4 className="font-semibold text-lg mb-2 border-b pb-2">
                      Intake & Source Details
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2 text-sm">
                      <strong>Intake Type:</strong>
                      <span>
                        {intakeTypeOptions.find(
                          (o) => o.value === form.watch("intakeType")
                        )?.label || "N/A"}
                      </span>
                      <strong>Intake Date:</strong>
                      <span>
                        {form.watch("intakeDate")
                          ? format(form.watch("intakeDate"), "PPP")
                          : "N/A"}
                      </span>
                    </div>

                    {/* --- Conditional Source Details --- */}
                    {intakeType === IntakeType.TRANSFER_IN && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2 text-sm pt-2 border-t mt-2">
                        <strong>Source Partner:</strong>
                        <span className="col-span-3">
                          {partners.find(
                            (p) => p.id === form.watch("sourcePartnerId")
                          )?.name || "N/A"}
                        </span>
                      </div>
                    )}
                    {intakeType === IntakeType.STRAY && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2 text-sm pt-2 border-t mt-2">
                        <strong>Location Found:</strong>
                        <span className="col-span-3">
                          {form.watch("foundAddress") || "N/A"},{" "}
                          {form.watch("foundCity") || "N/A"},{" "}
                          {US_STATES.find(
                            (s) => s.code === form.watch("foundState")
                          )?.name || "N/A"}
                        </span>
                      </div>
                    )}
                    {intakeType === IntakeType.OWNER_SURRENDER && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2 text-sm pt-2 border-t mt-2">
                        <strong>Owner Name:</strong>
                        <span>{form.watch("surrenderingPersonName")}</span>
                        <strong>Owner Phone:</strong>
                        <span>{form.watch("surrenderingPersonPhone")}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 gap-x-4 gap-y-2 text-sm pt-2 border-t mt-2">
                      <strong>Internal Notes:</strong>
                      <p className="text-muted-foreground whitespace-pre-wrap">
                        {form.watch("notes") || "No notes provided."}
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevStep}
                    disabled={isPending}
                  >
                    &larr; Previous Step
                  </Button>
                  <Button type="submit" size="lg" disabled={isPending}>
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Create Intake Record"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </form>
      </Form>
    </div>
  );
};

export default CreateAnimalForm;
