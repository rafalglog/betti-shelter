"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "../prisma";
import { auth } from "@/auth";
import { RequirePermission } from "../auth/protected-actions";
import { Permissions } from "../auth/permissions";
import { OutcomeFormSchema } from "../zod-schemas/outcome.schema";
import {
  AnimalArchiveReason,
  AnimalListingStatus,
  ApplicationStatus,
  OutcomeType,
} from "@prisma/client";
import { OutcomeFormState } from "../form-state-types";

// Helper function to map OutcomeType to AnimalArchiveReason
const getArchiveReasonFromOutcomeType = (
  outcomeType: OutcomeType
): AnimalArchiveReason => {
  switch (outcomeType) {
    case "ADOPTION":
      return AnimalArchiveReason.ADOPTED_INTERNAL;
    case "TRANSFER_OUT":
      return AnimalArchiveReason.TRANSFERRED;
    case "RETURN_TO_OWNER":
      return AnimalArchiveReason.RETURNED_TO_OWNER;
    case "DECEASED":
      return AnimalArchiveReason.DECEASED;
    default:
      return AnimalArchiveReason.OTHER;
  }
};

interface CreateOutcomeIds {
  animalId: string;
  adoptionApplicationId?: string;
}

const _createOutcome = async (
  ids: CreateOutcomeIds,
  prevState: OutcomeFormState,
  formData: FormData
): Promise<OutcomeFormState> => {
  const session = await auth();
  if (!session?.user?.id) {
    return { message: "Unauthorized: You must be logged in." };
  }
  const staffMemberId = session.user.id;
  const { animalId, adoptionApplicationId } = ids;

  // Validate form fields
  const validatedFields = OutcomeFormSchema.safeParse({
    outcomeDate: new Date(formData.get("outcomeDate") as string),
    outcomeType: formData.get("outcomeType"),
    destinationPartnerId: formData.get("destinationPartnerId") || undefined,
    notes: formData.get("notes") || undefined,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing or Invalid Fields. Failed to Process Outcome.",
    };
  }

  const { outcomeDate, outcomeType, destinationPartnerId, notes } =
    validatedFields.data;
  const archiveReason = getArchiveReasonFromOutcomeType(outcomeType);

  try {
    await prisma.$transaction(async (tx) => {
      // Ensure animal is not already archived
      const animal = await tx.animal.findUnique({
        where: { id: animalId },
        select: { listingStatus: true },
      });

      if (animal?.listingStatus === AnimalListingStatus.ARCHIVED) {
        throw new Error("This animal has already been archived.");
      }

      // Create the Outcome record
      await tx.outcome.create({
        data: {
          outcomeDate,
          type: outcomeType,
          notes,
          animal: { connect: { id: animalId } },
          staffMember: { connect: { id: staffMemberId } },
          // Conditionally connect relationships
          ...(adoptionApplicationId && {
            adoptionApplication: { connect: { id: adoptionApplicationId } },
          }),
          ...(destinationPartnerId && {
            destinationPartner: { connect: { id: destinationPartnerId } },
          }),
        },
      });

      // Update the Animal to be ARCHIVED
      await tx.animal.update({
        where: { id: animalId },
        data: {
          listingStatus: AnimalListingStatus.ARCHIVED,
          archiveReason: archiveReason,
        },
      });

      // If this is from an application, update it and reject others
      if (adoptionApplicationId) {
        // Update the application status to ADOPTED
        await tx.adoptionApplication.update({
          where: { id: adoptionApplicationId },
          data: { status: ApplicationStatus.ADOPTED },
        });

        // Create a history record for the adoption
        await tx.applicationStatusHistory.create({
          data: {
            applicationId: adoptionApplicationId,
            status: ApplicationStatus.ADOPTED,
            statusChangeReason: "Animal adopted by applicant.",
            changedById: staffMemberId,
          },
        });

        // Reject other open applications for this animal
        const otherApps = await tx.adoptionApplication.findMany({
          where: {
            animalId: animalId,
            id: { not: adoptionApplicationId },
            status: {
              in: [
                ApplicationStatus.PENDING,
                ApplicationStatus.REVIEWING,
                ApplicationStatus.APPROVED,
              ],
            },
          },
          select: { id: true },
        });

        const otherAppIds = otherApps.map((app) => app.id);
        if (otherAppIds.length > 0) {
          await tx.adoptionApplication.updateMany({
            where: { id: { in: otherAppIds } },
            data: { status: ApplicationStatus.REJECTED },
          });

          const rejectionReason =
            "Application rejected as the animal has been adopted.";
          const historyRecords = otherAppIds.map((appId) => ({
            applicationId: appId,
            status: ApplicationStatus.REJECTED,
            statusChangeReason: rejectionReason,
            changedById: staffMemberId,
          }));
          await tx.applicationStatusHistory.createMany({
            data: historyRecords,
          });
        }
      }
    });
  } catch (error) {
    console.error("Database error processing outcome:", error);
    return {
      message:
        error instanceof Error
          ? error.message
          : "Database Error: Failed to process outcome.",
    };
  }

  revalidatePath("/dashboard/animals");
  revalidatePath(`/dashboard/animals/${animalId}`);
  if (adoptionApplicationId) {
    revalidatePath("/dashboard/applications");
    revalidatePath(`/dashboard/applications/${adoptionApplicationId}`);
  }

  return { message: "Outcome processed successfully." };
};

const _updateOutcome = async (
  outcomeId: string,
  prevState: OutcomeFormState,
  formData: FormData
): Promise<OutcomeFormState> => {
  const session = await auth();
  if (!session?.user?.id) {
    return { message: "Unauthorized: You must be logged in." };
  }

  // Validate form fields
  const validatedFields = OutcomeFormSchema.safeParse({
    outcomeDate: new Date(formData.get("outcomeDate") as string),
    outcomeType: formData.get("outcomeType"),
    destinationPartnerId: formData.get("destinationPartnerId") || undefined,
    notes: formData.get("notes") || undefined,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing or Invalid Fields. Failed to Update Outcome.",
    };
  }

  const { outcomeDate, outcomeType, destinationPartnerId, notes } =
    validatedFields.data;
  const archiveReason = getArchiveReasonFromOutcomeType(outcomeType);

  try {
    const existingOutcome = await prisma.outcome.findUnique({
      where: { id: outcomeId },
      select: { animalId: true },
    });

    if (!existingOutcome) {
      return { message: "Error: Outcome record not found." };
    }

    await prisma.$transaction(async (tx) => {
      await tx.outcome.update({
        where: { id: outcomeId },
        data: {
          outcomeDate,
          type: outcomeType,
          notes,
          destinationPartnerId:
            outcomeType === "TRANSFER_OUT" ? destinationPartnerId : null,
        },
      });

      // Update the animal's archive reason in case the type changed
      await tx.animal.update({
        where: { id: existingOutcome.animalId },
        data: { archiveReason: archiveReason },
      });
    });
  } catch (error) {
    console.error("Database error updating outcome:", error);
    return { message: "Database Error: Failed to update outcome." };
  }

  revalidatePath("/dashboard/outcomes");
  revalidatePath(
    `/dashboard/animals/${
      (await prisma.outcome.findUnique({ where: { id: outcomeId } }))?.animalId
    }`
  );

  return { message: "Outcome updated successfully." };
};

export const createOutcome = RequirePermission(Permissions.OUTCOMES_MANAGE)(
  _createOutcome
);
export const updateOutcome = RequirePermission(Permissions.OUTCOMES_MANAGE)(
  _updateOutcome
);
