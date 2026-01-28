import DataTable from "@/components/dashboard/all-animal-tasks/table/task-table";
import TasksDataTableToolbar from "@/components/dashboard/all-animal-tasks/table/task-table-toolbar";
import { SearchParamsType } from "@/app/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { fetchAllAnimalsTasks } from "@/app/lib/data/all-animal-tasks.data";
import { fetchTaskAssigneeList } from "@/app/lib/data/animals/animal-task.data";
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
    category,
    status,
  } = await searchParams;

  const currentPage = Number(page);
  const currentPageSize = Number(pageSize);

  // Pass all parameters, including the potentially undefined ones, to the function.
  const { tasks, totalPages } = await fetchAllAnimalsTasks(
    query,
    currentPage,
    category,
    status,
    currentPageSize,
    sort
  );

  const assigneeList = await fetchTaskAssigneeList();

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle className="font-semibold tabular-nums @[650px]/card:text-xl">
          {t("pages.animalTasks.title")}
        </CardTitle>
        <CardDescription>
          {t("pages.animalTasks.description")}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 md:gap-6">
              <DataTable
                data={tasks}
                ToolbarComponent={TasksDataTableToolbar}
                totalPages={totalPages}
                assigneeList={assigneeList}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Page;
