import { Prisma } from "@prisma/client";

export type SearchParamsType = Promise<{ [key: string]: string | undefined }>;
export type IDParamType = Promise<{ id: string }>;

// Type for the pet object when images are included
export type PetWithImagesPayload = Prisma.PetGetPayload<{
  include: {
    petImages: true;
  };
}>;

export interface UserIdProps {
  id: string;
}
