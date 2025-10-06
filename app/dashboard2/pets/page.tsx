import Pagination from "@/app/ui/pagination";
import Search from "@/components/search";
import { TableSkeleton } from "@/components/skeletons";
import { Suspense } from "react";
import {
  fetchAnimals,
  fetchPetsPages,
} from "@/app/lib/data/animals/animal.data";
import { AnimalsPayload, SearchParamsType } from "@/app/lib/types";
import { CreatePetButton } from "@/app/ui/dashboard/pets/buttons/create-pet";
import ReusableTable from "@/app/ui/reusable-table";
import PageHeader from "@/app/ui/dashboard/page-header";
import { Permissions } from "@/app/lib/auth/permissions";
import { hasPermission } from "@/app/lib/auth/hasPermission";
import { Authorize } from "@/components/auth/authorize";
import PageNotFoundOrAccessDenied from "@/components/PageNotFoundOrAccessDenied";
import { petTableColumns } from "@/app/ui/dashboard/pets/pet-table-columns";

interface Props {
  searchParams: SearchParamsType;
}

const Page = async ({ searchParams }: Props) => {
  return (
    <Authorize
      permission={Permissions.ANIMAL_READ_LISTING}
      fallback={<PageNotFoundOrAccessDenied type="accessDenied" />}
    >
      <PageContent searchParams={searchParams} />
    </Authorize>
  );
};

const PageContent = async ({ searchParams }: Props) => {
  // get the query and page number from the search params
  const { query = "", page = "1" } = await searchParams;
  const currentPage = Number(page);

  const totalPages = await fetchPetsPages(query);
  const canManagePet = await hasPermission(Permissions.ANIMAL_CREATE);

  return (
    <div>
      <PageHeader title="Pets" />
      
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search pets" />
        <CreatePetButton canManage={canManagePet} />
      </div>

      <Suspense key={query + currentPage} fallback={<TableSkeleton />}>
        <ReusableTable<AnimalsPayload>
          fetchData={fetchAnimals}
          query={query}
          currentPage={currentPage}
          columns={petTableColumns}
          noDataMessage="No Pets found."
          idAccessor={(app) => app.id}
        />
      </Suspense>

      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
};

export default Page;
