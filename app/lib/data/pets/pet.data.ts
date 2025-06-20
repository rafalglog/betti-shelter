import { prisma } from "@/app/lib/prisma";
import { ITEMS_PER_PAGE } from "@/app/lib/constants/constants";
import { PetListingStatus, Role, ApplicationStatus } from "@prisma/client";
import { FilteredPetsPayload, PetWithImagesPayload } from "../../types";
import {
  cuidSchema,
  searchQuerySchema,
} from "../../zod-schemas/common.schemas";
import { DashboardPetsFilterSchema } from "../../zod-schemas/pet.schemas";
import { RequirePermission } from "../../auth/protected-actions";
import { Permissions } from "@/app/lib/auth/permissions";

const _fetchPetCardData = async () => {
  try {
    // Run count queries in parallel for efficiency
    const [totalPets, adoptedPetsCount, pendingPetsCount, publishedPetsCount] =
      await Promise.all([
        prisma.pet.count(),
        prisma.pet.count({
          where: {
            adoptionApplications: {
              some: {
                status: ApplicationStatus.ADOPTED,
              },
            },
          },
        }),
        prisma.pet.count({
          where: {
            listingStatus: PetListingStatus.PENDING_ADOPTION,
          },
        }),
        prisma.pet.count({
          where: {
            listingStatus: PetListingStatus.PUBLISHED,
          },
        }),
      ]);

    // add a 4 seconds delay to simulate a slow network
    // await new Promise((resolve) => setTimeout(resolve, 4000));

    return {
      totalPets,
      adoptedPetsCount,
      pendingPetsCount,
      publishedPetsCount,
    };
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error fetching card data.", error);
    }
    throw new Error("Error fetching card data.");
  }
};

const _fetchPetsPages = async (query: string) => {
  const parsedQuery = searchQuerySchema.safeParse(query);
  if (!parsedQuery.success) {
    if (process.env.NODE_ENV !== "production") {
      console.error(
        "Zod validation error in fetchPetsPages:",
        parsedQuery.error.flatten()
      );
    }
    throw new Error(
      parsedQuery.error.errors[0]?.message || "Invalid query format."
    );
  }
  const validatedQuery = parsedQuery.data;

  // Get the total number of pets that contains the query
  try {
    const count = await prisma.pet.count({
      where: {
        name: {
          contains: validatedQuery,
          mode: "insensitive",
        },
      },
    });

    // Calculate the total number of pages
    const totalPages = Math.ceil(count / ITEMS_PER_PAGE);

    // return the total number of pages
    return totalPages;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error fetching pets pages.", error);
    }
    throw new Error("Error fetching pets pages.");
  }
};

const _fetchLatestPets = async () => {
  // Get the latest pets
  try {
    const latestPets = await prisma.pet.findMany({
      select: {
        id: true,
        name: true,
        birthDate: true,
        city: true,
        state: true,
        petImages: {
          select: {
            url: true,
          },
          take: 1,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    });

    // add a 4 seconds delay to simulate a slow network
    // await new Promise((resolve) => setTimeout(resolve, 4000));

    return latestPets;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error fetching latest pets.", error);
    }
    throw new Error("Error fetching latest pets.");
  }
};

// data for the pets table in the dashboard
const _fetchFilteredPets = async (
  queryInput: string,
  currentPageInput: number
): Promise<FilteredPetsPayload[]> => {
  // Parse the query and currentPage
  const validatedArgs = DashboardPetsFilterSchema.safeParse({
    query: queryInput,
    currentPage: currentPageInput,
  });
  if (!validatedArgs.success) {
    if (process.env.NODE_ENV !== "production") {
      console.error(
        "Zod validation error in fetchFilteredPets:",
        validatedArgs.error.flatten()
      );
    }
    throw new Error(
      validatedArgs.error.errors[0]?.message ||
        "Invalid arguments for fetching filtered pets."
    );
  }
  const { query, currentPage } = validatedArgs.data;

  // Calculate the number of records to skip based on the current page
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  try {
    const pets = await prisma.pet.findMany({
      where: {
        name: {
          contains: query,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        name: true,
        birthDate: true,
        city: true,
        state: true,
        listingStatus: true,
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
      orderBy: {
        // sort by createdAt in descending order
        createdAt: "desc",
      },
      take: ITEMS_PER_PAGE, // the number of records you want to fetch
      skip: offset, // the number of records to skip
    });

    // add a 4 seconds delay to simulate a slow network
    // await new Promise((resolve) => setTimeout(resolve, 10000));

    // return the pets
    return pets;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error fetching pets.", error);
    }
    throw new Error("Error fetching pets.");
  }
};

// Fetch a pet by its ID to show on the dashboard edit page
const _fetchPetById = async (
  id: string
): Promise<PetWithImagesPayload | null> => {
  // Validate the id
  const parsedId = cuidSchema.safeParse(id);
  if (!parsedId.success) {
    if (process.env.NODE_ENV !== "production") {
      console.error(
        "Zod validation error in fetchPetById:",
        parsedId.error.flatten()
      );
    }
    throw new Error(
      parsedId.error.errors[0]?.message || "Invalid Pet ID format."
    );
  }
  const validatedId = parsedId.data;

  // Get the pet by id
  try {
    const pet = await prisma.pet.findUnique({
      where: {
        id: validatedId,
      },
      include: {
        petImages: true,
      },
    });

    // return the pet
    return pet;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error fetching pets.", error);
    }
    throw new Error("Error fetching pet.");
  }
};

export const fetchPetCardData = RequirePermission(
  Permissions.PET_READ_ANALYTICS
)(_fetchPetCardData);
export const fetchLatestPets = RequirePermission(
  Permissions.PET_READ_ANALYTICS
)(_fetchLatestPets);

export const fetchPetsPages = RequirePermission(Permissions.PET_READ_DETAIL)(
  _fetchPetsPages
);
export const fetchFilteredPets = RequirePermission(
  Permissions.PET_READ_DETAIL
)(_fetchFilteredPets);
export const fetchPetById = RequirePermission(Permissions.PET_READ_DETAIL)(
  _fetchPetById
);
