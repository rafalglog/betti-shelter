import { prisma } from "@/app/lib/prisma";
import { ITEMS_PER_PAGE } from "@/app/lib/constants/constants";
import {
  AnimalListingStatus,
  Role,
  ApplicationStatus,
  Sex,
  Prisma,
} from "@prisma/client";
import {
  FilteredAnimalsPayload,
  AnimalByIDPayload,
  SpeciesPayload,
  ColorPayload,
  PartnerPayload,
} from "../../types";
import {
  cuidSchema,
  searchQuerySchema,
} from "../../zod-schemas/common.schemas";
import { DashboardPetsFilterSchema as DashboardAnimalFilterSchema } from "../../zod-schemas/pet.schemas";
import { RequirePermission } from "../../auth/protected-actions";
import { Permissions } from "@/app/lib/auth/permissions";

const _fetchAnimalCardData = async () => {
  try {
    // Run count queries in parallel for efficiency
    const [totalPets, adoptedPetsCount, pendingPetsCount, publishedPetsCount] =
      await Promise.all([
        prisma.animal.count(),
        prisma.animal.count({
          where: {
            adoptionApplications: {
              some: {
                status: ApplicationStatus.ADOPTED,
              },
            },
          },
        }),
        prisma.animal.count({
          where: {
            listingStatus: AnimalListingStatus.PENDING_ADOPTION,
          },
        }),
        prisma.animal.count({
          where: {
            listingStatus: AnimalListingStatus.PUBLISHED,
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

// const _fetchPetsPages = async (query: string) => {
//   const parsedQuery = searchQuerySchema.safeParse(query);
//   if (!parsedQuery.success) {
//     if (process.env.NODE_ENV !== "production") {
//       console.error(
//         "Zod validation error in fetchPetsPages:",
//         parsedQuery.error.flatten()
//       );
//     }
//     throw new Error(
//       parsedQuery.error.errors[0]?.message || "Invalid query format."
//     );
//   }
//   const validatedQuery = parsedQuery.data;

//   // Get the total number of pets that contains the query
//   try {
//     const count = await prisma.animal.count({
//       where: {
//         name: {
//           contains: validatedQuery,
//           mode: "insensitive",
//         },
//       },
//     });

//     // Calculate the total number of pages
//     const totalPages = Math.ceil(count / ITEMS_PER_PAGE);

//     // return the total number of pages
//     return totalPages;
//   } catch (error) {
//     if (process.env.NODE_ENV !== "production") {
//       console.error("Error fetching pets pages.", error);
//     }
//     throw new Error("Error fetching pets pages.");
//   }
// };

const _fetchLatestPets = async () => {
  // Get the latest pets
  try {
    const latestPets = await prisma.animal.findMany({
      select: {
        id: true,
        name: true,
        birthDate: true,
        city: true,
        state: true,
        animalImages: {
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

// data for the animals table in the dashboard
const _fetchFilteredAnimals = async (
  queryInput: string,
  currentPageInput: number,
  listingStatusInput: string | undefined,
  sexInput: string | undefined,
  pageSizeInput: number,
  sortInput: string | undefined
): Promise<{ animals: FilteredAnimalsPayload[]; totalPages: number }> => {
  // Parse the query and currentPage
  const validatedArgs = DashboardAnimalFilterSchema.safeParse({
    query: queryInput,
    currentPage: currentPageInput,
    listingStatus: listingStatusInput,
    sex: sexInput,
    pageSize: pageSizeInput,
    sort: sortInput,
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
  const { query, currentPage, listingStatus, sex, pageSize, sort } =
    validatedArgs.data;

  const orderBy: Prisma.AnimalOrderByWithRelationInput = (() => {
    if (!sort) return { createdAt: "desc" }; // Default sort
    const [id, dir] = sort.split(".");
    return { [id]: dir === "desc" ? "desc" : "asc" };
  })();

  // Calculate the number of records to skip based on the current page
  // Dynamically build the 'where' clause for Prisma
  const whereClause: Prisma.AnimalWhereInput = {
    name: { contains: query, mode: "insensitive" },
    ...(listingStatus && {
      listingStatus: { in: listingStatus.split(",") as AnimalListingStatus[] },
    }),
    ...(sex && { sex: { in: sex.split(",") as Sex[] } }),
  };

  try {
    const offset = (currentPage - 1) * pageSize;

    const [totalCount, animals] = await prisma.$transaction([
      prisma.animal.count({ where: whereClause }),
      prisma.animal.findMany({
        where: whereClause,
        select: {
          id: true,
          name: true,
          birthDate: true,
          city: true,
          state: true,
          listingStatus: true,
          sex: true,
          size: true,
          breeds: {
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
        orderBy: orderBy,
        take: pageSize,
        skip: offset,
      }),
    ]);

    const totalPages = Math.ceil(totalCount / pageSize);

    return { animals, totalPages };
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error fetching animals.", error);
    }
    throw new Error("Error fetching animals.");
  }
};

// Fetch a pet by its ID to show on the dashboard edit page
const _fetchAnimalById = async (
  id: string
): Promise<AnimalByIDPayload | null> => {
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
    const animal = await prisma.animal.findUnique({
      where: {
        id: validatedId,
      },
      include: {
        animalImages: true,
        breeds: {
          include: {
            species: true,
          },
        },
      },
    });

    // return the pet
    return animal;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error fetching animal.", error);
    }
    throw new Error("Error fetching animal.");
  }
};

const _fetchPartners = async (): Promise<PartnerPayload[]> => {
  try {
    const partners = await prisma.partner.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    });
    return partners;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error fetching partners.", error);
    }
    throw new Error("Error fetching partners.");
  }
};

export const fetchColors = async (): Promise<ColorPayload[]> => {
  try {
    const colors = await prisma.color.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    });
    return colors;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error fetching colors.", error);
    }
    throw new Error("Error fetching colors.");
  }
};

export const fetchSpecies = async (): Promise<SpeciesPayload[]> => {
  try {
    const species = await prisma.species.findMany({
      select: {
        id: true,
        name: true,
        breeds: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });
    return species;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error fetching species.", error);
    }
    throw new Error("Error fetching species.");
  }
};

export const fetchPartners = RequirePermission(Permissions.PARTNER_READ)(
  _fetchPartners
);

export const fetchPetCardData = RequirePermission(
  Permissions.ANIMAL_READ_ANALYTICS
)(_fetchAnimalCardData);
export const fetchLatestPets = RequirePermission(
  Permissions.ANIMAL_READ_ANALYTICS
)(_fetchLatestPets);

// export const fetchPetsPages = RequirePermission(Permissions.ANIMAL_READ_DETAIL)(
//   _fetchPetsPages
// );
export const fetchFilteredAnimals = RequirePermission(
  Permissions.ANIMAL_READ_DETAIL
)(_fetchFilteredAnimals);
export const fetchAnimalById = RequirePermission(Permissions.ANIMAL_READ_DETAIL)(
  _fetchAnimalById
);
