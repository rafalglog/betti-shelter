"use client";

import { updatePet } from "@/app/lib/actions/animal.actions";
import { useActionState } from "react";
import { Species } from "@prisma/client";
import { AnimalByIDPayload } from "@/app/lib/types";
import { INITIAL_FORM_STATE, AnimalFormState } from "@/app/lib/form-state-types";
import PetForm from "./pet-form";

interface EditPetFormProps {
  pet: AnimalByIDPayload;
  speciesList: Species[];
  canManagePet: boolean;
}

const EditPetForm = ({ pet, speciesList, canManagePet }: EditPetFormProps) => {
  const updatePetWithId = updatePet.bind(null, pet.id);
  const [state, formAction, isPending] = useActionState<AnimalFormState, FormData>(
    updatePetWithId,
    INITIAL_FORM_STATE
  );

  return (
    <PetForm
      state={state}
      formAction={formAction}
      isPending={isPending}
      speciesList={speciesList}
      pet={pet}
      canManagePet={canManagePet}
    />
  );
};

export default EditPetForm;
