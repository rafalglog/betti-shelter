import { Suspense } from "react";
import { IDParamType } from "@/app/lib/types";
import { getAssessmentTemplates } from "@/app/lib/data/animals/animal-assessment.data";
import { AssessmentForm } from "@/components/dashboard/animals/assessments/assessment-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Props {
  params: IDParamType;
}

export default async function NewAssessmentPage({ params }: Props) {
  const { id: animalId } = await params;

  const templates = await getAssessmentTemplates();

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Assessment</CardTitle>
        <CardDescription>
          Create a new assessment using one of the available templates.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<div>Loading assessment form...</div>}>
          <AssessmentForm animalId={animalId} templates={templates} />
        </Suspense>
      </CardContent>
    </Card>
  );
}
