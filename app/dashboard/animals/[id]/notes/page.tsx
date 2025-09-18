import { IDParamType, SearchParamsType } from "@/app/lib/types";
import AnimalNotes from "@/components/dashboard/notes/notes";
import { fetchFilteredAnimalNotes } from "@/app/lib/data/animals/animal-note.data";

interface Props {
  params: IDParamType;
  searchParams: SearchParamsType;
}

const Page = async ({ params, searchParams }: Props) => {
  const { id: animalId } = await params;

  const {
    page = "1",
    category,
    sort, // e.g., "Newest first", "Oldest first"
    showDeleted
  } = await searchParams;

  const currentPage = Number(page);
  const includeDeleted = showDeleted === "true";

  const { notes, totalPages } = await fetchFilteredAnimalNotes(
    currentPage,
    category,
    sort,
    animalId,
    includeDeleted
  );
  
  return (
    <>
      <AnimalNotes notes={notes} totalPages={totalPages} animalId={animalId}/>
    </>
  );
};

export default Page;
