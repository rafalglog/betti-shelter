import { prisma } from "@/app/lib/prisma";
import { Prisma } from "@prisma/client";
import { cuidSchema } from "../../zod-schemas/common.schemas";
import { RequirePermission } from "../../auth/protected-actions";
import { Permissions } from "@/app/lib/auth/permissions";

export type CharacteristicWithAssignment = Prisma.CharacteristicGetPayload<{}> & {
  isAssigned: boolean;
};

const _fetchAnimalCharacteristics = async (
  animalId: string
): Promise<CharacteristicWithAssignment[]> => {

  const validation = cuidSchema.safeParse(animalId);
  if (!validation.success) {
    console.error("Invalid animalId format:", validation.error);
    throw new Error("Invalid animalId format. Expected a valid CUID.");
  }

  try {
    // Use a transaction to perform both reads in a single database round-trip.
    const [allCharacteristics, animal] = await prisma.$transaction([
      prisma.characteristic.findMany({
        where: { deletedAt: null },
        orderBy: [{ category: "asc" }, { name: "asc" }],
      }),
      prisma.animal.findUnique({
        where: { id: animalId },
        select: {
          characteristics: {
            select: {
              id: true,
            },
          },
        },
      }),
    ]);

    // Handle the case where the animal ID does not exist.
    if (!animal) {
      throw new Error(`Animal with ID ${animalId} not found.`);
    }

    const assignedCharIds = new Set(animal.characteristics.map((c) => c.id));

    const result = allCharacteristics.map((characteristic) => ({
      ...characteristic,
      isAssigned: assignedCharIds.has(characteristic.id),
    }));

    return result;
  } catch (error) {
    console.error("Failed to fetch animal characteristics:", error);
    throw new Error("Could not fetch animal characteristics.");
  }
};


export const fetchAnimalCharacteristics = RequirePermission(
  Permissions.ANIMAL_READ_DETAIL
)(_fetchAnimalCharacteristics);
