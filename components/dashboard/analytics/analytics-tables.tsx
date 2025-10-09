import {
  fetchAnimalsRequiringAttention,
  fetchAnalyticsTaskTableData,
} from "@/app/lib/data/analytics.data";
import { fetchTaskAssigneeList } from "@/app/lib/data/animals/animal-task.data";

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

const AnalyticsTables = async () => {
  // Move the data fetching here
  const [tasks, animalHealth, assigneeList] = await Promise.all([
    fetchAnalyticsTaskTableData(),
    fetchAnimalsRequiringAttention(),
    fetchTaskAssigneeList(),
  ]);

  return (
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
              This table provides a direct to-do list for shelter staff, showing
              all tasks that are not yet completed.
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
  );
};

export default AnalyticsTables;