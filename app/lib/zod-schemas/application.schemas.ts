import { z } from "zod";
import { ApplicationStatus } from "@prisma/client";

// Exclude 'ADOPTED' from this list.
const updatableApplicationStatuses = [
  ApplicationStatus.PENDING,
  ApplicationStatus.REVIEWING,
  ApplicationStatus.WAITLISTED,
  ApplicationStatus.APPROVED,
  ApplicationStatus.REJECTED,
  ApplicationStatus.WITHDRAWN,
] as const;

export const StaffUpdateAdoptionAppFormSchema = z
  .object({
    status: z
      .enum(updatableApplicationStatuses, {
        errorMap: () => ({ message: "Invalid application status." }),
      })
      .optional(),
    internalNotes: z.string().optional(),
    statusChangeReason: z.string().optional(),
  });