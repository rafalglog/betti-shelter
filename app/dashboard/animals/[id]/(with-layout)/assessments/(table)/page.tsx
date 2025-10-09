import { fetchAnimalAssessments } from "@/app/lib/data/animals/animal-assessment.data";
import { IDParamType, SearchParamsType } from "@/app/lib/types";
import AnimalAssessmentsTab from "@/components/dashboard/animals/assessments/assessments";
import { Authorize } from "@/components/auth/authorize";
import PageNotFoundOrAccessDenied from "@/components/PageNotFoundOrAccessDenied";
import { Permissions } from "@/app/lib/auth/permissions";

interface Props {
  params: IDParamType;
  searchParams: SearchParamsType;
}

const Page = async ({ params, searchParams }: Props) => {
  return (
    <Authorize
      permission={Permissions.ANIMAL_ASSESSMENT_READ_LISTING}
      fallback={<PageNotFoundOrAccessDenied type="accessDenied" />}
    >
      <PageContent params={params} searchParams={searchParams} />
    </Authorize>
  );
};

const PageContent = async ({ params, searchParams }: Props) => {
  const { id: animalId } = await params;
  const { page = "1", type, outcome, sort, showDeleted } = await searchParams;
  const currentPage = Number(page);
  const includeDeleted = showDeleted === "true";

  const { assessments, totalPages } = await fetchAnimalAssessments(
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