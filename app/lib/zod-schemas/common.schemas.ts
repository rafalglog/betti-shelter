import { z } from "zod";

export const searchQuerySchema = z
  .string()
  .trim()
  .max(100, { message: "Query cannot exceed 100 characters." });

// Regular expression for CUID validation
const CUID_REGEX = /^c[a-z0-9]{24}$/;
const CUID_MESSAGE = "Invalid CUID format.";

// Helper for CUID validation
export const cuidSchema = z.string().regex(CUID_REGEX, { message: CUID_MESSAGE });

// Reusable schema for currentPage
export const currentPageSchema = z.number().int().positive({ message: "Page number must be a positive integer." });