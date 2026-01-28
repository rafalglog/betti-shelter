import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SearchParamsType } from "@/app/lib/types";
import DataTable from "@/components/dashboard/outcomes/table/outcome-table";
import { getColumns } from "@/components/dashboard/outcomes/table/outcome-table-columns";
import OutcomeTableToolbar from "@/components/dashboard/outcomes/table/outcome-table-toolbar";
import { fetchOutcomes } from "@/app/lib/data/animals/outcome.data";
import { Authorize } from "@/components/auth/authorize";
import PageNotFoundOrAccessDenied from "@/components/PageNotFoundOrAccessDenied";
import { Permissions } from "@/app/lib/auth/permissions";
import { getTranslations } from "next-intl/server";

interface Props {
  searchParams: SearchParamsType;
}

const Page = async ({ searchParams }: Props) => {
  return (
    <Authorize
      permission={Permissions.OUTCOMES_MANAGE}
      fallback={<PageNotFoundOrAccessDenied type="accessDenied" />}
    >
      <PageContent searchParams={searchParams} />
    </Authorize>
  );
};

const PageContent = async ({ searchParams }: Props) => {
  const t = await getTranslations("dashboard");
  const { query = "", page = "1", sort, type } = await searchParams;
  const currentPage = Number(page);

  const { outcomes, totalPages } = await fetchOutcomes(
    query,
    currentPage,
    sort,
    type
  );
  const columns = getColumns(t);

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle className="font-semibold tabular-nums @[650px]/card:text-xl">
          {t("pages.outcomes.title")}
        </CardTitle>
        <CardDescription>
          {t("pages.outcomes.description")}
        </CardDescription>
        <CardAction></CardAction>
      </CardHeader>
      <CardContent>
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 md:gap-6">
              <DataTable
                data={outcomes}
                columns={columns}
                ToolbarComponent={OutcomeTableToolbar}
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
