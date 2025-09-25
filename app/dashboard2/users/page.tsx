import Pagination from "@/app/ui/pagination";
import Search from "@/components/search";
import { Suspense } from "react";
import { fetchFilteredUsers, fetchUserPages } from "@/app/lib/data/users/user.data";
import { FilteredUsersPayload, SearchParamsType } from "@/app/lib/types";
import ReusableTable from "@/app/ui/reusable-table";
import PageHeader from "@/app/ui/dashboard/page-header";
import { Permissions } from "@/app/lib/auth/permissions";
import { Authorize } from "@/components/auth/authorize";
import PageNotFoundOrAccessDenied from "@/components/PageNotFoundOrAccessDenied";
import { userTableColumns } from "@/app/ui/dashboard/users/users-table-columns";
import { TableSkeleton } from "@/components/skeletons";

interface Props {
  searchParams: SearchParamsType;
}

const Page = async ({ searchParams }: Props) => {
  return (
    <Authorize
      permission={Permissions.MANAGE_ROLES}
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
  const totalPages = await fetchUserPages(query);

  return (
    <div>
      <PageHeader title="Users" />

      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search email" />
      </div>

      <Suspense key={query + currentPage} fallback={<TableSkeleton />}>
        <ReusableTable<FilteredUsersPayload>
          fetchData={fetchFilteredUsers}
          query={query}
          currentPage={currentPage}
          columns={userTableColumns}
          noDataMessage="No Users found."
          idAccessor={(app) => app.id}
        />
      </Suspense>

      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}

export default Page;