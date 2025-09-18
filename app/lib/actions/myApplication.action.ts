"use server";

import { MyAdoptionAppFormState } from "../form-state-types";
import { cuidSchema } from "../zod-schemas/common.schemas";
import { prisma } from "../prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ApplicationStatus, Prisma } from "@prisma/client";
import { MyAdoptionAppFormSchema } from "../zod-schemas/myApplication.schema";
import { SessionUser, withAuthenticatedUser } from "../auth/protected-actions";
import { ActionResult } from "../types";

// Server action for the user to update their application
const _updateMyAdoptionApp = async (
  user: SessionUser, // Injected by withAuthenticatedUser
  applicationId: string, // Adoption Application ID from the URL parameters
  prevState: MyAdoptionAppFormState,
  formData: FormData
): Promise<MyAdoptionAppFormState> => {
  const currentUserId = user.id;

  // Validate the applicationId
  const parsedApplicationId = cuidSchema.safeParse(applicationId);
  if (!parsedApplicationId.success) {
    return {
      message: "Invalid Adoption Application ID format.",
    };
  }
  const validatedApplicationId = parsedApplicationId.data;

  // Verify that the application belongs to the current user
  try {
    const application = await prisma.adoptionApplication.findUnique({
      where: { id: validatedApplicationId },
      select: { userId: true, status: true },
    });

    if (!application) {
      return { message: "Adoption Application not found." };
    }

    // Perform the ABAC (context-aware) check
    // Check if the application belongs to the current user
    if (application.userId !== currentUserId) {
      return {
        message: "Access Denied. You can only update your own applications.",
      };
    }

    // Check if the application status prevents modification
    const nonEditableStatuses: ApplicationStatus[] = [
      ApplicationStatus.REVIEWING,
      ApplicationStatus.APPROVED,
      ApplicationStatus.REJECTED,
      ApplicationStatus.WITHDRAWN,
      ApplicationStatus.ADOPTED,
    ];

    if (nonEditableStatuses.includes(application.status)) {
      return {
        message: `Cannot update application. Its status is currently "${application.status}". Applications cannot be modified if their status is REVIEWING, APPROVED, REJECTED, WITHDRAWN, or ADOPTED.`,
      };
    }
  } catch (error) {
    console.error(
      "Database error while verifying application ownership:",
      error
    );
    return {
      message: "Database Error: Failed to verify application ownership.",
    };
  }

  // Validate form fields using Zod
  const validatedFields = MyAdoptionAppFormSchema.safeParse({
    applicantName: formData.get("applicantName"),
    applicantEmail: formData.get("applicantEmail"),
    applicantPhone: formData.get("applicantPhone"),
    applicantAddressLine1: formData.get("applicantAddressLine1"),
    applicantAddressLine2: formData.get("applicantAddressLine2"),
    applicantCity: formData.get("applicantCity"),
    applicantState: formData.get("applicantState"),
    applicantZipCode: formData.get("applicantZipCode"),
    livingSituation: formData.get("livingSituation"),
    hasYard: formData.get("hasYard"),
    landlordPermission: formData.get("landlordPermission"),
    householdSize: formData.get("householdSize"),
    hasChildren: formData.get("hasChildren"),
    childrenAges: formData.get("childrenAges"),
    otherPetsDescription: formData.get("otherPetsDescription"),
    petExperience: formData.get("petExperience"),
    reasonForAdoption: formData.get("reasonForAdoption"),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Adoption Application.",
    };
  }

  // Prepare data for insertion into the database
  const {
    applicantName,
    applicantEmail,
    applicantPhone,
    applicantAddressLine1,
    applicantAddressLine2,
    applicantCity,
    applicantState,
    applicantZipCode,
    livingSituation,
    hasYard,
    landlordPermission,
    householdSize,
    hasChildren,
    childrenAges,
    otherPetsDescription,
    petExperience,
    reasonForAdoption,
  } = validatedFields.data;

  // Update the adoption application
  try {
    await prisma.adoptionApplication.update({
      where: { id: validatedApplicationId },
      data: {
        applicantName,
        applicantEmail,
        applicantPhone,
        applicantAddressLine1,
        applicantAddressLine2,
        applicantCity,
        applicantState,
        applicantZipCode,
        livingSituation,
        hasYard,
        landlordPermission,
        householdSize,
        hasChildren,
        childrenAges,
        otherPetsDescription,
        petExperience,
        reasonForAdoption,
      },
    });
  } catch (error) {
    console.error(
      `Database Error updating adoption application ${validatedApplicationId}:`,
      error
    );
    return {
      message: "Database Error: Failed to Update Adoption Application.",
    };
  }

  // Revalidate relevant paths
  revalidatePath("/dashboard/my-applications");
  revalidatePath(`/dashboard/my-applications/${validatedApplicationId}`);

  // Redirect to the updated application's page
  redirect(`/dashboard/my-applications`);
};

