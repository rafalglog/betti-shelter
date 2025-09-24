import { z } from "zod";
import {
  Sex,
  AnimalHealthStatus,
  IntakeType,
  TaskStatus,
  TaskCategory,
  TaskPriority,
  NoteCategory,
} from "@prisma/client";
import { US_STATES } from "@/app/lib/constants/us-states";
import {
  cuidSchema,
  currentPageSchema,
  searchQuerySchema,
} from "./common.schemas";

// Reusable schema for speciesName
const speciesNameSchema = z
  .string()
  .max(50, { message: "Species name must be at most 50 characters long." })
  .optional();

export const PublishedPetsFilterSchema = z.object({
  query: searchQuerySchema,
  currentPage: currentPageSchema,
  speciesName: speciesNameSchema,
});

export const DashboardAnimalsFilterSchema = z.object({
  query: searchQuerySchema,
  currentPage: currentPageSchema,
  listingStatus: z.string().optional(),
  sex: z.string().optional(),
  pageSize: z.number(),
  sort: z.string().optional(),
});

export const DashboardTasksFilterSchema = z.object({
  query: searchQuerySchema,
  currentPage: currentPageSchema,
  category: z.string().optional(),
  status: z.string().optional(),
  pageSize: z.number(),
  sort: z.string().optional(),
  animalId: cuidSchema,
});

const stateCodes = US_STATES.map((state) => state.code) as [
  string,
  ...string[]
];

export const AnimalFormSchema = z
  .object({
    // Core Animal Details
    animalName: z.string().min(1, { message: "Animal name is required." }),
    species: z.string().cuid({ message: "A valid species ID is required." }),
    breed: z.string().cuid({ message: "A valid primary breed ID is required." }),
    primaryColor: z.string().cuid({ message: "A valid primary color ID is required." }),
    sex: z.nativeEnum(Sex, { required_error: "Sex is required." }),
    estimatedBirthDate: z.coerce.date({
      required_error: "Estimated birth date is required.",
    }),
    healthStatus: z.nativeEnum(AnimalHealthStatus, {
      required_error: "Health status is required.",
    }),
    weightKg: z.coerce
      .number({ invalid_type_error: "Weight must be a number." })
      .positive({ message: "Weight must be a positive number." })
      .optional()
      .or(z.literal("")),
    heightCm: z.coerce
      .number({ invalid_type_error: "Height must be a number." })
      .positive({ message: "Height must be a positive number." })
      .optional()
      .or(z.literal("")),
    microchipNumber: z.string().optional(),
    description: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),

    // Intake-Only Details
    intakeType: z.nativeEnum(IntakeType).optional(),
    intakeDate: z.coerce.date().optional(),
    notes: z.string().optional(),
    sourcePartnerId: z.string().cuid().optional().or(z.literal("")),
    foundAddress: z.string().optional(),
    foundCity: z.string().optional(),
    foundState: z.string().optional(),
    surrenderingPersonName: z.string().optional(),
    surrenderingPersonPhone: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.intakeType === "TRANSFER_IN" && !data.sourcePartnerId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Source partner is required for transfers.",
        path: ["sourcePartnerId"],
      });
    }

    if (data.intakeType === "OWNER_SURRENDER" && !data.surrenderingPersonName) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Surrenderer's name is required for owner surrenders.",
        path: ["surrenderingPersonName"],
      });
    }

    if (data.intakeType === "STRAY") {
      if (!data.foundAddress) {
        ctx.addIssue({
          code: "custom",
          message: "Address is required for strays.",
          path: ["foundAddress"],
        });
      }
      if (!data.foundCity) {
        ctx.addIssue({
          code: "custom",
          message: "City is required for strays.",
          path: ["foundCity"],
        });
      }
      if (!data.foundState) {
        ctx.addIssue({
          code: "custom",
          message: "State is required for strays.",
          path: ["foundState"],
        });
      } else if (!stateCodes.includes(data.foundState)) {
        ctx.addIssue({
          code: "custom",
          message: "Please select a valid US state.",
          path: ["foundState"],
        });
      }
    }
  });

export const TaskFormSchema = z
  .object({
    title: z.string().min(1, { message: "Title is required." }),
    details: z.string().optional(),
    status: z.nativeEnum(TaskStatus).optional(),
    category: z.nativeEnum(TaskCategory, {
      required_error: "Category is required.",
    }),
    priority: z.nativeEnum(TaskPriority).optional(),
    dueDate: z.coerce.date().optional(), // Coerce to a date, keep it optional
    assigneeId: z
      .string()
      .cuid({ message: "Valid assignee ID is required." })
      .optional(),
  })
  .refine(
    (data) => {
      // If a due date is provided, it must not be in the past.
      if (data.dueDate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to the beginning of today
        return data.dueDate >= today;
      }
      // If no due date is provided, the validation passes.
      return true;
    },
    {
      message: "Due date cannot be in the past.",
      path: ["dueDate"], // Specify which field the error message applies to
    }
  );

export const NoteFormSchema = z.object({
  category: z.nativeEnum(NoteCategory),
  content: z.string().min(1, { message: "Content cannot be empty." }),
});

export const assessmentFieldSchema = z.object({
  fieldName: z.string().min(1, "Field name cannot be empty."),
  fieldValue: z.string().min(1, "Field value cannot be empty."),
  notes: z.string().optional(),
});
