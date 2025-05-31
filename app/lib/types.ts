import { Prisma } from "@prisma/client";

export interface SearchParamsType {
  [key: string]: string | undefined;
}

// Type for the pet object when images are included
export type PetWithImagesPayload = Prisma.PetGetPayload<{
  include: {
    petImages: true;
  };
}>;

export interface UserIdProps {
  id: string;
}