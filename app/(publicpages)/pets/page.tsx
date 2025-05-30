import { Suspense } from "react";
import Search from "../../ui/search";
import { FrontPetsCardSkeleton } from "../../ui/skeletons";
import {
  fetchPublishedPetsPagesWithCategory,
  fetchSpecies,
} from "@/app/lib/data/pets/public";
import Pagination from "@/app/ui/dashboard/pets/pagination";
import PetCard from "@/app/ui/publicpages/pet-card";
import CategoryList from "@/app/ui/publicpages/category-list";
import { SearchParamsType } from "@/app/lib/types";

interface Props {
  searchParams: Promise<SearchParamsType>;
}

// front page for the pets
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
    <div>
      <div className="">
        <div className="text-2xl">Pet List</div>
        <div className="text-sm text-gray-500">
          Currently available for adoption
        </div>
      </div>

      <div className="flex flex-row flex-wrap items-center justify-between gap-x-2 gap-y-2">
        {/* search bar */}
        <div className="w-96">
          <Search placeholder="Search pet name..." />
        </div>

        {/* category option */}
        <div className="">
          <CategoryList species={speciesList} speciesName={speciesName} />
        </div>
      </div>

      {/* pets card */}
      <Suspense
        key={query + currentPage + speciesName}
        fallback={<FrontPetsCardSkeleton />}
      >
        <PetCard
          query={query}
          currentPage={currentPage}
          speciesName={speciesName}
        />
      </Suspense>

      {/* table pagination buttons */}
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
};

export default Page;
