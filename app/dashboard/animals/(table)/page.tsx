import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DataTable from "@/components/dashboard/animals/table/animal-table";
import { fetchAnimals } from "@/app/lib/data/animals/animal.data";
import { SearchParamsType } from "@/app/lib/types";
import AnimalsDataTableToolbar from "@/components/dashboard/animals/table/animal-table-toolbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

interface Props {
  searchParams: SearchParamsType;
}

const Page = async ({ searchParams }: Props) => {
  const t = await getTranslations("dashboard");
  const {
    query = "",
    page = "1",
    pageSize = "10",
    sort, // e.g., "name.asc"
    listingStatus,
    sex,
  } = await searchParams;

  const currentPage = Number(page);
  const currentPageSize = Number(pageSize);

  // Pass all parameters, including the potentially undefined ones, to the function.
  const { animals, totalPages } = await fetchAnimals(
    query,
    currentPage,
    listingStatus,
    sex,
    currentPageSize,
    sort
  );
  return (
    <>
      <Card className="@container/card">
        <CardHeader>
          <CardTitle className="font-semibold tabular-nums @[650px]/card:text-xl">
            {t("pages.animals.title")}
          </CardTitle>
          <CardDescription>
            {t("pages.animals.description")}
          </CardDescription>
          <CardAction>
            <Button asChild>
              <Link href="/dashboard/animals/create">
                {t("pages.animals.addAnimal")}
              </Link>
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 md:gap-6">
                <DataTable
                  data={animals}
                  ToolbarComponent={AnimalsDataTableToolbar}
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
