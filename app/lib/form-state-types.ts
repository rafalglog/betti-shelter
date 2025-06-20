export const INITIAL_FORM_STATE = { message: null, errors: {} };

// Error messages for creating a pet form
export type PetFormState = {
  message?: string | null;
  errors?: {
    name?: string[];
    birthDate?: string[];
    gender?: string[];
    speciesId?: string[];
    breed?: string[];
    weightKg?: string[];
    heightCm?: string[];
    city?: string[];
    state?: string[];
    description?: string[];
    listingStatus?: string[];
    petImages?: string[];
  };
};

// Error messages for application form
export interface MyAdoptionAppFormState {
  message?: string | null;
  errors?: {
    applicantName?: string[];
    applicantEmail?: string[];
    applicantPhone?: string[];
    applicantAddressLine1?: string[];
    applicantAddressLine2?: string[];
    applicantCity?: string[];
    applicantState?: string[];
    applicantZipCode?: string[];
    livingSituation?: string[];
    hasYard?: string[];
    landlordPermission?: string[];
    householdSize?: string[];
    hasChildren?: string[];
    childrenAges?: string[];
    otherPetsDescription?: string[];
    petExperience?: string[];
    reasonForAdoption?: string[];
  };
}

// Error messages for the user form
export type UpdateUserFormState = {
  errors?: {
    role?: string[];
  };
  message?: string | null;
};

// Error state for updating the application (staff)
export type StaffUpdateAppFormState = {
  message?: string | null;
  errors?: {
    status?: string[];
    internalNotes?: string[];
    statusChangeReason?: string[];
    isPrimary?: string[];
  };
};