"use client";

import { updatePet } from "@/app/lib/actions/pet.actions";
import { useActionState } from "react";
import { Species } from "@prisma/client";
import { PetWithImagesPayload } from "@/app/lib/types";
import { INITIAL_FORM_STATE, PetFormState } from "@/app/lib/form-state-types";
import PetForm from "./pet-form";

interface EditPetFormProps {
  pet: PetWithImagesPayload;
  speciesList: Species[];
  canManagePet: boolean;
}

const EditPetForm = ({ pet, speciesList, canManagePet }: EditPetFormProps) => {
  const updatePetWithId = updatePet.bind(null, pet.id);
  const [state, formAction, isPending] = useActionState<PetFormState, FormData>(
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
