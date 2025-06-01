import { prisma } from "@/app/lib/prisma";
import { ITEMS_PER_PAGE } from "@/app/lib/constants";
import { auth } from "@/auth";
import { PetListingStatus } from "@prisma/client";
import { cuidSchema } from "../../zod-schemas/common.schemas";
import { PublishedPetsFilterSchema, PublishedPetsPageCountSchema } from "../../zod-schemas/pet.schemas";

/*
============ data for the public pages ============
*/

export const fetchFilteredPublishedPetsWithCategory = async (
  queryInput: string,
  currentPageInput: number,
  speciesNameInput?: string
) => {
  // Parse the query, currentPage, and speciesName
  const validatedArgs = PublishedPetsFilterSchema.safeParse({
    query: queryInput,
    currentPage: currentPageInput,
    speciesName: speciesNameInput,
  });
  if (!validatedArgs.success) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Validation error in fetchFilteredPublishedPetsWithCategory:", validatedArgs.error.flatten());
    }
    throw new Error("Invalid arguments for fetching pets.");
  }
  const { query, currentPage, speciesName } = validatedArgs.data;

  // page offset
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  // get the user id from the session
  const session = await auth();
  const userId = session?.user?.id;

  // fetch the pets
  try {
    const pets = await prisma.pet.findMany({
      where: {
        name: {
          contains: query,
          mode: "insensitive",
        },
        listingStatus: PetListingStatus.PUBLISHED,
        // if speciesName is provided, filter by species
        ...(speciesName && {
          species: {
            name: speciesName,
          },
        }),
      },
      select: {
        id: true,
        name: true,
        city: true,
        state: true,
        petImages: {
          select: {
            url: true,
          },
          take: 1,
        },
        // if userId is provided, check if the user liked the pet
        ...(userId && {
          likes: {
            select: {
              userId: true,
            },
            where: {
              userId: userId,
            },
            take: 1,
          },
        }),
      },
      orderBy: {
        createdAt: "desc",
      },
      take: ITEMS_PER_PAGE,
      skip: offset,
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

export const fetchPublishedPetsPagesWithCategory = async (
  queryInput: string,
  speciesNameInput?: string
) => {
  // Parse the query and speciesName
  const validatedArgs = PublishedPetsPageCountSchema.safeParse({
    query: queryInput,
    speciesName: speciesNameInput,
  });
  if (!validatedArgs.success) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Validation error in fetchPublishedPetsPagesWithCategory:", validatedArgs.error.flatten());
    }
    throw new Error("Invalid arguments for fetching pet pages.");
  }
  const { query, speciesName } = validatedArgs.data;

  // fetch the total number of pets based on the query
  try {
    const count = await prisma.pet.count({
      where: {
        name: {
          contains: query,
          mode: "insensitive",
        },
        listingStatus: PetListingStatus.PUBLISHED,
        // if speciesName is provided, filter by species
        ...(speciesName && {
          species: {
            name: speciesName,
          },
        }),
      },
    });

    // calculate the total number of pages
    const totalPages = Math.ceil(Number(count) / ITEMS_PER_PAGE);

    // return the total number of pages
    return totalPages;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error fetching pets pages.", error);
    }
    throw new Error("Error fetching pets pages.");
  }
};

export const fetchSpecies = async () => {
  try {
    const species = await prisma.species.findMany();
    return species;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error fetching species.", error);
    }
    throw new Error("Error fetching species.");
  }
};

export const fetchFrontPagePetById = async (id: string) => {
  // Validate the id at runtime
  const parsedId = cuidSchema.safeParse(id);
  if (!parsedId.success) {
    console.error(`Invalid Pet ID format for update: ${parsedId.error.flatten().formErrors.join(", ")}`);
    throw new Error("Invalid Pet ID format.");
  }
  const validatedId = parsedId.data;

  try {
    const pet = await prisma.pet.findUnique({
      where: {
        id: validatedId,
      },
      select: {
        name: true,
        city: true,
        state: true,
        age: true,
        weightKg: true,
        heightCm: true,
        species: {
          select: {
            name: true,
          },
        },
        description: true,
        petImages: true,
      },
    });

    // return the pet
    return pet;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error fetching pet.", error);
    }
    throw new Error("Error fetching pet.");
  }
};
