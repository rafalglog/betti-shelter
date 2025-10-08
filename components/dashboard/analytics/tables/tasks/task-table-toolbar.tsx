"use client";

import { Table } from "@tanstack/react-table";
import { DataTableViewOptions } from "@/components/table-common/data-table-view-options";
import { TaskAnalyticsPayload } from "@/app/lib/data/analytics.data";

interface TasksDataTableToolbarProps {
  table: Table<TaskAnalyticsPayload>;
}

const TasksDataTableToolbar = ({ table }: TasksDataTableToolbarProps) => {
  return (
    <div className="@container/toolbar flex items-center justify-between">
      <div className="flex self-start gap-2">
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
};

export default TasksDataTableToolbar;