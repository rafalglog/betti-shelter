import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { AnimalJourneyLogPayload } from "./data/animals/animal-journey.data";
import { AnimalActivityType } from "@prisma/client";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatJourneyItem = (
  item: AnimalJourneyLogPayload
): { title: string; description: string } | null => {
  const animalName = item.animal?.name || "The animal";

  switch (item.activityType) {
    case AnimalActivityType.CREATED:
    case AnimalActivityType.INTAKE_PROCESSED:
      return {
        title: "Incoming Event",
        description: `${animalName} was admitted to the shelter.`,
      };

    case AnimalActivityType.STATUS_CHANGE:
      return {
        title: "Status Change",
        description:
          item.changeSummary || `The animal's adoption status was updated.`,
      };

    case AnimalActivityType.OUTCOME_PROCESSED:
      const outcomeType = item.animal?.Outcome[0]?.type;
      if (outcomeType === "ADOPTION") {
        return {
          title: "Outcome Event: Adopted",
          description: `${animalName} has been adopted and left the shelter.`,
        };
      }
      return null;

    default:
      // Hide any other event types
      return null;
  }
};
