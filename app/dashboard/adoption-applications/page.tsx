import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SearchParamsType } from "@/app/lib/types";
import DataTable from "@/components/dashboard/adoption-applications/table/adoption-applications-table";
import { columns } from "@/components/dashboard/adoption-applications/table/adoption-applications-table-columns";
import UserAppTableToolbar from "@/components/dashboard/adoption-applications/table/adoption-applications-table-toolbar";
import { fetchUserApplications } from "@/app/lib/data/user-application.data";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: SearchParamsType;
}

const Page = async ({ searchParams }: Props) => {
  const { query = "", page = "1", sort, status } = await searchParams;
  const currentPage = Number(page);

  const { userApplications, totalPages } = await fetchUserApplications(
    query,
    currentPage,
    sort,
    status
  );

  return (
    <>
      <Card className="@container/card">
        <CardHeader>
          <CardTitle className="font-semibold tabular-nums @[650px]/card:text-xl">
            Adoption Applications
          </CardTitle>
          <CardDescription>
            Manage all incoming animal adoption applications.
          </CardDescription>
          <CardAction>
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 md:gap-6">
                <DataTable
                  data={userApplications}
                  columns={columns}
                  ToolbarComponent={UserAppTableToolbar}
                  totalPages={totalPages}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default Page;