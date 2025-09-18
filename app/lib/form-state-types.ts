export const INITIAL_FORM_STATE = { message: null, errors: {} };

// Error messages for animal form
export type AnimalFormState = {
  message?: string | null;
  errors?: {
    petName?: string[];
    species?: string[];
    breed?: string[];
    primaryColor?: string[];
    sex?: string[];
    size?: string[];
    estimatedBirthDate?: string[];
    healthStatus?: string[];
    microchipNumber?: string[];
    intakeType?: string[];
    intakeDate?: string[];
    staffMemberId?: string[];
    sourcePartnerId?: string[];
    foundAddress?: string[];
    foundCity?: string[];
    foundState?: string[];
    surrenderingPersonName?: string[];
    surrenderingPersonPhone?: string[];
    notes?: string[];
  };
};

export interface AnimalTaskFormState {
  message?: string | null;
  errors?: {
    title?: string[];
    details?: string[];
    status?: string[];
    category?: string[];
    priority?: string[];
    dueDate?: string[];
    animalId?: string[];
    assigneeId?: string[];
  };
}

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
