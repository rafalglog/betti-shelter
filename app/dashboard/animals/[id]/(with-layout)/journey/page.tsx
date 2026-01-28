import { IDParamType } from "@/app/lib/types";
import AnimalJourney from "@/components/dashboard/animals/journey/animal-journey";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Suspense } from "react";
import { Authorize } from "@/components/auth/authorize";
import PageNotFoundOrAccessDenied from "@/components/PageNotFoundOrAccessDenied";
import { Permissions } from "@/app/lib/auth/permissions";
import { getTranslations } from "next-intl/server";

interface Props {
  params: IDParamType;
}

const Page = async ({ params }: Props) => {
  return (
    <Authorize
      permission={Permissions.ANIMAL_JOURNEY_READ}
      fallback={<PageNotFoundOrAccessDenied type="accessDenied" />}
    >
      <PageContent params={params} />
    </Authorize>
  );
};

const PageContent = async ({ params }: Props) => {
  const t = await getTranslations("dashboard");
  const { id: animalId } = await params;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("pages.journey.title")}</CardTitle>
        <CardDescription>
          {t("pages.journey.description")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<JourneySkeleton />}>
          <AnimalJourney animalId={animalId} />
        </Suspense>
      </CardContent>
    </Card>
  );
};

const JourneySkeleton = () => {
  return (
    <div className="space-y-8 animate-pulse">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex space-x-3">
          <div className="h-8 w-8 rounded-full bg-gray-200"></div>
          <div className="flex-1 space-y-2 py-1">
            <div className="h-4 w-1/4 rounded bg-gray-200"></div>
            <div className="h-3 w-3/4 rounded bg-gray-200"></div>
            <div className="h-2 w-1/2 rounded bg-gray-200"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Page;
