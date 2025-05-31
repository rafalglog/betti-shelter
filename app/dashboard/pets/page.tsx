import Pagination from "@/app/ui/dashboard/pets/pagination";
import Search from "@/app/ui/search";
import PetsTable from "@/app/ui/dashboard/pets/table";
import { CreatePet } from "@/app/ui/dashboard/pets/buttons";
import { opensans } from "@/app/ui/fonts";
import { PetsTableSkeleton } from "@/app/ui/skeletons";
import { Suspense } from "react";
import { fetchPetsPages } from "@/app/lib/data/pets/pet";
import { SearchParamsType } from "@/app/lib/types";

interface Props {
  searchParams: Promise<SearchParamsType>;
}

const Page = async ({ searchParams }: Props) => {
  // get the query and page number from the search params
  const { query = "", page = "1" } = await searchParams;
  const currentPage = Number(page);

  const totalPages = await fetchPetsPages(query);

  return (
    <div className="w-full">
      {/* page title */}
      <div className="flex w-full items-center justify-between">
        <h1 className={`${opensans.className} text-2xl`}>Pets</h1>
      </div>

      {/* search bar */}
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search pets..." />
        <CreatePet />
      </div>

      {/* table of pets */}
      <Suspense key={query + currentPage} fallback={<PetsTableSkeleton />}>
        <PetsTable query={query} currentPage={currentPage} />
      </Suspense>

      {/* table pagination buttons */}
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}

export default Page;