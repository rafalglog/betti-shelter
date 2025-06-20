"use client";

import { useActionState } from "react";
import { AdoptionApplicationPayload } from "@/app/lib/types";
import { updateMyAdoptionApp } from "@/app/lib/actions/myApplication.action";
import {
  INITIAL_FORM_STATE,
  MyAdoptionAppFormState,
} from "@/app/lib/form-state-types";
import MyApplicationForm from "./myApplication-form";

interface Props {
  myApplication: AdoptionApplicationPayload;
  myApplicationId: string;
}

const EditMyAdoptionAppForm = ({ myApplication, myApplicationId }: Props) => {
  const updateMyAdoptionAppWithId = updateMyAdoptionApp.bind(
    null,
    myApplicationId
  );

  const [state, formAction, isPending] = useActionState<
    MyAdoptionAppFormState,
    FormData
  >(updateMyAdoptionAppWithId, INITIAL_FORM_STATE);

  return (
      <MyApplicationForm
        state={state}
        formAction={formAction}
        isPending={isPending}
        myApplication={myApplication}
      />
  );
};

export default EditMyAdoptionAppForm;
