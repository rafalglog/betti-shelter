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
const CommaSeparatedAgesSchema = z
  .string() // Explicitly define the input as a string
  .transform((val, ctx) => {
    if (val.trim() === "") {
      return []; // Return an empty array for an empty string
    }
    const parts = val.split(",").map((s) => s.trim());
    const numbers: number[] = [];

    for (const part of parts) {
      if (part === "") continue; // Allows for trailing commas, etc.
      const num = Number(part);
      if (isNaN(num) || !Number.isInteger(num) || num < 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Each age must be a valid positive number.`,
        });
        return z.NEVER; // Stop processing on invalid input
      }
      numbers.push(num);
    }
    return numbers;
  });

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
    
    // Validates a "true" or "false" string, but does NOT transform it to a boolean
    hasYard: z.enum(["true", "false"], {
      required_error: "Yard information is required.",
    }),
    landlordPermission: z.enum(["true", "false"], {
      required_error: "Landlord permission information is required.",
    }),
    
    // Validates a string that contains a number, but does NOT transform it
    householdSize: z.string().min(1, "Household size is required.")
      .regex(/^\d+$/, "Household size must be a positive number."),

    hasChildren: z.enum(["true", "false"], {
      required_error: "Children information is required.",
    }),

    // Validates the string of ages, but does NOT transform it to a number array
    childrenAges: z.string().regex(/^[\d\s,]*$/, "Ages must be a comma-separated list of numbers."),

    otherAnimalsDescription: z.string().optional(),
    animalExperience: z.string().min(1, "Animal experience is required"),
    reasonForAdoption: z.string().min(1, "Reason for adoption is required"),
  })
  .superRefine((data, ctx) => {
    // This logic now works with string values, as it should for a form
    if (data.hasChildren === 'false' && data.childrenAges.trim().length > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["childrenAges"],
        message: "If 'No children' is selected, ages should not be provided.",
      });
    }
    if (data.hasChildren === 'true' && data.childrenAges.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["childrenAges"],
        message: "Please provide the ages of the children if 'Yes' is selected.",
      });
    }
  });