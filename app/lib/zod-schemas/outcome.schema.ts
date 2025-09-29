import { z } from "zod";
import { OutcomeType } from "@prisma/client";

export const OutcomeFormSchema = z
  .object({
    outcomeDate: z.date({ required_error: "An outcome date is required." }),
    outcomeType: z.nativeEnum(OutcomeType, {
      required_error: "An outcome type is required.",
    }),
    destinationPartnerId: z.string().optional(),
    notes: z.string().optional(),
  })
  .refine(
    (data) => {
      // If the outcome type is TRANSFER_OUT, a partner must be selected.
      if (data.outcomeType === "TRANSFER_OUT") {
        return !!data.destinationPartnerId;
      }
      return true;
    },
    {
      message: "A destination partner is required for transfers.",
      path: ["destinationPartnerId"], // Field that will display the error
    }
  );