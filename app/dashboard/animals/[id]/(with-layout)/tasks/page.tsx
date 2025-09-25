import { fetchFilteredAnimalTasks } from "@/app/lib/data/animals/animal-task.data";
import { getColumns } from "@/components/dashboard/tasks/table/task-table-columns";
import DataTable from "@/components/dashboard/tasks/table/task-table";
import TasksDataTableToolbar from "@/components/dashboard/tasks/table/task-table-toolbar";
import { IDParamType, SearchParamsType } from "@/app/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { fetchTaskAssigneeList } from "@/app/lib/data/users/user.data";

interface Props {
  params: IDParamType;
  searchParams: SearchParamsType;
}

const Page = async ({ params, searchParams }: Props) => {
  const { id: animalId } = await params;

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
  const { tasks, totalPages } = await fetchFilteredAnimalTasks(
    query,
    currentPage,
    category,
    status,
    currentPageSize,
    sort,
    animalId
  );

  const assigneeList = await fetchTaskAssigneeList();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tasks</CardTitle>
        <CardDescription>Tasks associated with this animal.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 md:gap-6">
              <DataTable
                data={tasks}
                getColumns={getColumns}
                ToolbarComponent={TasksDataTableToolbar}
                totalPages={totalPages}
                animalId={animalId}
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
