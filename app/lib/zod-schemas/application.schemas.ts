import { z } from "zod";
import { ApplicationStatus } from "@prisma/client";

export const StaffUpdateAdoptionAppFormSchema = z
  .object({
    status: z
      .nativeEnum(ApplicationStatus, {
        errorMap: () => ({ message: "Invalid application status." }),
      })
      .optional(),
    internalNotes: z.string().optional(),
    statusChangeReason: z.string().optional(),
    isPrimary: z
      .preprocess((val) => val === 'true', z.boolean())
      .optional(),
  });
