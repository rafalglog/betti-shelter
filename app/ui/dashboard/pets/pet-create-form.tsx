"use client";

import { createPet } from "@/app/lib/actions/pet.actions";
import { useActionState } from "react";
import { Species } from "@prisma/client";
import { INITIAL_FORM_STATE, PetFormState } from "@/app/lib/form-state-types";
import PetForm from "./pet-form";

interface CreatePetFormProps {
  speciesList: Species[];
}

const CreatePetForm = ({ speciesList }: CreatePetFormProps) => {
  const [state, formAction, isPending] = useActionState<PetFormState, FormData>(
    createPet,
    INITIAL_FORM_STATE
  );

  return (
    <PetForm
      state={state}
      formAction={formAction}
      isPending={isPending}
      speciesList={speciesList}
    />
  );
};

export default CreatePetForm;