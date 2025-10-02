import { prisma } from "@/app/lib/prisma";
import {
  AnimalListingStatus,
  Sex,
  Prisma,
} from "@prisma/client";
import {
  AnimalsPayload,
  SpeciesPayload,
  ColorPayload,
  PartnerPayload,
  AnimalWithDetailsPayload,
} from "../../types";
import { cuidSchema } from "../../zod-schemas/common.schemas";
import { DashboardAnimalsFilterSchema as DashboardAnimalFilterSchema } from "../../zod-schemas/animal.schemas";
import { RequirePermission } from "../../auth/protected-actions";
import { Permissions } from "@/app/lib/auth/permissions";

// data for the animals table in the dashboard
const _fetchFilteredAnimals = async (
  queryInput: string,
  currentPageInput: number,
  listingStatusInput: string | undefined,
  sexInput: string | undefined,
  pageSizeInput: number,
  sortInput: string | undefined
): Promise<{ animals: AnimalsPayload[]; totalPages: number }> => {
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

const _fetchAnimalById = async (
  id: string
): Promise<AnimalWithDetailsPayload | null> => {
  // Validate the incoming animal ID
  const parsedId = cuidSchema.safeParse(id);

  if (!parsedId.success) {
    console.error("Invalid CUID format in _fetchAnimalById:", parsedId.error);
    // Return null for an invalid ID format to prevent crashes
    return null;
  }

  const validatedAnimalId = parsedId.data;

  try {
    // Fetch the animal record from the database
    const animal = await prisma.animal.findUnique({
      where: { id: validatedAnimalId },
      // Include related data required by the AnimalForm in edit mode
      include: {
        species: true,
        breeds: true,
        colors: true,
      },
    });

    return animal;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error fetching animal by ID.", error);
    }
    // Propagate the error to be handled by the calling component
    throw new Error("Error fetching animal details.");
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

export const fetchFilteredAnimals = RequirePermission(
  Permissions.ANIMAL_READ_DETAIL
)(_fetchFilteredAnimals);

export const fetchAnimalById = RequirePermission(
  Permissions.ANIMAL_READ_DETAIL
)(_fetchAnimalById);
