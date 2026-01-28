import { Suspense } from "react";
import { IDParamType } from "@/app/lib/types";
import { fetchAssessmentTemplates } from "@/app/lib/data/animals/animal-assessment.data";
import { AssessmentForm } from "@/components/dashboard/animals/assessments/assessment-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getTranslations } from "next-intl/server";

interface Props {
  params: IDParamType;
}

export default async function NewAssessmentPage({ params }: Props) {
  const t = await getTranslations("dashboard");
  const { id: animalId } = await params;

  const templates = await fetchAssessmentTemplates();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("pages.assessments.newTitle")}</CardTitle>
        <CardDescription>
          {t("pages.assessments.newDescription")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<div>{t("common.loadingAssessmentForm")}</div>}>
          <AssessmentForm animalId={animalId} templates={templates} />
        </Suspense>
      </CardContent>
    </Card>
  );
}
