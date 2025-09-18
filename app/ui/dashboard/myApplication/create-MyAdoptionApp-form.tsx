"use client";

import { useActionState } from "react";
import {
  INITIAL_FORM_STATE,
  MyAdoptionAppFormState,
} from "@/app/lib/form-state-types";
import { AnimalForApplicationPayload } from "@/app/lib/types";
import { createMyAdoptionApp } from "@/app/lib/actions/myApplication.action";
import MyApplicationForm from "./myApplication-form";

interface Props {
  animalId: string; // Route param
  petToAdopt: AnimalForApplicationPayload;
}

const CreateMyAdoptionAppForm = ({ animalId, petToAdopt }: Props) => {
  const createMyAdoptionAppWithPetId = createMyAdoptionApp.bind(null, petId);

  const [state, formAction, isPending] = useActionState<
    MyAdoptionAppFormState,
    FormData
  >(createMyAdoptionAppWithPetId, INITIAL_FORM_STATE);

  return (
    <MyApplicationForm
      state={state}
      formAction={formAction}
      isPending={isPending}
      petToAdopt={petToAdopt}
      petId={petId}
    />
  );
};

export default CreateMyAdoptionAppForm;