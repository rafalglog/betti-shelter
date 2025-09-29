import PageNotFoundOrAccessDenied from "@/components/PageNotFoundOrAccessDenied";
import {
  fetchPartners,
  fetchAnimalById,
} from "@/app/lib/data/animals/animal.data";
import { OutcomeForm } from "@/components/dashboard/outcomes/outcome-form";
import { fetchApplicationById } from "@/app/lib/data/user-application.data";
import { Suspense } from "react";
import { SearchParamsType } from "@/app/lib/types";

interface Props {
  searchParams: SearchParamsType;
}

const CreateOutcomePage = async ({ searchParams }: Props) => {
  const { animalId, applicationId } = await searchParams || {};

  let animal = null;
  let application = null;

  if (applicationId) {
    // Mode 1: Adoption Outcome
    application = await fetchApplicationById(applicationId);
    if (!application || !application.animal) {
      return <PageNotFoundOrAccessDenied type="notFound" />;
    }
    // The animal data is nested inside the application object
    animal = application.animal;
  } else if (animalId) {
    // Mode 2: General Outcome
    animal = await fetchAnimalById(animalId);
  }

  if (!animal) {
    return <PageNotFoundOrAccessDenied type="notFound" />;
  }

  const partners = await fetchPartners();
  if (!partners) {
    return <PageNotFoundOrAccessDenied type="notFound" />;
  }

  return (
    <main>
      <Suspense fallback={<div>Loading form...</div>}>
        <OutcomeForm
          animal={{ id: animal.id, name: animal.name }}
          application={application || undefined}
          partners={partners}
        />
      </Suspense>
    </main>
  );
};

export default CreateOutcomePage;