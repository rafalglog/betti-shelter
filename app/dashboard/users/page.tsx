import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SearchParamsType } from "@/app/lib/types";
import { fetchUsers } from "@/app/lib/data/user.data";
import UsersTableToolbar from "@/components/dashboard/users/table/users-table-toolbar";
import { columns } from "@/components/dashboard/users/table/users-table-columns";
import DataTable from "@/components/dashboard/users/table/users-table";
export const dynamic = "force-dynamic";

interface Props {
  searchParams: SearchParamsType;
}

const Page = async ({ searchParams }: Props) => {
  const { query = "", page = "1", sort, role } = await searchParams;
  const currentPage = Number(page);

  const { users, totalPages } = await fetchUsers(
    query,
    currentPage,
    sort,
    role
  );

  return (
    <>
      <Card className="@container/card">
        <CardHeader>
          <CardTitle className="font-semibold tabular-nums @[650px]/card:text-xl">
            Role Management
          </CardTitle>
          <CardDescription>
            Manage user roles and permissions efficiently.
          </CardDescription>
          <CardAction>
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 md:gap-6">
                <DataTable
                  data={users}
                  columns={columns}
                  ToolbarComponent={UsersTableToolbar}
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
