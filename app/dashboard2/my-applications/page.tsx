import Pagination from "@/app/ui/pagination";
import Search from "@/components/search";
import { TableSkeleton } from "@/components/skeletons";
import { Suspense } from "react";
import { MyApplicationPayload, SearchParamsType } from "@/app/lib/types";
import ReusableTable from "@/app/ui/reusable-table";
import PageHeader from "@/app/ui/dashboard/page-header";
import { fetchMyApplicationPages, fetchMyApplications } from "@/app/lib/data/my-applications.data";
import { Permissions } from "@/app/lib/auth/permissions";
import { Authorize } from "@/components/auth/authorize";
import PageNotFoundOrAccessDenied from "@/components/PageNotFoundOrAccessDenied";
import { appTableColumns } from "@/app/ui/dashboard/myApplication/myApp-table-columns";

interface Props {
  searchParams: SearchParamsType;
}

const Page = async ({ searchParams }: Props) => {
  return (
    <Authorize
      permission={Permissions.MY_APPLICATIONS_READ}
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

  const totalPages = await fetchMyApplicationPages(query);

  return (
    <div>
      <PageHeader title="My Applications" />

      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search pet name" />
      </div>

      <Suspense key={query + currentPage} fallback={<TableSkeleton />}>
        <ReusableTable<MyApplicationPayload>
          fetchData={fetchMyApplications}
          query={query}
          currentPage={currentPage}
          columns={appTableColumns}
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
