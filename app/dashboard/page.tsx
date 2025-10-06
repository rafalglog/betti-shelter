import { SectionCards } from "@/components/dashboard/analytics/section-cards";
import { Suspense } from "react";
import ChartWrapper from "@/components/dashboard/analytics/chart-wrapper";
import {
  fetchAnimalsRequiringAttention,
  fetchTaskTableData,
} from "../lib/data/analytics.data";

import TaskTable from "@/components/dashboard/analytics/tables/tasks/task-table";
import { getColumns as getTaskColumns } from "@/components/dashboard/analytics/tables/tasks/task-table-columns";
import TasksDataTableToolbar from "@/components/dashboard/analytics/tables/tasks/task-table-toolbar";

import HealthTable from "@/components/dashboard/analytics/tables/animal-health/health-table";
import { columns as getHealthColumns } from "@/components/dashboard/analytics/tables/animal-health/health-table-columns";
import HealthDataTableToolbar from "@/components/dashboard/analytics/tables/animal-health/health-table-toolbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { fetchTaskAssigneeList } from "../lib/data/animals/animal-task.data";

const SectionCardsSkeleton = () => (
  <div className="shimmer-animation grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="h-[150px] bg-gray-100 border rounded-lg" />
    ))}
  </div>
);

const Page = async () => {
  const [tasks, animalHealth, assigneeList] = await Promise.all([
    fetchTaskTableData(),
    fetchAnimalsRequiringAttention(),
    fetchTaskAssigneeList()
  ]);

  return (
    <>
      <Suspense fallback={<SectionCardsSkeleton />}>
        <SectionCards />
      </Suspense>
      <ChartWrapper />

      <Tabs defaultValue="animal-tasks">
        <TabsList>
          <TabsTrigger value="animal-tasks">Tasks</TabsTrigger>
          <TabsTrigger value="health">Health</TabsTrigger>
        </TabsList>
        <TabsContent value="animal-tasks">
          <Card>
            <CardHeader>
              <CardTitle>Animal Tasks</CardTitle>
              <CardDescription>
                This table provides a direct to-do list for shelter staff,
                showing all tasks that are not yet completed.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TaskTable
                data={tasks}
                getColumns={getTaskColumns}
                ToolbarComponent={TasksDataTableToolbar}
                assigneeList={assigneeList}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="health">
          <Card>
            <CardHeader>
              <CardTitle>Animal Health</CardTitle>
              <CardDescription>
                This tab flags animals that are in a special state requiring
                administrative or medical oversight.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <HealthTable
                data={animalHealth}
                columns={getHealthColumns}
                ToolbarComponent={HealthDataTableToolbar}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default Page;
