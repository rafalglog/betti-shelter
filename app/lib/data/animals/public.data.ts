import { prisma } from "@/app/lib/prisma";
import { ITEMS_PER_PAGE } from "@/app/lib/constants/constants";
import { auth } from "@/auth";
import { AnimalListingStatus, Prisma } from "@prisma/client";
import { cuidSchema } from "../../zod-schemas/common.schemas";
import { PublishedPetsFilterSchema } from "../../zod-schemas/animal.schemas";

export type FilteredPetsPayload = Prisma.AnimalGetPayload<{
  select: {
    id: true;
    name: true;
    city: true;
    state: true;
    birthDate: true;
    listingStatus: true;
    animalImages: {
      select: {
        url: true;
      };
      take: 1;
    };
    likes: {
      select: {
        userId: true;
      };
      take: 1;
    };
  };
}>;

// The new, combined function
export const fetchFilteredPublishedPets = async (
  queryInput: string,
  currentPageInput: number,
  speciesNameInput?: string
): Promise<{ pets: FilteredPetsPayload[]; totalPages: number }> => {
  const validatedArgs = PublishedPetsFilterSchema.safeParse({
    query: queryInput,
    currentPage: currentPageInput,
    speciesName: speciesNameInput,
  });

  if (!validatedArgs.success) {
    if (process.env.NODE_ENV !== "production") {
      console.error(
        "Validation error in fetchFilteredPublishedPets:",
        validatedArgs.error.flatten()
      );
    }
    throw new Error("Invalid arguments for fetching pets.");
  }
  const { query, currentPage, speciesName } = validatedArgs.data;

  const session = await auth();
  const personId = session?.user?.personId;

  const whereClause: Prisma.AnimalWhereInput = {
    name: {
      contains: query,
      mode: "insensitive",
    },
    listingStatus: {
      in: [AnimalListingStatus.PUBLISHED, AnimalListingStatus.PENDING_ADOPTION],
    },
    ...(speciesName && {
      species: {
        name: speciesName,
      },
    }),
  };

  try {
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;
    const [totalCount, pets] = await prisma.$transaction([
      prisma.animal.count({ where: whereClause }),
      prisma.animal.findMany({
        where: whereClause,
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
          ...(personId && {
            likes: {
              select: {
                userId: true,
              },
              where: {
                userId: personId,
              },
              take: 1,
            },
          }),
          listingStatus: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: ITEMS_PER_PAGE,
        skip: offset,
      }),
    ]);

    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
    return { pets, totalPages };
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error fetching pets.", error);
    }
    throw new Error("Error fetching pets.");
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
  const personId = session?.user?.personId; 

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
        birthDate: true, 
        weightKg: true, 
        heightCm: true, 
        species: {
          select: {
            name: true,
          },
        },
        description: true, 
        animalImages: true, 
        // Conditionally include likes if userId is available
        ...(personId && {
          likes: {
            where: {
              userId: personId,
            },
            select: {
              id: true,
            },
            take: 1,
          },
        }),
        // Conditionally include adoption application status if userId is available
        ...(personId && {
          adoptionApplications: {
            where: {
              userId: personId,
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
  const personId = session?.user?.personId;

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
        ...(personId && {
          likes: {
            select: {
              userId: true,
            },
            where: {
              userId: personId,
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