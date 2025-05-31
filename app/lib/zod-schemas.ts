import { z } from "zod";
import { Gender, PetListingStatus } from "@prisma/client";


// Define a schema for the id
export const idSchema = z.string().min(1);

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
  species_id: z.string().uuid({ message: "Please select a valid species." }),
  breed: z.preprocess(
    (val) => (String(val).trim() === "" ? undefined : String(val).trim()), // Handle empty string as undefined for optional field
    z.string().min(1, { message: "Breed must contain at least 1 character if provided." }).optional()
  ),
  weightKg: z.preprocess(
    (val) => (String(val).trim() === "" ? undefined : Number(val)), // Handle empty string as undefined for optional field
    z
      .number()
      .positive({ message: "Weight must be a positive number if provided." })
      .optional()
  ),
  heightCm: z.preprocess(
    (val) => (String(val).trim() === "" ? undefined : Number(val)), // Handle empty string as undefined for optional field
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
  adoption_status_id: z
    .string()
    .uuid({ message: "Please select a valid adoption status." }),
});

// Define a schema for PetLike
export const createPetIdUserIdSchema = z.object({
  parsedPetId: z.string(),
  parsedUserId: z.string(),
});

