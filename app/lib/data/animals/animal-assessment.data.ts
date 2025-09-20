import { prisma } from "@/app/lib/prisma";
import { Prisma, AssessmentType, AssessmentOutcome } from "@prisma/client";
import z from "zod";
import {
  cuidSchema,
  currentPageSchema,
} from "../../zod-schemas/common.schemas";
import { Permissions } from "@/app/lib/auth/permissions";
import { RequirePermission } from "../../auth/protected-actions";

export type AssessmentTemplateWithFields = Prisma.AssessmentTemplateGetPayload<{
  include: {
    templateFields: {
      orderBy: { order: "asc" };
    };
  };
}>;

const ASSESSMENTS_PER_PAGE = 5;

// Renamed to indicate it's the internal, unprotected function
async function _getAssessmentTemplates(): Promise<
  AssessmentTemplateWithFields[]
> {
  try {
    const templates = await prisma.assessmentTemplate.findMany({
      include: {
        templateFields: {
          orderBy: { order: "asc" },
        },
      },
      orderBy: { name: "asc" },
    });
    return templates;
  } catch (error) {
    console.error("Error fetching assessment templates:", error);
    throw new Error("Could not fetch assessment templates from the database.");
  }
}

export type AnimalAssessmentPayload = Prisma.AssessmentGetPayload<{
  include: {
    fields: true;
    assessor: true;
    template: true;
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

// Renamed to indicate it's the internal, unprotected function
const _fetchFilteredAnimalAssessments = async (
  animalId: string,
  currentPageInput: number,
  typeInput: string | undefined,
  outcomeInput: string | undefined,
  sortInput: string | undefined,
  showDeletedInput: boolean = false
): Promise<{ assessments: AnimalAssessmentPayload[]; totalPages: number }> => {
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
        include: {
          fields: true,
          assessor: true,
          template: true,
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
};

// Renamed to indicate it's the internal, unprotected function
const _fetchAnimalAssessmentById = async (
  id: string
): Promise<AnimalAssessmentPayload | null> => {
  try {
    const assessment = await prisma.assessment.findUnique({
      where: { id },
      include: {
        fields: true,
        assessor: true,
        template: true,
      },
    });
    return assessment;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error(`Error fetching assessment with ID ${id}:`, error);
    }
    throw new Error(`Error fetching assessment with ID ${id}.`);
  }
};

export const fetchAnimalAssessmentById = RequirePermission(
  Permissions.ANIMAL_ASSESSMENT_READ_DETAIL
)(_fetchAnimalAssessmentById);

export const getAssessmentTemplates = RequirePermission(
  Permissions.ANIMAL_ASSESSMENT_READ_DETAIL
)(_getAssessmentTemplates);

export const fetchFilteredAnimalAssessments = RequirePermission(
  Permissions.ANIMAL_ASSESSMENT_READ_DETAIL
)(_fetchFilteredAnimalAssessments);