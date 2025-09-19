import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import { AssessmentFormData, IDParamType } from "@/app/lib/types";
import { auth } from "@/auth";
import { getAssessmentTemplates } from "@/app/lib/data/animals/animal-assessment.data";
import { AssessmentForm } from "@/components/dashboard/animals/assessments/assessment-form";
import {
  Card,
  CardAction,
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
