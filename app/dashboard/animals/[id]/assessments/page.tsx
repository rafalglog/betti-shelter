import { fetchFilteredAnimalAssessments } from "@/app/lib/data/animals/animal-assessment.data";
import { IDParamType, SearchParamsType } from "@/app/lib/types";
import AnimalAssessmentsTab from "@/components/dashboard/animals/assessments/assessments";

interface Props {
  params: IDParamType;
  searchParams: SearchParamsType;
}

const Page = async ({ params, searchParams }: Props) => {
  const { id: animalId } = await params;

  const { page = "1", type, outcome, sort, showDeleted } = await searchParams;

  const currentPage = Number(page);
  const includeDeleted = showDeleted === "true";

  const { assessments, totalPages } = await fetchFilteredAnimalAssessments(
    animalId,
    currentPage,
    type,
    outcome,
    sort,
    includeDeleted
  );

  return (
    <AnimalAssessmentsTab
      animalAssessments={assessments}
      totalPages={totalPages}
      animalId={animalId}
    />
  );
};

export default Page;
