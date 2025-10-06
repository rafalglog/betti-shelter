import { AdoptionApplication, Animal, AssessmentOutcome, AssessmentType, Breed, Color, FieldType, Intake, Like, Prisma, Species, Task } from "@prisma/client";

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

export type OutcomePayload = Prisma.OutcomeGetPayload<{
  include: {
    animal: {
      select: {
        id: true;
        name: true;
      };
    };
    staffMember: {
      select: {
        id: true;
        name: true;
      };
    };
    destinationPartner: {
      select: {
        id: true;
        name: true;
      };
    };
    adoptionApplication: {
      select: {
        id: true;
        applicantName: true;
      };
    };
  };
}>;

export type AnimalForCardPayload = Pick<
  Animal,
  | "id"
  | "name"
  | "birthDate"
  | "sex"
  | "size"
  | "microchipNumber"
  | "listingStatus"
  | "isSpayedNeutered"
  | "city"
  | "state"
  | "healthStatus"
  | "legalStatus"
> & {
  species: Pick<Species, "name">;
  breeds: Pick<Breed, "name">[];
  colors: Pick<Color, "name">[];
  adoptionApplications: Pick<AdoptionApplication, "id" | "status">[];
  intake: Pick<Intake, "intakeDate">[];
  likes: Pick<Like, "id">[];
  tasks: Pick<Task, "id" | "status">[];
};

export type AnimalWithDetailsPayload = Animal & {
  species: Species;
  breeds: Breed[];
  colors: Color[];
  adoptionApplications?: Pick<AdoptionApplication, 'id' | 'status'>[];
};

export type ActionResult = {
  success: boolean;
  message: string | null;
};

export type AdoptionApplicationPayload = Prisma.AdoptionApplicationGetPayload<{
  include: {
    animal: {
      select: {
        id: true,
        name: true,
        breeds: {
          select: {
            name: true,
          },
        },
        species: {
          select: {
            name: true,
          },
        },
        adoptionApplications: {
          select: {
            userId: true,
          },
        },
      },
    },
  },
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

export type UsersPayload = Prisma.UserGetPayload<{
  select: {
    id: true;
    email: true;
    image: true;
    role: true;
    createdAt: true;
  };
}>;

export type AnimalsPayload = Prisma.AnimalGetPayload<{
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

export type MyApplicationPayload =
  Prisma.AdoptionApplicationGetPayload<{
    select: {
      id: true;
      status: true;
      applicantName: true;
      applicantPhone: true;
      submittedAt: true;
      animal: {
        select: {
          id: true;
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

export type ApplicationsPayload = Prisma.AdoptionApplicationGetPayload<{
  select: {
    id: true;
    applicantName: true;
    applicantEmail: true;
    applicantPhone: true;
    applicantCity: true;
    applicantState: true;
    status: true;
    submittedAt: true;
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