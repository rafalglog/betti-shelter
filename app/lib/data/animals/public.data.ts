import { prisma } from "@/app/lib/prisma";
import { ITEMS_PER_PAGE } from "@/app/lib/constants/constants";
import { auth } from "@/auth";
import { AnimalListingStatus } from "@prisma/client";
import { cuidSchema } from "../../zod-schemas/common.schemas";
import { PublishedPetsFilterSchema, PublishedPetsPageCountSchema } from "../../zod-schemas/pet.schemas";

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
    const pets = await prisma.animal.findMany({
      where: {
        name: {
          contains: query,
          mode: "insensitive",
        },
        listingStatus: {
          in: [AnimalListingStatus.PUBLISHED, AnimalListingStatus.PENDING_ADOPTION],
        },
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
        birthDate: true,
        animalImages: {
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
          listingStatus: true,
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
    const count = await prisma.animal.count({
      where: {
        name: {
          contains: query,
          mode: "insensitive",
        },
        listingStatus: AnimalListingStatus.PUBLISHED,
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

export const fetchPublicPagePetById = async (id: string) => {
  // Validate the id at runtime
  const parsedId = cuidSchema.safeParse(id);
  if (!parsedId.success) { 
    console.error(`Invalid Pet ID format for update: ${parsedId.error.flatten().formErrors.join(", ")}`); 
    throw new Error("Invalid Pet ID format."); 
  }
  // Pet ID is valid, extract the data
  const validatedId = parsedId.data;

  const session = await auth(); 
  const userId = session?.user?.id; 

  try {
    const pet = await prisma.animal.findUnique({
      where: {
        id: validatedId,
        // Update the where clause to include both PUBLISHED and PENDING_ADOPTION
        listingStatus: {
          in: [AnimalListingStatus.PUBLISHED, AnimalListingStatus.PENDING_ADOPTION],
        },
      },
      select: {
        id: true,
        name: true,
        listingStatus: true,
        city: true,
        state: true,
        // breed: true, 
        birthDate: true, 
        weightKg: true, 
        heightCm: true, 
        // species: {
        //   select: {
        //     name: true,
        //   },
        // },
        description: true, 
        animalImages: true, 
        // Conditionally include likes if userId is available
        ...(userId && {
          likes: {
            where: {
              userId: userId,
            },
            select: {
              id: true,
            },
            take: 1,
          },
        }),
        // Conditionally include adoption application status if userId is available
        ...(userId && {
          adoptionApplications: {
            where: {
              userId: userId,
            },
            select: {
              id: true, 
              userId: true, 
              status: true, 
            },
            take: 1,
          },
        }),
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

export const fetchLatestPublicAnimals = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  // use prisma to get the latest pets
  try {
    const latestPets = await prisma.animal.findMany({
      where: {
        listingStatus: AnimalListingStatus.PUBLISHED,
      },
      select: {
        id: true,
        name: true,
        // breed: true,
        birthDate: true,
        city: true,
        state: true,
        animalImages: {
          select: {
            url: true,
          },
          take: 1,
        },
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
          listingStatus: true,
        }),
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 4,
    });
    // simulate delay 
    // await new Promise((resolve) => setTimeout(resolve, 10000));

    // return the latest pets
    return latestPets;
  } catch (error) {
    throw new Error("Error fetching latest pets.");
  }
}