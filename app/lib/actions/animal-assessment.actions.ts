"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/prisma";
import { createDynamicSchema } from "../dynamicFormSchema";
import { AssessmentFormData, TemplateField } from "../types";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function createAssessment(data: AssessmentFormData) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("Unauthorized: You must be logged in.");
  }
  const assessorIdSession = session.user.personId;

  try {
    const animal = await prisma.animal.findUnique({
      where: { id: data.animalId },
    });
    if (!animal) throw new Error("Animal not found");

    const template = await prisma.assessmentTemplate.findUnique({
      where: { id: data.templateId },
      include: { templateFields: true },
    });
    if (!template) {
      throw new Error("Assessment template not found");
    }

    const allFields: TemplateField[] = [
      ...(template.templateFields as TemplateField[]),
      ...(data.customFields || []),
    ];
    const schema = createDynamicSchema(allFields);

    const {
      animalId,
      templateId,
      overallOutcome,
      summary,
      customFields,
      ...fieldData
    } = data;

    const validatedData = schema.parse(fieldData);

    const assessment = await prisma.assessment.create({
      data: {
        animalId,
        templateId,
        assessorId: assessorIdSession,
        overallOutcome,
        summary,
        fields: {
          create: Object.entries(validatedData)
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
                notes: validatedData[`${fieldId}_notes`] || null,
              };
            }),
        },
      },
      include: {
        fields: true,
        assessor: true,
        template: true,
      },
    });

    await prisma.animalActivityLog.create({
      data: {
        animalId,
        activityType: "ASSESSMENT_COMPLETED",
        changedById: assessorIdSession,
        changeSummary: `${template.name} assessment completed with outcome: ${
          overallOutcome || "Not specified"
        }`,
      },
    });
    revalidatePath(`/animals/${animalId}/assessments`);
    revalidatePath(`/animals/${animalId}`);

    redirect(`/animals/${animalId}/assessments`);
  } catch (error) {
    console.error("Error creating assessment:", error);
    throw new Error("Failed to create assessment");
  }
}

// // Export the wrapped, protected server actions
// export const createAssessment = withAuthenticatedUser(
//   RequirePermission(Permissions.ANIMAL_UPDATE)(_createAssessment)
// );

// export const updateAnimalAssessment = RequirePermission(Permissions.ANIMAL_UPDATE)(
//   _updateAnimalAssessment
// );
