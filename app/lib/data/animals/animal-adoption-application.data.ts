import { Permissions } from "@/app/lib/auth/permissions";
import { ApplicationStatus, Prisma } from "@prisma/client";
import { prisma } from "../../prisma";
import { RequirePermission } from "../../auth/protected-actions";
import {
  cuidSchema,
  currentPageSchema,
  searchQuerySchema,
} from "../../zod-schemas/common.schemas";
import z from "zod";
import { ApplicationWithAnimal } from "../user-application.data";
import { ITEMS_PER_PAGE } from "../../constants/constants";

export const fetchAnimalApplicationsSchema = z.object({
  animalId: cuidSchema,
  query: searchQuerySchema,
  currentPage: currentPageSchema,
  sort: z.string().optional(),
  status: z.string().optional(),
});

const _fetchAnimalApplications = async (
  animalIdInput: string,
  queryInput: string,
  currentPageInput: number,
  sortInput: string | undefined,
  statusInput: string | undefined
): Promise<{
  applications: ApplicationWithAnimal[];
  totalPages: number;
}> => {
  const validatedArgs = fetchAnimalApplicationsSchema.safeParse({
    animalId: animalIdInput,
    query: queryInput,
    currentPage: currentPageInput,
    sort: sortInput,
    status: statusInput,
  });

  if (!validatedArgs.success) {
    throw new Error("Invalid input provided.");
  }

  const { animalId, query, currentPage, sort, status } = validatedArgs.data;
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  const orderBy: Prisma.AdoptionApplicationOrderByWithRelationInput = (() => {
    if (!sort) return { submittedAt: "desc" };
    const [field, direction] = sort.split(".");
    const dir = direction === "asc" ? "asc" : "desc";

    switch (field) {
      case "applicantName":
        return { applicantName: dir };
      case "status":
        return { status: dir };
      case "submittedAt":
        return { submittedAt: dir };
      default:
        return { submittedAt: "desc" };
    }
  })();

  const whereClause: Prisma.AdoptionApplicationWhereInput = {
    animalId: animalId,
    ...(query && {
      applicantName: {
        contains: query,
        mode: "insensitive",
      },
    }),
  };

  if (status) {
    const statuses = status.split(",") as ApplicationStatus[];
    if (statuses.length > 1) {
      whereClause.status = { in: statuses };
    } else if (statuses.length === 1) {
      whereClause.status = statuses[0];
    }
  }

  try {
    const [applications, count] = await prisma.$transaction([
      prisma.adoptionApplication.findMany({
        where: whereClause,
        select: {
          id: true,
          applicantName: true,
          applicantEmail: true,
          applicantPhone: true,
          applicantCity: true,
          applicantState: true,
          status: true,
          submittedAt: true,
          animal: {
            select: {
              id: true,
              name: true,
              species: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        orderBy: orderBy,
        take: ITEMS_PER_PAGE,
        skip: offset,
      }),
      prisma.adoptionApplication.count({
        where: whereClause,
      }),
    ]);

    const totalPages = Math.ceil(count / ITEMS_PER_PAGE);

    return { applications, totalPages };
  } catch (error) {
    console.error("Error fetching animal applications.", error);
    throw new Error("Error fetching animal applications.");
  }
};

export const fetchAnimalApplications = RequirePermission(
  Permissions.APPLICATIONS_READ_DETAIL
)(_fetchAnimalApplications);