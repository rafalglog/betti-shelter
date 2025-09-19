"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import { createDynamicSchema } from "../dynamicFormSchema";
import { TemplateField } from "../types";
import { withAuthenticatedUser, SessionUser, RequirePermission } from "../auth/protected-actions";
import { Permissions } from "@/app/lib/auth/permissions";

// Define a state for the form action
export interface AssessmentFormState {
  message?: string | null;
  errors?: Record<string, string[] | undefined>;
}

// Internal action wrapped for authentication
async function _createAssessment(
  user: SessionUser, // Injected by withAuthenticatedUser
  prevState: AssessmentFormState,
  formData: FormData
): Promise<AssessmentFormState> {
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

    const allFields: TemplateField[] = template.templateFields as TemplateField[];
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
}

export const createAssessment = withAuthenticatedUser(
  RequirePermission(Permissions.ANIMAL_ASSESSMENT_CREATE)(_createAssessment)
);
