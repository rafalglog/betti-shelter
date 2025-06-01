import { prisma } from "@/app/lib/prisma";
import { ITEMS_PER_PAGE } from "@/app/lib/constants";
import { rolesWithPermission } from "@/app/lib/actions/auth.actions";
import { AdoptionStatus, Role } from "@prisma/client";
import { PetWithImagesPayload } from "../../types";
import { cuidSchema, searchQuerySchema } from "../../zod-schemas/common.schemas";
import { DashboardPetsFilterSchema } from "../../zod-schemas/pet.schemas";

export const fetchPetCardData = async () => {
  // Check if the user has permission
  const hasPermission = await rolesWithPermission([Role.ADMIN, Role.STAFF]);
  if (!hasPermission) {
    throw new Error("Access Denied");
  }

  try {
    const totalPets = await prisma.pet.count();

    // Define the specific status names you want to count
    const statusNamesToCount = ["Adopted", "Pending", "Available"];

    // Fetch counts for specific statuses in a single query
    const statusCountsData = await prisma.adoptionStatus.findMany({
      where: {
        name: {
          in: statusNamesToCount,
        },
      },
      select: {
        name: true,
        _count: {
          select: { Pet: true },
        },
      },
    });

    // Initialize counts
    let adoptedPetsCount = 0;
    let pendingPetsCount = 0;
    let availablePetsCount = 0;

    // Map the results
    for (const status of statusCountsData) {
      if (status.name === "Adopted" && status._count) {
        adoptedPetsCount = status._count.Pet;
      } else if (status.name === "Pending" && status._count) {
        pendingPetsCount = status._count.Pet;
      } else if (status.name === "Available" && status._count) {
        availablePetsCount = status._count.Pet;
      }
    }

    // add a 4 seconds delay to simulate a slow network
    // await new Promise((resolve) => setTimeout(resolve, 4000));

    return {
      totalPets,
      adoptedPetsCount,
      pendingPetsCount,
      availablePetsCount,
    };
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error fetching card data.", error);
    }
    throw new Error("Error fetching card data.");
  }
};

export const fetchPetsPages = async (query: string) => {
  // Check if the user has permission
  const hasPermission = await rolesWithPermission([Role.ADMIN, Role.STAFF]);
  if (!hasPermission) {
    throw new Error("Access Denied.");
  }

  // Parse the query
  const parsedQuery = searchQuerySchema.safeParse(query);
  if (!parsedQuery.success) {
    throw new Error(parsedQuery.error.errors[0]?.message || "Invalid query.");
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

export const fetchLatestPets = async () => {
  // Check if the user has permission
  const hasPermission = await rolesWithPermission([Role.ADMIN, Role.STAFF]);
  if (!hasPermission) {
    throw new Error("Access Denied.");
  }

  // Get the latest pets
  try {
    const latestPets = await prisma.pet.findMany({
      select: {
        id: true,
        name: true,
        age: true,
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
export const fetchFilteredPets = async (queryInput: string, currentPageInput: number) => {
  // Check if the user has permission
  const hasPermission = await rolesWithPermission([Role.ADMIN, Role.STAFF]);
  if (!hasPermission) {
    throw new Error("Access Denied.");
  }

  // Parse the query and currentPage
  const validatedArgs = DashboardPetsFilterSchema.safeParse({
    query: queryInput,
    currentPage: currentPageInput,
  });
  if (!validatedArgs.success) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Validation error in fetchFilteredPets:", validatedArgs.error.flatten());
    }
    throw new Error("Invalid arguments for fetching filtered pets.");
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
        age: true,
        city: true,
        state: true,
        adoptionStatus: {
          select: {
            name: true,
          },
        },
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
    // await new Promise((resolve) => setTimeout(resolve, 4000));

    // return the pets
    return pets;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error fetching pets.", error);
    }
    throw new Error("Error fetching pets.");
  }
};

export const fetchAdoptionStatusList = async (): Promise<AdoptionStatus[]> => {
  // Check if the user has permission
  const hasPermission = await rolesWithPermission([Role.ADMIN, Role.STAFF]);
  if (!hasPermission) {
    throw new Error("Access Denied.");
  }

  try {
    const adoptionStatusList = await prisma.adoptionStatus.findMany();

    // return the adoption status list
    return adoptionStatusList;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error fetching adoption status.", error);
    }
    throw new Error("Error fetching adoption status.");
  }
};

export const fetchPetById = async (
  id: string
): Promise<PetWithImagesPayload | null> => {
  // Check if the user has permission
  const hasPermission = await rolesWithPermission([Role.ADMIN, Role.STAFF]);
  if (!hasPermission) {
    throw new Error("Access Denied.");
  }

  // Validate the id at runtime
  const parsedId = cuidSchema.safeParse(id);
  if (!parsedId.success) {
    console.error(`Invalid Pet ID format for update: ${parsedId.error.flatten().formErrors.join(", ")}`);
    throw new Error("Invalid Pet ID format.");
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
