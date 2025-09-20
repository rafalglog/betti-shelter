"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import { createDynamicSchema } from "../dynamicFormSchema";
import { TemplateField } from "../types";
import {
  withAuthenticatedUser,
  SessionUser,
  RequirePermission,
} from "../auth/protected-actions";
import { Permissions } from "@/app/lib/auth/permissions";
import { cuidSchema } from "../zod-schemas/common.schemas";

// Define a state for the form action
export interface AssessmentFormState {
  message?: string | null;
  errors?: Record<string, string[] | undefined>;
}

// Internal action wrapped for authentication
const _createAssessment = async (
  user: SessionUser, // Injected by withAuthenticatedUser
  prevState: AssessmentFormState,
  formData: FormData
): Promise<AssessmentFormState> => {
  const assessorId = user.personId;
  const data = Object.fromEntries(formData.entries());

  // Basic fields needed to find the template and create the schema
  const animalId = data.animalId as string;
  const templateId = data.templateId as string;

  if (!animalId || !templateId) {
    return { message: "Missing animal or template ID." };
  }

  try {
    // Fetch the template to build the dynamic schema
    const template = await prisma.assessmentTemplate.findUnique({
      where: { id: templateId },
      include: { templateFields: true },
    });

    if (!template) {
      return { message: "Assessment template not found" };
    }

    const allFields: TemplateField[] =
      template.templateFields as TemplateField[];
    const schema = createDynamicSchema(allFields);

    // Validate the form data against the dynamic schema
    const validatedFields = schema.safeParse(data);

    if (!validatedFields.success) {
      console.log(validatedFields.error.flatten().fieldErrors);
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: "Missing or invalid fields. Failed to create assessment.",
      };
    }

    // On successful validation, create the assessment in the database
    const { overallOutcome, summary } = validatedFields.data;

    await prisma.assessment.create({
      data: {
        animalId,
        templateId,
        assessorId: assessorId,
        overallOutcome,
        summary,
        fields: {
          create: Object.entries(validatedFields.data)
            .filter(([key]) => !key.endsWith("_notes")) // Exclude notes fields from this mapping
            .filter(
              ([_, value]) =>
                value !== undefined && value !== null && value !== ""
            ) // Correctly filter out only truly empty values
            .map(([fieldId, value]) => {
              const fieldDefinition = allFields.find((f) => f.id === fieldId);
              return {
                fieldName: fieldDefinition?.label || fieldId,
                fieldValue: String(value), // Convert all values to string for the DB
                notes: validatedFields.data[`${fieldId}_notes`] || null,
              };
            }),
        },
      },
    });

    // Create an activity log entry
    await prisma.animalActivityLog.create({
      data: {
        animalId,
        activityType: "ASSESSMENT_COMPLETED",
        changedById: assessorId,
        changeSummary: `${template.name} assessment completed with outcome: ${
          overallOutcome || "Not specified"
        }`,
      },
    });
  } catch (error) {
    console.error("Error creating assessment:", error);
    return { message: "Database Error: Failed to create assessment." };
  }

  // Revalidate paths and redirect on success
  revalidatePath(`/dashboard/animals/${animalId}/assessments`);
  revalidatePath(`/dashboard/animals/${animalId}`);
  redirect(`/dashboard/animals/${animalId}/assessments`);
};

const _updateAnimalAssessment = async(
  assessmentId: string,
  animalId: string,
  prevState: AssessmentFormState,
  formData: FormData
): Promise<AssessmentFormState> => {
  const parsedAssessmentId = cuidSchema.safeParse(assessmentId);
  if (!parsedAssessmentId.success) {
    return { message: "Invalid assessment ID format." };
  }
  const parsedAnimalId = cuidSchema.safeParse(animalId);
  if (!parsedAnimalId.success) {
    return { message: "Invalid animal ID format." };
  }

  const assessment = await prisma.assessment.findUnique({
    where: { id: assessmentId },
    select: { templateId: true },
  });

  if (!assessment || !assessment.templateId) {
    return { message: "Original assessment or its template not found." };
  }

  const template = await prisma.assessmentTemplate.findUnique({
    where: { id: assessment.templateId },
    include: { templateFields: true },
  });

  if (!template) {
    return { message: "Assessment template not found" };
  }

  const allFields: TemplateField[] = template.templateFields as TemplateField[];
  const schema = createDynamicSchema(allFields);
  const data = Object.fromEntries(formData.entries());

  const validatedFields = schema.safeParse(data);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing or invalid fields. Failed to update assessment.",
    };
  }

  const { overallOutcome, summary } = validatedFields.data;

  try {
    await prisma.assessment.update({
      where: { id: assessmentId },
      data: {
        overallOutcome,
        summary,
        fields: {
          deleteMany: { assessmentId: assessmentId }, // Delete all old fields
          create: Object.entries(validatedFields.data) // Create new fields from form data
            .filter(([key]) => !key.endsWith("_notes"))
            .filter(
              ([_, value]) =>
                value !== undefined && value !== null && value !== ""
            )
            .map(([fieldId, value]) => {
              const fieldDefinition = allFields.find((f) => f.id === fieldId);
              return {
                fieldName: fieldDefinition?.label || fieldId,
                fieldValue: String(value),
                notes: validatedFields.data[`${fieldId}_notes`] || null,
              };
            }),
        },
      },
    });
  } catch (error) {
    console.error("Database Error updating assessment:", error);
    return { message: "Database Error: Failed to update assessment." };
  }

  revalidatePath(`/dashboard/animals/${animalId}/assessments`);
  redirect(`/dashboard/animals/${animalId}/assessments`);
}

const _deleteAnimalAssessment = async (
  assessmentId: string,
  animalId: string
) => {
  const parsedAssessmentId = cuidSchema.safeParse(assessmentId);
  if (!parsedAssessmentId.success) {
    throw new Error("Invalid assessment ID format.");
  }

  try {
    await prisma.assessment.update({
      where: {
        id: parsedAssessmentId.data,
      },
      data: {
        deletedAt: new Date(),
      },
    });
    revalidatePath(`/dashboard/animals/${animalId}/assessments`);
    return { message: "Assessment deleted successfully." };
  } catch (error) {
    console.error("Database Error deleting assessment:", error);
    return {
      message: "Database Error: Failed to delete assessment.",
    };
  }
};

const _restoreAnimalAssessment = async (
  assessmentId: string,
  animalId: string
) => {
  const parsedAssessmentId = cuidSchema.safeParse(assessmentId);
  if (!parsedAssessmentId.success) {
    throw new Error("Invalid assessment ID format.");
  }

  try {
    await prisma.assessment.update({
      where: {
        id: parsedAssessmentId.data,
      },
      data: {
        deletedAt: null,
      },
    });

    revalidatePath(`/dashboard/animals/${animalId}/assessments`);
    return { message: "Assessment restored successfully." };
  } catch (error) {
    console.error("Database Error restoring assessment:", error);
    return {
      message: "Database Error: Failed to restore assessment.",
    };
  }
};

export const createAssessment = withAuthenticatedUser(
  RequirePermission(Permissions.ANIMAL_ASSESSMENT_CREATE)(_createAssessment)
);

export const updateAnimalAssessment = RequirePermission(
  Permissions.ANIMAL_ASSESSMENT_UPDATE
)(_updateAnimalAssessment);

export const deleteAnimalAssessment = RequirePermission(
  Permissions.ANIMAL_ASSESSMENT_DELETE
)(_deleteAnimalAssessment);

export const restoreAnimalAssessment = RequirePermission(
  Permissions.ANIMAL_ASSESSMENT_DELETE
)(_restoreAnimalAssessment);
