import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DataTable from "@/components/dashboard/my-adoption-applications/table/my-applications-table";
import { getColumns } from "@/components/dashboard/my-adoption-applications/table/my-applications-table-columns";
import { SearchParamsType } from "@/app/lib/types";
import MyAppTableToolbar from "@/components/dashboard/my-adoption-applications/table/my-applications-table-toolbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { fetchMyApplications } from "@/app/lib/data/my-applications.data";
import { getTranslations } from "next-intl/server";

interface Props {
  searchParams: SearchParamsType;
}

const Page = async ({ searchParams }: Props) => {
  const t = await getTranslations("dashboard");
  const { query = "", page = "1", sort, status } = await searchParams;
  const currentPage = Number(page);

  const { myApplications, totalPages } = await fetchMyApplications(
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
            {t("pages.myApplications.title")}
          </CardTitle>
          <CardDescription>
            {t("pages.myApplications.description")}
          </CardDescription>
          <CardAction>
            <Button asChild>
              <Link href="/pets">{t("pages.myApplications.adoptPets")}</Link>
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 md:gap-6">
              <DataTable
                data={myApplications}
                columns={getColumns(t)}
                ToolbarComponent={MyAppTableToolbar}
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
