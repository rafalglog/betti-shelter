import { prisma } from "@/app/lib/prisma";
import { Prisma, AnimalActivityType } from "@prisma/client";
import { cuidSchema } from "../../zod-schemas/common.schemas";
import { Permissions } from "@/app/lib/auth/permissions";
import { RequirePermission } from "../../auth/protected-actions";

export type AnimalActivityLogPayload = Prisma.AnimalActivityLogGetPayload<{
  include: {
    changedBy: {
      include: {
        user: true;
      };
    };
  };
}>;

// Fetch all activity (The log)
const _fetchAnimalActivityLogs = async (
  animalId: string
): Promise<AnimalActivityLogPayload[]> => {
  const validatedId = cuidSchema.safeParse(animalId);
  if (!validatedId.success) {
    throw new Error("Invalid animal ID format provided.");
  }

  try {
    const activityLogs = await prisma.animalActivityLog.findMany({
      where: {
        animalId: validatedId.data,
      },
      // Include the person who made the change
      include: {
        changedBy: {
          include: {
            user: true,
          },
        },
      },
      // Order by the most recent entries first
      orderBy: {
        changedAt: "desc",
      },
      // Limit the result to the last 10 entries
      take: 10,
    });
    return activityLogs;
  } catch (error) {
    console.error("Error fetching animal activity logs:", error);
    throw new Error("Could not fetch animal activity logs.");
  }
};

// Fetch animal Journey (The story)
const _fetchAnimalJourney = async (
  animalId: string
): Promise<AnimalActivityLogPayload[]> => {
  const validatedId = cuidSchema.safeParse(animalId);
  if (!validatedId.success) {
    throw new Error("Invalid animal ID format provided.");
  }

  // Define which activity types constitute the "Journey"
  const journeyEventTypes: AnimalActivityType[] = [
    AnimalActivityType.INTAKE_PROCESSED,
    AnimalActivityType.STATUS_CHANGE,
    AnimalActivityType.ASSESSMENT_COMPLETED,
    AnimalActivityType.OUTCOME_PROCESSED,
  ];

  try {
    const journeyLogs = await prisma.animalActivityLog.findMany({
      where: {
        animalId: validatedId.data,
        activityType: {
          in: journeyEventTypes,
        },
      },
      include: {
        changedBy: {
          include: {
            user: true,
          },
        },
      },
      // Order chronologically to tell a story from beginning to end
      orderBy: {
        changedAt: "asc",
      },
    });
    return journeyLogs;
  } catch (error) {
    console.error("Error fetching animal journey:", error);
    throw new Error("Could not fetch the animal's journey.");
  }
};

export const fetchAnimalJourney = RequirePermission(
  Permissions.ANIMAL_ASSESSMENT_READ_DETAIL
)(_fetchAnimalJourney);

export const fetchAnimalActivityLogs = RequirePermission(
  Permissions.ANIMAL_ASSESSMENT_READ_DETAIL
)(_fetchAnimalActivityLogs);
