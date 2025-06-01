// Error messages for the pet form
export type CreatePetFormState = {
  errors?: {
    name?: string[];
    age?: string[];
    gender?: string[];
    speciesId?: string[];
    breed?: string[];
    weightKg?: string[];
    heightCm?: string[];
    city?: string[];
    state?: string[];
    description?: string[];
    listingStatus?: string[];
    adoptionStatusId?: string[];
    petImages?: string[];
  };
  message?: string | null;
};

// Error messages for the user form
export type updateUserFormState = {
  errors?: {
    role?: string[];
  };
  message?: string | null;
};