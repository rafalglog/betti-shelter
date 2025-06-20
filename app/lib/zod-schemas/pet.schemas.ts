import { z } from "zod";
import { Gender, PetListingStatus } from "@prisma/client";
import { US_STATES } from "@/app/lib/constants/us-states";
import { currentPageSchema, searchQuerySchema } from "./common.schemas";

// Reusable schema for speciesName
const speciesNameSchema = z
  .string()
  .max(50, { message: "Species name must be at most 50 characters long." })
  .optional();

export const PublishedPetsPageCountSchema = z.object({
  query: searchQuerySchema,
  speciesName: speciesNameSchema,
});

export const PublishedPetsFilterSchema = z.object({
  query: searchQuerySchema,
  currentPage: currentPageSchema,
  speciesName: speciesNameSchema,
});

export const DashboardPetsFilterSchema = z.object({
  query: searchQuerySchema,
  currentPage: currentPageSchema,
});

const stateCodes = US_STATES.map((state) => state.code) as [
  string,
  ...string[]
];

// Schema for the pet form
export const PetFormSchema = z.object({
  name: z.string().min(1, { message: "Name cannot be empty." }),
  birthDate: z.coerce
    .date({
      required_error: "Please select a date of birth.",
      invalid_type_error: "That's not a valid date!",
    })
    .max(new Date(), { message: "Date of birth cannot be in the future." }),
  gender: z.nativeEnum(Gender, {
    required_error: "Please select a gender.",
    invalid_type_error: "Invalid gender selected.",
  }),
  speciesId: z
    .string({ required_error: "Please select a species." })
    .cuid({ message: "Please select a valid species." }),
  breed: z.preprocess(
    (val) => (String(val).trim() === "" ? undefined : String(val).trim()),
    z
      .string()
      .min(1, {
        message: "Breed must contain at least 1 character if provided.",
      })
      .optional()
  ),
  weightKg: z.preprocess(
    (val) => (String(val).trim() === "" ? undefined : Number(val)),
    z
      .number()
      .positive({ message: "Weight must be a positive number if provided." })
      .optional()
  ),
  heightCm: z.preprocess(
    (val) => (String(val).trim() === "" ? undefined : Number(val)),
    z
      .number()
      .positive({ message: "Height must be a positive number if provided." })
      .optional()
  ),
  city: z.string().min(1, { message: "City cannot be empty." }),
  state: z.enum(stateCodes, {
    required_error: "State is required.",
    invalid_type_error:
      "Invalid state selected. Please select a valid US state.",
  }),
  description: z.string().optional(),
  listingStatus: z.nativeEnum(PetListingStatus, {
    required_error: "Please select a listing status.",
    invalid_type_error: "Invalid listing status selected.",
  }),
});