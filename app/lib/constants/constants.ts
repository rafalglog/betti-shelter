import {
  ApplicationStatus,
  Sex,
  AnimalListingStatus,
  Role,
} from "@prisma/client";
import { LivingSituation } from "@prisma/client";

// items per page for pagination
export const ITEMS_PER_PAGE = 10;

// Allowed mime types for image uploads
export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];

// Maximum file size for image uploads (5MB)
export const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Const values for gender, role, and listing status
export const SEX_VALUES = Object.values(Sex);
export const ROLE_VALUES = Object.values(Role);
export const LISTING_STATUS_VALUES = Object.values(AnimalListingStatus);
export const APPLICATION_STATUS_VALUES = Object.values(ApplicationStatus);

// Const values for living situations
export const LIVING_SITUATION_OPTIONS = [
  { value: LivingSituation.OWN_HOME, label: "Own Home" },
  { value: LivingSituation.RENT_APARTMENT, label: "Rent Apartment" },
  { value: LivingSituation.RENT_HOUSE, label: "Rent House" },
  { value: LivingSituation.LIVE_WITH_FAMILY, label: "Live with Family" },
  { value: LivingSituation.OTHER, label: "Other" },
];

// Helper for boolean/optional radio groups
export const BOOLEAN_OPTIONS = [
  { label: "Yes", value: "true" },
  { label: "No", value: "false" },
];
