import { Gender, Role } from "@prisma/client";

// items per page for pagination
export const ITEMS_PER_PAGE = 6;

// Allowed mime types for image uploads
export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];

// Maximum file size for image uploads (5MB)
export const MAX_FILE_SIZE = 5 * 1024 * 1024;

export const GENDER_VALUES = Object.values(Gender);

export const ROLE_VALUES = Object.values(Role);