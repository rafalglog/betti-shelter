import { Suspense } from "react";
import Search from "../../ui/search";
import { PublicPetsCardSkeleton } from "../../ui/skeletons";
import {
  fetchPublishedPetsPagesWithCategory,
  fetchSpecies,
} from "@/app/lib/data/animals/public.data";
import Pagination from "@/app/ui/pagination";
import PetGrid from "@/app/ui/publicpages/pet-grid";
import CategoryList from "@/app/ui/publicpages/category-list";
import { SearchParamsType } from "@/app/lib/types";

interface Props {
  searchParams: SearchParamsType;
}

const Page = async ({ searchParams }: Props) => {
  const { page = "1", category = "", query = "" } = await searchParams;
  const speciesName = category;
  const currentPage = Number(page);

  // get the total number of pages
  const totalPages = await fetchPublishedPetsPagesWithCategory(
    query,
    speciesName
  );

  // get the list of species
  const speciesList = await fetchSpecies();

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <div className="text-3xl font-medium">Pet List</div>
        <div className="text-sm text-gray-500">
          Currently available for adoption
        </div>
      </div>

      <div className="flex flex-row flex-wrap items-center justify-between gap-x-2 gap-y-2">
        {/* search bar */}
        <div className="w-96">
          <Search placeholder="Search pet name" />
        </div>

        {/* category option */}
        <CategoryList species={speciesList} speciesName={speciesName} />
      </div>

      {/* pets card */}
      <Suspense
        key={query + currentPage + speciesName}
        fallback={<PublicPetsCardSkeleton />}
      >
        <PetGrid
          query={query}
          currentPage={currentPage}
          speciesName={speciesName}
        />
      </Suspense>

      {/* Pagination buttons */}
      <div className="flex justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
};

export default Page;
