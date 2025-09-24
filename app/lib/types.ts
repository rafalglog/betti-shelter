import { Animal, AssessmentOutcome, AssessmentType, Breed, Color, FieldType, Prisma, Species } from "@prisma/client";

export type SearchParamsType = Promise<{ [key: string]: string | undefined }>;
export type IDParamType = Promise<{ id: string }>;

// Type for the pet object when images are included
export type AnimalByIDPayload = Prisma.AnimalGetPayload<{
  include: {
    animalImages: true;
    breeds: {
      include: {
        species: true;
      };
    };
  };
}>;

export type AnimalWithDetailsPayload = Animal & {
  species: Species;
  breeds: Breed[];
  colors: Color[];
};

export type ActionResult = {
  success: boolean;
  message: string | null;
};

// Type for the adoption application object, including selected animal details
// This type is based on the data structure returned by `fetchApplicationById`.
export type AdoptionApplicationPayload = Prisma.AdoptionApplicationGetPayload<{
  include: {
    animal: {
      select: {
        id: true;
        name: true;
        breeds: {
          select: {
            name: true,
          },
        };
        species: {
          select: {
            name: true,
          };
        };
      };
    };
  };
}>;

// Type for the animal object returned by getAnimalForApplication
// This includes basic animal details and a minimal list of adoption applications
export type AnimalForApplicationPayload = Prisma.AnimalGetPayload<{
  select: {
    id: true;
    name: true;
    breeds: {
      select: {
        name: true,
      },
    };
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
export type FilteredAnimalsPayload = Prisma.AnimalGetPayload<{
  select: {
    id: true;
    name: true;
    birthDate: true;
    city: true;
    state: true;
    listingStatus: true;
    sex: true;
    size: true;
    breeds: { select: { name: true } };
    animalImages: { select: { url: true }; take: 1 };
  };
}>;

// Type for the filtered adoption applications returned by fetchFilteredMyApplications
export type FilteredMyApplicationPayload =
  Prisma.AdoptionApplicationGetPayload<{
    select: {
      id: true;
      status: true;
      submittedAt: true;
      animal: {
        select: {
          name: true;
          species: {
            select: {
              name: true;
            };
          };
          animalImages: {
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
    // animal: {
    //   select: {
    //     name: true;
    //     species: {
    //       select: {
    //         name: true;
    //       };
    //     };
    //   };
    // };
    // user: {
    //   select: {
    //     image: true;
    //   };
    // };
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

export type PartnerPayload = Prisma.PartnerGetPayload<{
  select: {
    id: true;
    name: true;
  };
}>;

export type TaskAssignee = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null | undefined;
};

export type ColorPayload = Prisma.ColorGetPayload<{
  select: {
    id: true;
    name: true;
  };
}>;

export type SpeciesPayload = Prisma.SpeciesGetPayload<{
  select: {
    id: true;
    name: true;
    breeds: {
      select: {
        id: true;
        name: true;
      };
    };
  };
}>;

export type FieldOption = string | { value: string; label: string };

export interface TemplateField {
  id: string;
  label: string;
  fieldType: FieldType;
  placeholder: string | null;
  options: FieldOption[];
  isRequired: boolean;
  order: number;
}

export interface AssessmentFormData {
  animalId: string;
  templateId: string;
  overallOutcome?: AssessmentOutcome;
  summary?: string;
  customFields?: TemplateField[];
  [key: string]: any; // For dynamic field values
}