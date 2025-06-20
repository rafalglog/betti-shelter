"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "../prisma";
import { StaffUpdateAppFormState } from "../form-state-types";
import { StaffUpdateAdoptionAppFormSchema } from "../zod-schemas/application.schemas";
import { cuidSchema } from "../zod-schemas/common.schemas";
import { RequirePermission } from "../auth/protected-actions";
import { Permissions } from "@/app/lib/auth/permissions";
import {
  ApplicationStatus,
  PetListingStatus,
  PetArchiveReason,
  Prisma,
} from "@prisma/client";
import { auth } from "@/auth";

const _staffUpdateAdoptionApp = async (
  adoptionAppId: string,
  prevState: StaffUpdateAppFormState,
  formData: FormData
): Promise<StaffUpdateAppFormState> => {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return {
      message:
        "Unauthorized: You must be logged in and have a user ID to update adoption applications.",
    };
  }
  const currentUserId = session.user.id;

  const parsedAdoptionAppId = cuidSchema.safeParse(adoptionAppId);
  if (!parsedAdoptionAppId.success) {
    return { message: "Invalid Adoption Application ID format." };
  }
  const validatedAdoptionAppId = parsedAdoptionAppId.data;

  let existingApplication;
  try {
    existingApplication = await prisma.adoptionApplication.findUnique({
      where: { id: validatedAdoptionAppId },
      select: { status: true, petId: true, isPrimary: true },
    });
    if (!existingApplication) {
      return { message: "Adoption Application not found." };
    }
  } catch (error) {
    console.error("Database error fetching existing application:", error);
    return {
      message: "Database Error: Failed to retrieve application details.",
    };
  }

  const validatedFields = StaffUpdateAdoptionAppFormSchema.safeParse({
    status: formData.get("status") || undefined,
    internalNotes: formData.get("internalNotes") ?? undefined,
    statusChangeReason: formData.get("statusChangeReason") ?? undefined,
    isPrimary: formData.get("isPrimary"),
  });
  if (!validatedFields.success) {
    console.error(
      "Validation error in staff update adoption application:",
      validatedFields.error
    );
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message:
        "Missing or Invalid Fields. Failed to Update Adoption Application.",
    };
  }

  const {
    status: newStatus,
    internalNotes,
    statusChangeReason,
    isPrimary,
  } = validatedFields.data;
  const isStatusActuallyChanging =
    newStatus !== undefined && newStatus !== existingApplication.status;
  if (isStatusActuallyChanging) {
    const isExemptedChange =
      existingApplication.status === ApplicationStatus.PENDING &&
      newStatus === ApplicationStatus.REVIEWING;
    if (
      !isExemptedChange &&
      (!statusChangeReason || statusChangeReason.trim() === "")
    ) {
      return {
        message:
          "Validation Error: A reason for the status change is required.",
        errors: {
          statusChangeReason: ["A reason for the status change is required."],
        },
      };
    }
  }

  const applicationUpdateData: Prisma.AdoptionApplicationUpdateInput = {};
  if (isStatusActuallyChanging) {
    applicationUpdateData.status = newStatus;
  }
  if (internalNotes !== undefined) {
    applicationUpdateData.internalNotes =
      internalNotes.trim() === "" ? null : internalNotes;
  }
  if (isPrimary !== undefined && isPrimary !== existingApplication.isPrimary) {
    applicationUpdateData.isPrimary = isPrimary;
  }

  if (applicationUpdateData.isPrimary === true) {
    const finalStatus = newStatus ?? existingApplication.status;
    if (finalStatus !== ApplicationStatus.APPROVED) {
      return {
        message:
          "An application must be 'Approved' before it can be set as the primary choice.",
        errors: { status: ["This must be 'APPROVED' to set as primary."] },
      };
    }
  }

  if (
    Object.keys(applicationUpdateData).length === 0 &&
    !isStatusActuallyChanging
  ) {
    return { message: "No changes provided to update the application." };
  }

  try {
    await prisma.$transaction(async (tx) => {
      if (
        applicationUpdateData.isPrimary === true &&
        existingApplication.petId
      ) {
        await tx.adoptionApplication.updateMany({
          where: {
            petId: existingApplication.petId,
            id: { not: validatedAdoptionAppId },
            isPrimary: true,
          },
          data: {
            isPrimary: false,
          },
        });
      }

      // Pet status management based on application changes.
      // These rules apply unless the application status is changing to ADOPTED,
      // in which case the pet becomes ARCHIVED (handled further down).
      const intendedFinalStatus = newStatus ?? existingApplication.status;
      const intendedIsPrimary = validatedFields.data.isPrimary;

      if (
        existingApplication.petId &&
        newStatus !== ApplicationStatus.ADOPTED
      ) {
        // If an application is (or becomes) primary and approved, pet -> PENDING_ADOPTION.
        if (
          intendedIsPrimary === true &&
          intendedFinalStatus === ApplicationStatus.APPROVED
        ) {
          await tx.pet.update({
            where: { id: existingApplication.petId },
            data: { listingStatus: PetListingStatus.PENDING_ADOPTION },
          });
        }
        // If a previously primary and approved application is no longer effectively reserving the pet,
        // (either isPrimary toggled to false, or status changed from APPROVED to WITHDRAWN/REJECTED),
        // then pet -> PUBLISHED.
        else if (
          existingApplication.isPrimary === true &&
          existingApplication.status === ApplicationStatus.APPROVED
        ) {
          // isPrimary is toggled from true to false, while status remains APPROVED.
          if (
            intendedIsPrimary === false &&
            intendedFinalStatus === ApplicationStatus.APPROVED
          ) {
            await tx.pet.update({
              where: { id: existingApplication.petId },
              data: { listingStatus: PetListingStatus.PUBLISHED },
            });
          }
          // Status changes from APPROVED to WITHDRAWN or REJECTED (isPrimary might also be changing).
          else if (
            newStatus &&
            (newStatus === ApplicationStatus.WITHDRAWN ||
              newStatus === ApplicationStatus.REJECTED)
          ) {
            await tx.pet.update({
              where: { id: existingApplication.petId },
              data: { listingStatus: PetListingStatus.PUBLISHED },
            });
          }
        }
      }
      // The ADOPTED status change below will override pet status to ARCHIVED if applicable.

      if (newStatus === ApplicationStatus.ADOPTED) {
        const pet = await tx.pet.findUnique({
          where: { id: existingApplication.petId },
          select: { listingStatus: true },
        });

        if (pet?.listingStatus === PetListingStatus.ARCHIVED) {
          throw new Error(
            "This pet has already been adopted or is otherwise no longer available."
          );
        }

        // Update Pet's Status to ARCHIVED
        await tx.pet.update({
          where: { id: existingApplication.petId },
          data: {
            listingStatus: PetListingStatus.ARCHIVED,
            archiveReason: PetArchiveReason.ADOPTED_INTERNAL,
          },
        });

        // Find and reject other applications for the same pet
        const otherAppsToReject = await tx.adoptionApplication.findMany({
          where: {
            petId: existingApplication.petId,
            id: { not: validatedAdoptionAppId },
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
        const otherAppIdsToReject = otherAppsToReject.map((app) => app.id);

        if (otherAppIdsToReject.length > 0) {
          await tx.adoptionApplication.updateMany({
            where: {
              id: { in: otherAppIdsToReject },
            },
            data: {
              status: ApplicationStatus.REJECTED,
            },
          });

          const statusChangeReasonForRejection =
            "Application rejected as the pet has been adopted through another application.";
          const historyRecords = otherAppIdsToReject.map((appId) => ({
            applicationId: appId,
            status: ApplicationStatus.REJECTED,
            statusChangeReason: statusChangeReasonForRejection,
            changedById: currentUserId,
          }));
          await tx.applicationStatusHistory.createMany({
            data: historyRecords,
          });
        }
      }

      if (Object.keys(applicationUpdateData).length > 0) {
        await tx.adoptionApplication.update({
          where: { id: validatedAdoptionAppId },
          data: applicationUpdateData,
        });
      }

      if (isStatusActuallyChanging && newStatus) {
        await tx.applicationStatusHistory.create({
          data: {
            applicationId: validatedAdoptionAppId,
            status: newStatus,
            statusChangeReason:
              statusChangeReason || "Application moved to review.",
            changedById: currentUserId,
          },
        });
      }
    });
  } catch (error) {
    console.error("Database Error during transaction:", error);
    if (
      error instanceof Error &&
      error.message.includes("This pet has already been adopted")
    ) {
      return { message: error.message };
    }
    return {
      message:
        "Database Error: Failed to Update Adoption Application and associated records.",
    };
  }

  revalidatePath("/dashboard/applications");
  revalidatePath(`/dashboard/applications/${validatedAdoptionAppId}`);
  redirect("/dashboard/applications");
};

export const staffUpdateAdoptionApp = RequirePermission(
  Permissions.APPLICATIONS_MANAGE_STATUS
)(_staffUpdateAdoptionApp);