const _withdrawMyApplication = async (
  user: SessionUser, // Injected by withAuthenticatedUser
  applicationId: string
): Promise<ActionResult> => {
  const currentUserId = user.id;

  // Validate the applicationId
  const parsedApplicationId = cuidSchema.safeParse(applicationId);
  if (!parsedApplicationId.success) {
    return { success: false, message: "Invalid Adoption Application ID format." };
  }
  const validatedApplicationId = parsedApplicationId.data;

  // Verify ownership and status
  try {
    const application = await prisma.adoptionApplication.findUnique({
      where: { id: validatedApplicationId },
      select: { userId: true, status: true },
    });

    if (!application) {
      return { success: false, message: "Adoption Application not found." };
    }

    if (application.userId !== currentUserId) {
      return {
        success: false,
        message: "Access Denied. You can only withdraw your own applications.",
      };
    }

    const nonWithdrawableStatuses: ApplicationStatus[] = [
      ApplicationStatus.ADOPTED,
      ApplicationStatus.WITHDRAWN,
      ApplicationStatus.REJECTED,
    ];

    if (nonWithdrawableStatuses.includes(application.status)) {
      return {
        success: false,
        message: `Cannot withdraw application. Its status is currently "${application.status}".`,
      };
    }
  } catch (error) {
    console.error("Error verifying application ownership for withdrawal:", error);
    return {
      success: false,
      message: "A server error occurred while verifying the application. Please try again.",
    };
  }

  // Update the application status
  try {
    await prisma.adoptionApplication.update({
      where: { id: validatedApplicationId },
      data: { status: ApplicationStatus.WITHDRAWN },
    });
  } catch (error) {
    console.error(`Database Error withdrawing adoption application ${validatedApplicationId}:`, error);
    return {
      success: false,
      message: "Database Error: Failed to withdraw Adoption Application.",
    };
  }
  
  // On success, revalidate paths and return success
  revalidatePath("/dashboard/my-applications");
  revalidatePath(`/dashboard/my-applications/${validatedApplicationId}`);

  redirect("/dashboard/my-applications");
};

// Server action for the user to reactivate a withdrawn application
const _reactivateMyApplication = async (
  user: SessionUser, // Injected by withAuthenticatedUser
  applicationId: string
): Promise<ActionResult> => {
  const currentUserId = user.id;

  // Validate the applicationId
  const parsedApplicationId = cuidSchema.safeParse(applicationId);
  if (!parsedApplicationId.success) {
    return { success: false, message: "Invalid Adoption Application ID format." };
  }
  const validatedApplicationId = parsedApplicationId.data;

  // Verify ownership and status
  try {
    const application = await prisma.adoptionApplication.findUnique({
      where: { id: validatedApplicationId },
      select: { userId: true, status: true },
    });

    if (!application) {
      return { success: false, message: "Adoption Application not found." };
    }

    if (application.userId !== currentUserId) {
      return {
        success: false,
        message: "Access Denied. You can only reactivate your own applications.",
      };
    }

    // Check if the application status is WITHDRAWN
    if (application.status !== ApplicationStatus.WITHDRAWN) {
      return {
        success: false,
        message: `Cannot reactivate application. Its status is currently "${application.status}".`,
      };
    }
  } catch (error) {
    console.error("Error verifying application for reactivation:", error);
    return {
      success: false,
      message: "A server error occurred while verifying the application. Please try again.",
    };
  }

  // Update the application status to PENDING
  try {
    await prisma.adoptionApplication.update({
      where: { id: validatedApplicationId },
      data: { status: ApplicationStatus.PENDING },
    });
  } catch (error) {
    console.error(`Database Error reactivating adoption application ${validatedApplicationId}:`, error);
    return {
      success: false,
      message: "Database Error: Failed to reactivate Adoption Application.",
    };
  }

  // On success, revalidate paths and return success
  revalidatePath("/dashboard/my-applications");
  revalidatePath(`/dashboard/my-applications/${validatedApplicationId}`);

  return { success: true, message: "Application reactivated successfully." };
};

