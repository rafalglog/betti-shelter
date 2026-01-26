import { z } from "zod";
import { Role } from "@prisma/client";
import { currentPageSchema, searchQuerySchema } from "./common.schemas";

// Schema for the parameters of fetchFilteredUsers function
export const UsersParamsSchema = z.object({
  query: searchQuerySchema,
  currentPage: currentPageSchema,
  sort: z.string().optional(),
  role: z.string().optional(), 
});

export const UserCreateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  role: z
    .enum(Role)
    .refine((role) => role !== Role.ADMIN, {
      error: "Assigning the Admin role is not permitted here.",
    }),
  password: z.string().min(6, "Password must be at least 6 characters."),
});
