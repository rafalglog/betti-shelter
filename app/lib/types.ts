import { Prisma } from "@prisma/client";

export type SearchParamsType = Promise<{ [key: string]: string | undefined }>;
export type IDParamType = Promise<{ id: string }>;

// Type for the pet object when images are included
export type PetWithImagesPayload = Prisma.PetGetPayload<{
  include: {
    petImages: true;
  };
}>;

export type ActionResult = {
  success: boolean;
  message: string | null;
};

// Type for the adoption application object, including selected pet details
// This type is based on the data structure returned by `fetchApplicationById`.
export type AdoptionApplicationPayload = Prisma.AdoptionApplicationGetPayload<{
  include: {
    pet: {
      select: {
        id: true;
        name: true;
        breed: true;
        species: {
          select: {
            name: true;
          };
        };
      };
    };
  };
}>;

// Type for the pet object returned by getPetForApplication
// This includes basic pet details and a minimal list of adoption applications
export type PetForApplicationPayload = Prisma.PetGetPayload<{
  select: {
    id: true;
    name: true;
    breed: true;
    species: {
      select: { name: true };
    };
    adoptionApplications: {
      select: { userId: true };
    };
  };
}>;

// Type for the filtered users returned by _fetchFilteredUsers
export type FilteredUsersPayload = Prisma.UserGetPayload<{
  select: {
    id: true;
    email: true;
    image: true;
    role: true;
    createdAt: true;
  };
}>;

// Type for the filtered pets returned by _fetchFilteredPets
export type FilteredPetsPayload = Prisma.PetGetPayload<{
  select: {
    id: true;
    name: true;
    birthDate: true;
    city: true;
    state: true;
    listingStatus: true;
    species: {
      select: {
        name: true;
      };
    };
    petImages: {
      select: {
        url: true;
      };
      take: 1;
    };
  };
}>;

// Type for the filtered adoption applications returned by fetchFilteredMyApplications
export type FilteredMyApplicationPayload =
  Prisma.AdoptionApplicationGetPayload<{
    select: {
      id: true;
      status: true;
      submittedAt: true;
      isPrimary: true;
      pet: {
        select: {
          name: true;
          species: {
            select: {
              name: true;
            };
          };
          petImages: {
            select: {
              url: true;
            };
            take: 1;
          };
        };
      };
    };
  }>;

// Type for the filtered adoption applications returned by _fetchFilteredApplications
export type FilteredApplicationsPayload = Prisma.AdoptionApplicationGetPayload<{
  select: {
    id: true;
    applicantName: true;
    applicantEmail: true;
    applicantPhone: true;
    applicantCity: true;
    applicantState: true;
    status: true;
    submittedAt: true;
    isPrimary: true;
    pet: {
      select: {
        name: true;
        species: {
          select: {
            name: true;
          };
        };
      };
    };
    user: {
      select: {
        image: true;
      };
    };
  };
}>;

// Type for the user returned by _fetchUserById
export type UserByIdPayload = Prisma.UserGetPayload<{
  select: {
    id: true;
    email: true;
    role: true;
  };
}>;
