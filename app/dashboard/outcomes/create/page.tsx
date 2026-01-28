import {
  fetchPartners,
  fetchAnimalForOutcomeForm,
} from "@/app/lib/data/animals/animal.data";
import { OutcomeForm } from "@/components/dashboard/outcomes/outcome-form";
import { fetchApplicationById } from "@/app/lib/data/user-application.data";
import { Suspense } from "react";
import { SearchParamsType } from "@/app/lib/types";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, ArchiveIcon } from "lucide-react";
import { AnimalListingStatus } from "@prisma/client";
import ActionBlockedMessage from "@/components/action-blocked-message";
import { getTranslations } from "next-intl/server";

interface Props {
  searchParams: SearchParamsType;
}

const CreateOutcomePage = async ({ searchParams }: Props) => {
  const t = await getTranslations("dashboard");
  const { animalId, applicationId } = (await searchParams) || {};

  let animal: Awaited<ReturnType<typeof fetchAnimalForOutcomeForm>> = null;
  let application = null;

  if (applicationId) {
    application = await fetchApplicationById(applicationId);
    if (!application || !application.animal) {
      return notFound();
    }
    animal = await fetchAnimalForOutcomeForm(application.animal.id);
  } else if (animalId) {
    animal = await fetchAnimalForOutcomeForm(animalId);
  }

  if (!animal) {
    return notFound();
  }

  const partners = await fetchPartners();
  if (!partners) {
    return notFound();
  }

  return (
    <main className="container mx-auto">
      <Button asChild variant="ghost" className="mb-4">
        <Link href={`/dashboard/animals/${animal.id}`}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("common.backToAnimalProfile")}
        </Link>
      </Button>

      {animal.listingStatus === AnimalListingStatus.ARCHIVED ? (
        <ActionBlockedMessage
          icon={ArchiveIcon}
          title={t("outcomes.alreadyProcessedTitle")}
        >
          <p>
            {t.rich("outcomes.alreadyProcessedBody", {
              name: animal.name,
              strong: (chunks) => <strong>{chunks}</strong>,
            })}
          </p>
        </ActionBlockedMessage>
      ) : (
        <Suspense fallback={<div>{t("common.loadingForm")}</div>}>
          <OutcomeForm
            animal={{ id: animal.id, name: animal.name }}
            application={application || undefined}
            partners={partners}
          />
        </Suspense>
      )}
    </main>
  );
};

export default CreateOutcomePage;
