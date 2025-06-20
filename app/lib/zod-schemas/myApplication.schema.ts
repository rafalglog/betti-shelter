import { z } from "zod";
import { LivingSituation } from "@prisma/client";

// Helper schema to parse "true", "false", or "" from radio button groups.
// It expects one of these values. If the input is `null` (no radio selected)
// or `undefined` (field not in FormData), it will result in a validation error.
// Now, it only expects "true" or "false", and the selection is mandatory.
const RequiredBooleanRadioSelectionSchema = (errorMessage: string) =>
  z
    .enum(["true", "false"], {
      // This error message is used if the value is not one of "true", "false", "",
      // or if the value is `null` or `undefined` (because it's not in the enum).
      // For "true" or "false" enum, this makes the selection required.
      errorMap: (issue, ctx) => ({ message: errorMessage }),
    })
    .transform((val) => val === "true"); // Transforms "true" to true, "false" to false

// Helper schema to parse a comma-separated string of ages into an array of numbers.
const CommaSeparatedAgesSchema = z.preprocess((val) => {
  if (typeof val !== "string" || val.trim() === "") {
    return []; // Return empty array for empty string or non-string input
  }
  return val
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s !== "");
}, z.array(z.string().regex(/^\d+$/, "Each age must be a valid positive number.").transform(Number).pipe(z.number().int("Age must be a whole number.").min(0, "Age cannot be negative."))));

// Define the Zod schema for the adoption application form
export const MyAdoptionAppFormSchema = z
  .object({
    applicantName: z.string().min(1, "Applicant name is required"),
    applicantEmail: z.string().email("Invalid email address"),
    applicantPhone: z.string().min(1, "Applicant phone is required"),
    applicantAddressLine1: z.string().min(1, "Address Line 1 is required"),
    applicantAddressLine2: z.string().optional(),
    applicantCity: z.string().min(1, "City is required"),
    applicantState: z.string().min(1, "State is required"),
    applicantZipCode: z.string().regex(/^\d{5}$/, "Invalid ZIP code"),
    livingSituation: z.nativeEnum(LivingSituation, {
      required_error: "Living situation is required",
    }),
    hasYard: RequiredBooleanRadioSelectionSchema(
      "Yard information is required."
    ),
    landlordPermission: RequiredBooleanRadioSelectionSchema(
      "Landlord permission information is required."
    ),
    householdSize: z.preprocess(
      (val) =>
        typeof val === "string" && val.trim() !== ""
          ? Number(val.trim())
          : undefined,
      z
        .number({ invalid_type_error: "Household size must be a number." })
        .int("Household size must be a whole number.")
        .min(1, "Household size must be at least 1.")
    ),
    hasChildren: RequiredBooleanRadioSelectionSchema(
      "Children information is required."
    ),
    childrenAges: CommaSeparatedAgesSchema,
    otherPetsDescription: z.string().optional(),
    petExperience: z.string().min(1, "Pet experience is required"),
    reasonForAdoption: z.string().min(1, "Reason for adoption is required"),
  })
  .superRefine((data, ctx) => {
    if (data.hasChildren === false && data.childrenAges.length > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["childrenAges"],
        message: "If 'No children' is selected, ages should not be provided.",
      });
    }
    if (data.hasChildren === true && data.childrenAges.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["childrenAges"],
        message:
          "Please provide the ages of the children if 'Yes' is selected for having children.",
      });
    }
  });
