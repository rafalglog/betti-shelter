import { prisma } from "@/app/lib/prisma";
import { Prisma } from "@prisma/client";
import { cuidSchema } from "../../zod-schemas/common.schemas";

// Define the expected return type for better type safety in your components.
export type CharacteristicWithAssignment = Prisma.CharacteristicGetPayload<{}> & {
  isAssigned: boolean;
};

export const fetchAnimalCharacteristics = async (
  animalId: string
): Promise<CharacteristicWithAssignment[]> => {
  // Validate the input to ensure it's a valid CUID.
  const validation = cuidSchema.safeParse(animalId);
  if (!validation.success) {
    console.error("Invalid animalId format:", validation.error);
    throw new Error("Invalid animalId format. Expected a valid CUID.");
  }

  try {
    // Use a transaction to perform both reads in a single database round-trip.
    const [allCharacteristics, animal] = await prisma.$transaction([
      // 1. Get every characteristic available in the system.
      prisma.characteristic.findMany({
        where: { deletedAt: null },
        orderBy: [{ category: "asc" }, { name: "asc" }],
      }),
      // 2. Get the specific animal and its associated characteristic IDs.
      prisma.animal.findUnique({
        where: { id: animalId },
        select: {
          characteristics: {
            select: {
              id: true, // Only fetch the ID for efficiency.
            },
          },
        },
      }),
    ]);

    // Handle the case where the animal ID does not exist.
    if (!animal) {
      throw new Error(`Animal with ID ${animalId} not found.`);
    }

    // Create a Set of the animal's characteristic IDs for efficient O(1) lookups.
    const assignedCharIds = new Set(animal.characteristics.map((c) => c.id));

    // 3. Map over the complete list, adding the `isAssigned` flag.
    const result = allCharacteristics.map((characteristic) => ({
      ...characteristic,
      isAssigned: assignedCharIds.has(characteristic.id),
    }));

    return result;
  } catch (error) {
    console.error("Failed to fetch animal characteristics:", error);
    // Depending on your error handling strategy, you might throw the error
    // or return a value indicating failure.
    throw new Error("Could not fetch animal characteristics.");
  }
};