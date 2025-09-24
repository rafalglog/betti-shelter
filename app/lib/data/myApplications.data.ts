import { ITEMS_PER_PAGE } from "../constants/constants";
import { prisma } from "../prisma";
import { cuidSchema, searchQuerySchema } from "../zod-schemas/common.schemas";
import {
  AdoptionApplicationPayload,
  FilteredMyApplicationPayload,
  AnimalForApplicationPayload,
} from "../types";
import { DashboardAnimalsFilterSchema } from "../zod-schemas/animal.schemas";
import { AnimalListingStatus } from "@prisma/client";
import { SessionUser, withAuthenticatedUser } from "../auth/protected-actions";

const _fetchMyApplicationPages = async (
  user: SessionUser,
  queryInput: string // Search query for animal names
): Promise<number> => {
  const personId = user.personId;

  // Parse the query
  const parsedQuery = searchQuerySchema.safeParse(queryInput);
  if (!parsedQuery.success) {
    if (process.env.NODE_ENV !== "production") {
      console.error(
        "Zod validation error in fetchMyApplicationPages:",
        parsedQuery.error.flatten()
      );
    }
    throw new Error(parsedQuery.error.errors[0]?.message || "Invalid query format.");
  }
  const validatedQuery = parsedQuery.data;

  // Get the total number of adoption applications that match the query
  try {
    const count = await prisma.adoptionApplication.count({
      where: {
        userId: personId, // Filter by the logged-in user's ID
        // Search by the name of the animal associated with the application
        animal: {
          name: {
            contains: validatedQuery,
            mode: "insensitive",
          },
        },
      },
    });

    // Calculate the total number of pages
    const totalPages = Math.ceil(count / ITEMS_PER_PAGE);

    // Return the total number of pages
    return totalPages;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error fetching count of user's application pages:", error);
    }
    throw new Error("Failed to fetch count of user's application pages.");
  }
};

const _fetchFilteredMyApplications = async (
  user: SessionUser,
  queryInput: string,
  currentPageInput: number
): Promise<FilteredMyApplicationPayload[]> => {
  const personId = user.personId;

  // Parse the query and currentPage
  const validatedArgs = DashboardAnimalsFilterSchema.safeParse({
    query: queryInput,
    currentPage: currentPageInput,
  });

  if (!validatedArgs.success) {
    if (process.env.NODE_ENV !== "production") {
      console.error(
        "Zod validation error in fetchFilteredMyApplications:",
        validatedArgs.error.flatten()
      );
    }
    throw new Error(validatedArgs.error.errors[0]?.message || "Invalid arguments for fetching filtered applications.");
  }
  const { query, currentPage } = validatedArgs.data;

  // Calculate the number of records to skip based on the current page
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const myApplications = await prisma.adoptionApplication.findMany({
      where: {
        userId: personId, // Filter by the logged-in user's ID
        // Search by the name of the animal associated with the application
        animal: {
          name: {
            contains: query,
            mode: "insensitive",
          },
        },
      },
      select: {
        id: true,
        status: true,
        submittedAt: true,
        animal: {
          select: {
            name: true,
            species: {
              select: {
                name: true,
              },
            },
            animalImages: {
              select: {
                url: true,
              },
              take: 1,
            },
          },
        },
      },
      orderBy: {
        submittedAt: "desc",
      },
      take: ITEMS_PER_PAGE,
      skip: offset,
    });

    // Return the filtered applications
    return myApplications;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error fetching applications.", error);
    }
    throw new Error("Error fetching applications.");
  }
};

const _fetchMyAppById = async (
  user: SessionUser,
  adoptionAppId: string // Adoption Application id from route params
): Promise<AdoptionApplicationPayload | null> => {
  const personId = user.personId;

  // Validate the adoptionAppId at runtime
  const parsedAdoptionAppId = cuidSchema.safeParse(adoptionAppId);

  if (!parsedAdoptionAppId.success) {
    if (process.env.NODE_ENV !== "production") {
      console.error( // Consistent console error message
        "Zod validation error in fetchMyAppById:",
        parsedAdoptionAppId.error.flatten()
      );
    }
    throw new Error(parsedAdoptionAppId.error.errors[0]?.message || "Invalid Application ID format.");
  }
  const validatedAdoptionAppId = parsedAdoptionAppId.data;

  // Get the application by id, ensuring it belongs to the logged-in user
  try {
    const myApplication = await prisma.adoptionApplication.findFirst({
      where: {
        id: validatedAdoptionAppId,
        userId: personId,
      },
      include: {
        animal: {
          select: {
            id: true,
            name: true,
            breeds: {
              select: {
                name: true,
              },
            },
            species: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    return myApplication;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error fetching Application.", error);
    }
    throw new Error("Error fetching application.");
  }
};

// Fetch the animal information the user is trying to adopt
const _getAnimalForApplication = async (
  user: SessionUser,
  animalId: string // Animal ID
): Promise<AnimalForApplicationPayload | null> => {
  const personId = user.personId;

  // Validate the animalId
  const parsedId = cuidSchema.safeParse(animalId);

  if (!parsedId.success) {
    if (process.env.NODE_ENV !== "production") {
      console.error(
        "Zod validation error in getAnimalForApplication:",
        parsedId.error.flatten()
      );
    }
    throw new Error(parsedId.error.errors[0]?.message || "Invalid animal ID format.");
  }
  const validatedAnimalId = parsedId.data;

  try {
    const animal = await prisma.animal.findFirst({
      where: {
        id: validatedAnimalId,
        listingStatus: AnimalListingStatus.PUBLISHED,
      },
      select: {
        id: true,
        name: true,
        breeds: {
          select: {
            name: true,
          },
        },
        species: {
          select: {
            name: true,
          },
        },
        adoptionApplications: {
          where: {
            userId: personId,
          },
          select: {
            userId: true,
          },
        },
      },
    });

    return animal;
  } catch (error) {
    console.error("Error fetching animal for application:", error);
    throw new Error("Failed to fetch animal information for application.");
  }
};

// Export the functions wrapped with the authenticated user HOF
export const fetchMyApplicationPages = withAuthenticatedUser(
  _fetchMyApplicationPages
);
export const fetchFilteredMyApplications = withAuthenticatedUser(
  _fetchFilteredMyApplications
);
export const fetchMyAppById = withAuthenticatedUser(_fetchMyAppById);
export const getAnimalForApplication = withAuthenticatedUser(
  _getAnimalForApplication
);