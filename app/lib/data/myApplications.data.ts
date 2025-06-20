import { ITEMS_PER_PAGE } from "../constants/constants";
import { prisma } from "../prisma";
import { cuidSchema, searchQuerySchema } from "../zod-schemas/common.schemas";
import {
  AdoptionApplicationPayload,
  FilteredMyApplicationPayload,
  PetForApplicationPayload,
} from "../types";
import { DashboardPetsFilterSchema } from "../zod-schemas/pet.schemas";
import { PetListingStatus } from "@prisma/client";
import { SessionUser, withAuthenticatedUser } from "../auth/protected-actions";

const _fetchMyApplicationPages = async (
  user: SessionUser,
  queryInput: string // Search query for pet names
): Promise<number> => {

  const userId = user.id;

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
        userId: userId, // Filter by the logged-in user's ID
        // Search by the name of the pet associated with the application
        pet: {
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

  const userId = user.id;

  // Parse the query and currentPage
  const validatedArgs = DashboardPetsFilterSchema.safeParse({
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
        userId: userId, // Filter by the logged-in user's ID
        // Search by the name of the pet associated with the application
        pet: {
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
        isPrimary: true,
        pet: {
          select: {
            name: true,
            species: {
              select: {
                name: true,
              },
            },
            petImages: {
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

  const userId = user.id;

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
        userId: userId,
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
    return myApplication;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error fetching Application.", error);
    }
    throw new Error("Error fetching application.");
  }
};

// Fetch the pet information the user is trying to adopt
const _getPetForApplication = async (
  user: SessionUser,
  petId: string // Pet ID
): Promise<PetForApplicationPayload | null> => {

  const userId = user.id;

  // Validate the petId
  const parsedId = cuidSchema.safeParse(petId);
  if (!parsedId.success) {
    if (process.env.NODE_ENV !== "production") {
      console.error(
        "Zod validation error in getPetForApplication:",
        parsedId.error.flatten()
      );
    }
    throw new Error(parsedId.error.errors[0]?.message || "Invalid pet ID format.");
  }
  const validatedPetId = parsedId.data;

  try {
    const pet = await prisma.pet.findFirst({
      where: {
        id: validatedPetId,
        listingStatus: PetListingStatus.PUBLISHED,
      },
      select: {
        id: true,
        name: true,
        breed: true,
        species: {
          select: {
            name: true,
          },
        },
        adoptionApplications: {
          where: {
            userId: userId,
          },
          select: {
            userId: true,
          },
        },
      },
    });
    return pet;
  } catch (error) {
    console.error("Error fetching pet for application:", error);
    throw new Error("Failed to fetch pet information for application.");
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
export const getPetForApplication = withAuthenticatedUser(
  _getPetForApplication
);