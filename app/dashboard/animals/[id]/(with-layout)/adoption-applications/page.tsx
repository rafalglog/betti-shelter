import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IDParamType, SearchParamsType } from "@/app/lib/types";
import DataTable from "@/components/dashboard/adoption-applications/table/adoption-applications-table";
import { getColumns } from "@/components/dashboard/adoption-applications/table/adoption-applications-table-columns";
import UserAppTableToolbar from "@/components/dashboard/adoption-applications/table/adoption-applications-table-toolbar";
import { fetchAnimalApplications } from "@/app/lib/data/animals/animal-adoption-application.data";
import { notFound } from "next/navigation";
import { Authorize } from "@/components/auth/authorize";
import PageNotFoundOrAccessDenied from "@/components/PageNotFoundOrAccessDenied";
import { Permissions } from "@/app/lib/auth/permissions";
import { getTranslations } from "next-intl/server";

interface Props {
  searchParams: SearchParamsType;
  params: IDParamType;
}

const Page = async ({ searchParams, params }: Props) => {
  return (
    <Authorize
      permission={Permissions.APPLICATIONS_READ_LISTING}
      fallback={<PageNotFoundOrAccessDenied type="accessDenied" />}
    >
      <PageContent searchParams={searchParams} params={params} />
    </Authorize>
  );
};

const PageContent = async ({ searchParams, params }: Props) => {
  const t = await getTranslations("dashboard");
  const { id: animalId } = await params;

  const { query = "", page = "1", sort, status } = await searchParams;
  const currentPage = Number(page);

  if (!animalId) {
    return notFound();
  }

  const { applications, totalPages } = await fetchAnimalApplications(
    animalId,
    query,
    currentPage,
    sort,
    status
  );

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle className="font-semibold tabular-nums @[650px]/card:text-xl">
          {t("pages.adoptionApplications.title")}
        </CardTitle>
        <CardDescription>
          {t("pages.adoptionApplications.singleDescription")}
        </CardDescription>
        <CardAction></CardAction>
      </CardHeader>
      <CardContent>
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 md:gap-6">
              <DataTable
                data={applications}
                columns={getColumns(t)}
                ToolbarComponent={UserAppTableToolbar}
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
