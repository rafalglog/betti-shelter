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
import DataTable from "@/components/dashboard/users/table/users-table";
import { Authorize } from "@/components/auth/authorize";
import PageNotFoundOrAccessDenied from "@/components/PageNotFoundOrAccessDenied";
import { Permissions } from "@/app/lib/auth/permissions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

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
  const t = await getTranslations("dashboard");
  const { query = "", page = "1", sort, role } = await searchParams;
  const currentPage = Number(page);

  const { users, totalPages } = await fetchUsers(
    query,
    currentPage,
    sort,
    role
  );

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle className="font-semibold tabular-nums @[650px]/card:text-xl">
          {t("pages.users.title")}
        </CardTitle>
        <CardDescription>
          {t("pages.users.description")}
        </CardDescription>
        <CardAction>
          <Button asChild>
            <Link href="/dashboard/users/create">
              {t("pages.users.addUser")}
            </Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 md:gap-6">
              <DataTable
                data={users}
                ToolbarComponent={UsersTableToolbar}
                totalPages={totalPages}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Page;
