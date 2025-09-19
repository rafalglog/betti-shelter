import { prisma } from "@/app/lib/prisma";
import { Prisma } from "@prisma/client";
import { cuidSchema } from "../../zod-schemas/common.schemas";
import z from "zod";

export type AssessmentTemplateWithFields = Prisma.AssessmentTemplateGetPayload<{
  include: {
    templateFields: {
      orderBy: { order: 'asc' }
    }
  }
}>;

export async function getAssessmentTemplates(): Promise<AssessmentTemplateWithFields[]> {
  try {
    const templates = await prisma.assessmentTemplate.findMany({
      include: {
        templateFields: {
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { name: 'asc' }
    });
    
    return templates;
  } catch (error) {
    console.error('Error fetching assessment templates:', error);
    throw new Error("Could not fetch assessment templates from the database.")
  }
}

export type AnimalAssessmentPayload = Prisma.AssessmentGetPayload<{
  include: {
    fields: true;
    assessor: true;
    template: true;
  };
}>;

export async function getAnimalAssessments(
  animalId: string,
): Promise<AnimalAssessmentPayload[]> {
  try {
    const assessments = await prisma.assessment.findMany({
      where: { animalId },
      include: {
        fields: true,
        assessor: true,
        template: true
      },
      orderBy: { date: 'desc' }
    });
    
    return assessments;
  } catch (error) {
    console.error('Error fetching animal assessments:', error);
    return [];
  }
}





// /**
//  * Defines the shape of the assessment data returned from the database,
//  * including the related assessor (Person) and assessment fields.
//  */
// export type AssessmentPayload = Prisma.AssessmentGetPayload<{
//   include: {
//     assessor: true;
//     fields: true;
//   };
// }>;

// /**
//  * Fetches all assessments for a specific animal.
//  *
//  * @param animalId The CUID of the animal whose assessments are to be fetched.
//  * @returns A promise that resolves to an array of assessments with their related fields and assessor details.
//  * @throws An error if the provided animalId is not a valid CUID or if the database query fails.
//  */
// export const fetchAssessmentsByAnimalId = async (
//   animalId: string
// ): Promise<AssessmentPayload[]> => {
//   const validatedAnimalId = cuidSchema.parse(animalId);

//   try {
//     const assessments = await prisma.assessment.findMany({
//       where: {
//         animalId: validatedAnimalId,
//       },
//       include: {
//         assessor: true, // Include the person who performed the assessment.
//         fields: true,   // Include all the individual fields/questions within each assessment.
//       },
//     });
//     return assessments;
//   } catch (error) {
//     console.error("Failed to fetch assessments:", error);
//     throw new Error("An error occurred while fetching animal assessments.");
//   }
// };

// const suggestedTaskSchema = z.object({
//   text: z.string(),
//   team: z.string(),
// });

// // Zod schema for the entire suggestionRules object
// const suggestionRulesSchema = z.record(suggestedTaskSchema);

// // Type for the suggestion rules, inferred directly from the Zod schema
// type SuggestionRules = z.infer<typeof suggestionRulesSchema>;

// // Interfaces for the final formatted output
// interface FormattedTemplateField {
//   name: string;
//   options: string[];
//   placeholder?: string;
//   redFlags: string[];
// }

// interface FormattedTemplate {
//   fields: FormattedTemplateField[];
//   suggestedTasks: SuggestionRules;
// }

// export type FormattedTemplates = Record<string, FormattedTemplate>;

// export const fetchAssessmentTemplates = async (): Promise<FormattedTemplates> => {
//   try {
//     const templatesFromDb = await prisma.assessmentTemplate.findMany({
//       include: {
//         templateFields: {
//           orderBy: { order: "asc" },
//         },
//       },
//     });

//     if (!templatesFromDb) {
//       return {};
//     }

//     return templatesFromDb.reduce(
//       (accumulator: FormattedTemplates, template) => {
//         const suggestedTasks: SuggestionRules = {};

//         const fields: FormattedTemplateField[] = template.templateFields.map((field) => {
//           let redFlags: string[] = [];
          
//           const validationResult = suggestionRulesSchema.safeParse(field.suggestionRules);

//           if (validationResult.success) {
//             Object.assign(suggestedTasks, validationResult.data);
//             redFlags = Object.keys(validationResult.data);
//           } else if (field.suggestionRules) {
//             console.warn(
//               `Invalid suggestionRules format for template field: ${field.label}`,
//               validationResult.error
//             );
//           }
 
//           return {
//             name: field.label,
//             options: field.options,
//             placeholder: field.placeholder || undefined,
//             redFlags,
//           };
//         });

//         // This line converts a name like "Intake Behavioral" 
//         // into the key "INTAKE_BEHAVIORAL" that the frontend expects.
//         const key = template.name.toUpperCase().replace(/ /g, "_");

//         accumulator[key] = {
//           fields,
//           suggestedTasks,
//         };
//         return accumulator;
//       },
//       {} as FormattedTemplates
//     );
//   } catch (error) {
//     console.error("Error fetching assessment templates:", error);
//     throw new Error("Could not fetch assessment templates from the database.");
//   }
// };