// Server action for the user to submit an application
const _createMyAdoptionApp = async (
  user: SessionUser, // Injected by withAuthenticatedUser
  animalId: string, // Pet ID from the URL parameters
  prevState: MyAdoptionAppFormState,
  formData: FormData
): Promise<MyAdoptionAppFormState> => {
  const currentUserId = user.id;

  const parsedanimalId = cuidSchema.safeParse(petId);
  if (!parsedPetId.success) {
    return {
      message: "Invalid Adoption Application ID format.",
    };
  }
  const validatedPetId = parsedPetId.data;

  // Validate form fields using Zod
  const validatedFields = MyAdoptionAppFormSchema.safeParse({
    applicantName: formData.get("applicantName"),
    applicantEmail: formData.get("applicantEmail"),
    applicantPhone: formData.get("applicantPhone"),
    applicantAddressLine1: formData.get("applicantAddressLine1"),
    applicantAddressLine2: formData.get("applicantAddressLine2"),
    applicantCity: formData.get("applicantCity"),
    applicantState: formData.get("applicantState"),
    applicantZipCode: formData.get("applicantZipCode"),
    livingSituation: formData.get("livingSituation"),
    hasYard: formData.get("hasYard"),
    landlordPermission: formData.get("landlordPermission"),
    householdSize: formData.get("householdSize"),
    hasChildren: formData.get("hasChildren"),
    childrenAges: formData.get("childrenAges"),
    otherPetsDescription: formData.get("otherPetsDescription"),
    petExperience: formData.get("petExperience"),
    reasonForAdoption: formData.get("reasonForAdoption"),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Submit Application.",
    };
  }

  // Prepare data for insertion into the database
  const {
    applicantName,
    applicantEmail,
    applicantPhone,
    applicantAddressLine1,
    applicantAddressLine2,
    applicantCity,
    applicantState,
    applicantZipCode,
    livingSituation,
    hasYard,
    landlordPermission,
    householdSize,
    hasChildren,
    childrenAges,
    otherPetsDescription,
    petExperience,
    reasonForAdoption,
  } = validatedFields.data;

  try {
    await prisma.adoptionApplication.create({
      data: {
        userId: currentUserId,
        petId: validatedPetId,
        applicantName: applicantName,
        applicantEmail: applicantEmail,
        applicantPhone: applicantPhone,
        applicantAddressLine1: applicantAddressLine1,
        applicantAddressLine2: applicantAddressLine2,
        applicantCity: applicantCity,
        applicantState: applicantState,
        applicantZipCode: applicantZipCode,
        livingSituation: livingSituation,
        hasYard: hasYard,
        landlordPermission: landlordPermission,
        householdSize: householdSize,
        hasChildren: hasChildren,
        childrenAges: childrenAges,
        otherPetsDescription: otherPetsDescription,
        petExperience: petExperience,
        reasonForAdoption: reasonForAdoption,
      },
    });
  } catch (error: unknown) {
    console.error("Error submitting adoption application:", error);
    return {
      message:
        "Database Error: Failed to submit application. Please try again.",
    };
  }

  revalidatePath("/dashboard/my-applications");

  redirect("/dashboard/my-applications");
};


export const updateMyAdoptionApp = withAuthenticatedUser(_updateMyAdoptionApp);
export const withdrawMyApplication = withAuthenticatedUser(_withdrawMyApplication);
export const createMyAdoptionApp = withAuthenticatedUser(_createMyAdoptionApp);
export const reactivateMyApplication = withAuthenticatedUser(_reactivateMyApplication);
