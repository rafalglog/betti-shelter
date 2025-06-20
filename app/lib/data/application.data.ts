import { cuidSchema, searchQuerySchema } from "../zod-schemas/common.schemas";
import { prisma } from "../prisma";
import { ITEMS_PER_PAGE } from "../constants/constants";
import { DashboardPetsFilterSchema } from "../zod-schemas/pet.schemas";
import {
  AdoptionApplicationPayload,
  FilteredApplicationsPayload,
} from "../types";
import { RequirePermission } from "../auth/protected-actions";
import { Permissions } from "@/app/lib/auth/permissions";

const _fetchApplicationPages = async (queryInput: string): Promise<number> => {
  // Parse the query
  const parsedQuery = searchQuerySchema.safeParse(queryInput);
  if (!parsedQuery.success) {
    if (process.env.NODE_ENV !== "production") {
      console.error(
        "Zod validation error in fetchApplicationPages:",
        parsedQuery.error.flatten()
      );
    }
    throw new Error(
      parsedQuery.error.errors[0]?.message || "Invalid query format."
    );
  }
  const validatedQuery = parsedQuery.data;

  // Get the total number of adoption applications that match the query
  try {
    const count = await prisma.adoptionApplication.count({
      where: {
        applicantName: {
          contains: validatedQuery,
          mode: "insensitive",
        },
      },
    });

    // Calculate the total number of pages
    const totalPages = Math.ceil(count / ITEMS_PER_PAGE);

    return totalPages;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error fetching application pages.", error);
    }
    throw new Error("Error fetching application pages.");
  }
};

const _fetchFilteredApplications = async (
  queryInput: string,
  currentPageInput: number
): Promise<FilteredApplicationsPayload[]> => {
  // Parse the query and currentPage
  const validatedArgs = DashboardPetsFilterSchema.safeParse({
    query: queryInput,
    currentPage: currentPageInput,
  });
  if (!validatedArgs.success) {
    if (process.env.NODE_ENV !== "production") {
      console.error(
        "Zod validation error in fetchFilteredApplications:",
        validatedArgs.error.flatten()
      );
    }
    throw new Error(
      validatedArgs.error.errors[0]?.message ||
        "Invalid arguments for fetching filtered applications."
    );
  }

  const { query, currentPage } = validatedArgs.data;

  // Calculate the number of records to skip based on the current page
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const applications = await prisma.adoptionApplication.findMany({
      where: {
        OR: [
          {
            applicantName: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            pet: {
              name: {
                contains: query,
                mode: "insensitive",
              },
            },
          },
        ],
      },
      select: {
        id: true,
        applicantName: true,
        applicantEmail: true,
        applicantPhone: true,
        applicantCity: true,
        applicantState: true,
        status: true,
        submittedAt: true,
        isPrimary: true,
        pet: {
          select: {
            name: true,
            species: {
              select: {
                name: true,
              },
            },
          },
        },
        user: {
          select: {
            image: true,
          },
        },
      },
      orderBy: {
        submittedAt: "desc",
      },
      take: ITEMS_PER_PAGE,
      skip: offset,
    });

    return applications;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error fetching applications.", error);
    }
    throw new Error("Error fetching applications.");
  }
};

const _fetchApplicationById = async (
  id: string
): Promise<AdoptionApplicationPayload | null> => {
  // Validate the id
  const parsedId = cuidSchema.safeParse(id);
  if (!parsedId.success) {
    if (process.env.NODE_ENV !== "production") {
      console.error(
        "Zod validation error in fetchApplicationById:",
        parsedId.error.flatten()
      );
    }
    throw new Error(
      parsedId.error.errors[0]?.message || "Invalid Application ID format."
    );
  }
  const validatedId = parsedId.data;

  // Get the application by id
  try {
    const application = await prisma.adoptionApplication.findUnique({
      where: {
        id: validatedId,
      },
      include: {
        pet: {
          select: {
            id: true,
            name: true,
            breed: true,
            species: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    return application;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error fetching application.", error);
    }
    throw new Error("Error fetching application.");
  }
};

export const fetchApplicationPages = RequirePermission(
  Permissions.APPLICATIONS_READ_LISTING
)(_fetchApplicationPages);
export const fetchFilteredApplications = RequirePermission(
  Permissions.APPLICATIONS_READ_LISTING
)(_fetchFilteredApplications);
export const fetchApplicationById = RequirePermission(
  Permissions.APPLICATIONS_READ_LISTING
)(_fetchApplicationById);
