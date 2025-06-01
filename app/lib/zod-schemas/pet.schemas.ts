import { z } from "zod";
import { Gender, PetListingStatus } from "@prisma/client";
import { cuidSchema, currentPageSchema, searchQuerySchema } from "./common.schemas";

// Reusable schema for speciesName
const speciesNameSchema = z.string().max(50, { message: "Species name must be at most 50 characters long." }).optional();

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

// Define a schema for the pet form
export const PetFormSchema = z.object({
  name: z.string().min(1, { message: "Name cannot be empty." }),
  age: z.coerce
    .number()
    .gt(0, { message: "Please enter an age greater than 0." }),
  gender: z.nativeEnum(Gender, {
    required_error: "Please select a gender.",
    invalid_type_error: "Invalid gender selected.",
  }),
  speciesId: cuidSchema.refine((val) => val !== "", {
    message: "Please select a valid species.",
  }),
  breed: z.preprocess(
    (val) => (String(val).trim() === "" ? undefined : String(val).trim()),
    z.string().min(1, { message: "Breed must contain at least 1 character if provided." }).optional()
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
  state: z.string().min(1, { message: "State cannot be empty." }),
  description: z.string().optional(),
  listingStatus: z.nativeEnum(PetListingStatus, {
    required_error: "Please select a listing status.",
    invalid_type_error: "Invalid listing status selected.",
  }),
  adoptionStatusId: cuidSchema.refine((val) => val !== "", {
    message: "Please select a valid adoption status.",
  }),
});

// Define a schema for PetLike with CUID validation
export const petLikeSchema = z.object({
  petId: cuidSchema.refine((val) => val !== "", {
    message: "Invalid Pet ID. Must be a valid CUID.",
  }),
  userId: cuidSchema.refine((val) => val !== "", {
    message: "Invalid User ID. Must be a valid CUID.",
  }),
});