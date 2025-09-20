import { prisma } from "@/app/lib/prisma";
import { Prisma, AssessmentType, AssessmentOutcome } from "@prisma/client";
import z from "zod";
import {
  cuidSchema,
  currentPageSchema,
} from "../../zod-schemas/common.schemas";

export type AssessmentTemplateWithFields = Prisma.AssessmentTemplateGetPayload<{
  include: {
    templateFields: {
      orderBy: { order: 'asc' }
    }
  }
}>;

const ASSESSMENTS_PER_PAGE = 5;

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
  select: {
    id: true;
    date: true;
    overallOutcome: true;
    summary: true;
    deletedAt: true;
    fields: {
      select: {
        id: true;
        fieldName: true;
        fieldValue: true;
        notes: true;
      };
    };
    assessor: {
      select: {
        name: true;
      };
    };
    template: {
      select: {
        type: true;
      };
    };
  };
}>;

export const DashboardAssessmentsFilterSchema = z.object({
  currentPage: currentPageSchema,
  animalId: cuidSchema,
  type: z.string().optional(),
  outcome: z.string().optional(),
  sort: z.string().optional(),
  showDeleted: z.boolean().optional(),
});

export async function fetchFilteredAnimalAssessments(
  animalId: string,
  currentPageInput: number,
  typeInput: string | undefined,
  outcomeInput: string | undefined,
  sortInput: string | undefined,
  showDeletedInput: boolean = false
): Promise<{ assessments: AnimalAssessmentPayload[]; totalPages: number }> {
  // Validate and parse inputs
  const validatedArgs = DashboardAssessmentsFilterSchema.safeParse({
    currentPage: currentPageInput,
    animalId: animalId,
    type: typeInput,
    outcome: outcomeInput,
    sort: sortInput,
    showDeleted: showDeletedInput,
  });

  if (!validatedArgs.success) {
    if (process.env.NODE_ENV !== "production") {
      console.error(
        "Zod validation error in fetchFilteredAnimalAssessments:",
        validatedArgs.error.flatten()
      );
    }
    throw new Error("Invalid arguments for fetching filtered assessments.");
  }

  const { currentPage, type, outcome, sort, showDeleted } = validatedArgs.data;

  // Determine the sorting order, defaulting to newest first
  const orderBy: Prisma.AssessmentOrderByWithRelationInput = (() => {
    if (!sort) return { date: "desc" };
    const [id, dir] = sort.split(".");
    return { [id]: dir === "desc" ? "desc" : "asc" };
  })();

  // Construct the 'where' clause based on filters
  const whereClause: Prisma.AssessmentWhereInput = {
    animalId: animalId,
    ...(type && {
      template: {
        type: { in: type.split(",") as AssessmentType[] },
      },
    }),
    ...(outcome && {
      overallOutcome: { in: outcome.split(",") as AssessmentOutcome[] },
    }),
    ...(showDeleted ? {} : { deletedAt: null }),
  };

  try {
    const offset = (currentPage - 1) * ASSESSMENTS_PER_PAGE;

    const [totalCount, assessments] = await prisma.$transaction([
      prisma.assessment.count({ where: whereClause }),
      prisma.assessment.findMany({
        where: whereClause,
        select: {
          id: true,
          date: true,
          overallOutcome: true,
          summary: true,
          deletedAt: true,
          fields: {
            select: {
              id: true,
              fieldName: true,
              fieldValue: true,
              notes: true,
            },
          },
          assessor: { select: { name: true } },
          template: { select: { type: true } },
        },
        orderBy: orderBy,
        take: ASSESSMENTS_PER_PAGE,
        skip: offset,
      }),
    ]);

    const totalPages = Math.ceil(totalCount / ASSESSMENTS_PER_PAGE);
    return { assessments, totalPages };
  } catch (error) {
    console.error("Error fetching animal assessments:", error);
    throw new Error("Error fetching animal assessments.");
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