import {
  fetchAnimalsRequiringAttention,
  fetchAnalyticsTaskTableData,
} from "@/app/lib/data/analytics.data";
import { fetchTaskAssigneeList } from "@/app/lib/data/animals/animal-task.data";

import TaskTable from "@/components/dashboard/analytics/tables/tasks/task-table";
import TasksDataTableToolbar from "@/components/dashboard/analytics/tables/tasks/task-table-toolbar";

import HealthTable from "@/components/dashboard/analytics/tables/animal-health/health-table";
import HealthDataTableToolbar from "@/components/dashboard/analytics/tables/animal-health/health-table-toolbar";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getTranslations } from "next-intl/server";

const AnalyticsTables = async () => {
  const t = await getTranslations("dashboard");
  // Move the data fetching here
  const [tasks, animalHealth, assigneeList] = await Promise.all([
    fetchAnalyticsTaskTableData(),
    fetchAnimalsRequiringAttention(),
    fetchTaskAssigneeList(),
  ]);

  return (
    <Tabs defaultValue="animal-tasks">
      <TabsList>
        <TabsTrigger value="animal-tasks">
          {t("analytics.tabs.tasks")}
        </TabsTrigger>
        <TabsTrigger value="health">{t("analytics.tabs.health")}</TabsTrigger>
      </TabsList>
      <TabsContent value="animal-tasks">
        <Card>
          <CardHeader>
            <CardTitle>{t("analytics.tasks.title")}</CardTitle>
            <CardDescription>
              {t("analytics.tasks.description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TaskTable
              data={tasks}
              ToolbarComponent={TasksDataTableToolbar}
              assigneeList={assigneeList}
            />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="health">
        <Card>
          <CardHeader>
            <CardTitle>{t("analytics.health.title")}</CardTitle>
            <CardDescription>
              {t("analytics.health.description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <HealthTable
              data={animalHealth}
              ToolbarComponent={HealthDataTableToolbar}
            />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default AnalyticsTables;
