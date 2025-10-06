import { IDParamType, SearchParamsType } from "@/app/lib/types";
import AnimalNotes from "@/components/dashboard/animals/notes/notes";
import { fetchAnimalNotes } from "@/app/lib/data/animals/animal-note.data";
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
      permission={Permissions.ANIMAL_NOTE_READ_LISTING}
      fallback={<PageNotFoundOrAccessDenied type="accessDenied" />}
    >
      <PageContent params={params} searchParams={searchParams} />
    </Authorize>
  );
};

const PageContent = async ({ params, searchParams }: Props) => {
  const { id: animalId } = await params;
  const {
    page = "1",
    category,
    sort, // e.g., "Newest first", "Oldest first"
    showDeleted
  } = await searchParams;
  const currentPage = Number(page);
  const includeDeleted = showDeleted === "true";

  const { notes, totalPages } = await fetchAnimalNotes(
    currentPage,
    category,
    sort,
    animalId,
    includeDeleted
  );
  
  return (
    <AnimalNotes notes={notes} totalPages={totalPages} animalId={animalId} />
  );
};

export default Page;