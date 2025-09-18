import { getAnimalAssessments } from "@/app/lib/data/animals/animal-assessment.data";
import { IDParamType } from "@/app/lib/types";
import AnimalAssessmentsTab from "@/components/dashboard/animals/assessments/assessments";
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

const Page = async ({ params }: Props) => {
  const { id: animalId } = await params;

  const animalAssessments = await getAnimalAssessments(animalId);

  return (
    <AnimalAssessmentsTab
      animalAssessments={animalAssessments}
      animalId={animalId}
    />
  );
};

export default Page;
