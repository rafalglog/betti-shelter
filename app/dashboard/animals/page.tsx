import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DataTable from "@/components/dashboard/animals/table/animal-data-table";
import { columns } from "@/components/dashboard/animals/table/animal-data-table-columns";
import {
  fetchFilteredAnimals,
} from "@/app/lib/data/animals/animal.data";
import { SearchParamsType } from "@/app/lib/types";
import AnimalsDataTableToolbar from "@/components/dashboard/animals/table/animal-data-table-toolbar";
export const dynamic = 'force-dynamic'

interface Props {
  searchParams: SearchParamsType;
}

const Page = async ({ searchParams }: Props) => {
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
  const { animals, totalPages } = await fetchFilteredAnimals(
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
          <CardTitle className="text-lg font-semibold tabular-nums @[650px]/card:text-xl">
            Animals
          </CardTitle>
          <CardDescription>List of animals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 md:gap-6">
                <DataTable
                  data={animals}
                  columns={columns}
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