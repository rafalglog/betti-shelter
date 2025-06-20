import { z } from "zod";

export const searchQuerySchema = z
  .string()
  .trim()
  .max(100, { message: "Query cannot exceed 100 characters." });

// Helper for CUID validation
export const cuidSchema = z.string().cuid({ message: "Invalid ID format. Expected a CUID." });

// Reusable schema for currentPage
export const currentPageSchema = z
  .number()
  .int()
  .positive({ message: "Page number must be a positive integer." });
