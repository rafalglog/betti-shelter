import { z } from "zod";
import { Role } from "@prisma/client";
import { currentPageSchema, searchQuerySchema } from "./common.schemas";

// Define a schema for the user form
export const updateUserFormSchema = z.object({
  role: z.nativeEnum(Role, {
    required_error: "Please select a role.",
    invalid_type_error: "Invalid role selected.",
  }),
});

// Schema for the parameters of fetchFilteredUsers function
export const FilteredUsersParamsSchema = z.object({
  query: searchQuerySchema,
  currentPage: currentPageSchema,
});