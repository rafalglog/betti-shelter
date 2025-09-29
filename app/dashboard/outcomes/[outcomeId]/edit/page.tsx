import { Suspense } from "react";
import PageNotFoundOrAccessDenied from "@/components/PageNotFoundOrAccessDenied";
import { fetchPartners } from "@/app/lib/data/animals/animal.data";
import { OutcomeForm } from "@/components/dashboard/outcomes/outcome-form";
import { fetchOutcomeById } from "@/app/lib/data/outcome.data";

interface Props {
  params: Promise<{ outcomeId: string }>;
}

const EditOutcomePage = async ({ params }: Props) => {
  const { outcomeId } = await params;

  const [outcome, partners] = await Promise.all([
    fetchOutcomeById(outcomeId),
    fetchPartners(),
  ]);

  if (!outcome || !outcome.animal) {
    return <PageNotFoundOrAccessDenied type="notFound" />;
  }
  if (!partners) {
    return <PageNotFoundOrAccessDenied type="notFound"/>;
  }

  const animal = outcome.animal;
  const application = outcome.adoptionApplication;

  return (
    <main>
      <Suspense fallback={<div>Loading form...</div>}>
        <OutcomeForm
          outcome={outcome}
          animal={{ id: animal.id, name: animal.name }}
          application={application || undefined}
          partners={partners}
        />
      </Suspense>
    </main>
  );
};

export default EditOutcomePage;