import Pagination from "@/app/ui/pagination";
import Search from "@/components/search";
import { TableSkeleton } from "@/components/skeletons";
import { Suspense } from "react";
import { FilteredApplicationsPayload, SearchParamsType } from "@/app/lib/types";
import {
  fetchApplicationPages,
  fetchFilteredApplications,
} from "@/app/lib/data/application.data";
import ReusableTable from "@/app/ui/reusable-table";
import PageHeader from "@/app/ui/dashboard/page-header";
import { Permissions } from "@/app/lib/auth/permissions";
import { Authorize } from "@/components/auth/authorize";
import PageNotFoundOrAccessDenied from "@/components/PageNotFoundOrAccessDenied";
import { applicationTableColumns } from "@/app/ui/dashboard/applications/app-table-columns";

interface Props {
  searchParams: SearchParamsType;
}

const Page = async ({ searchParams }: Props) => {
  return (
    <Authorize
      permission={Permissions.APPLICATIONS_READ_LISTING}
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

  const totalPages = await fetchApplicationPages(query);

  return (
    <div>
      <PageHeader title="Applications" />

      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search applications" />
      </div>

      <Suspense key={query + currentPage} fallback={<TableSkeleton />}>
        <ReusableTable<FilteredApplicationsPayload>
          fetchData={fetchFilteredApplications}
          query={query}
          currentPage={currentPage}
          columns={applicationTableColumns}
          noDataMessage="No applications found."
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
