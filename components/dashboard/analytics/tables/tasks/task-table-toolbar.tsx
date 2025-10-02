"use client";

import { Table } from "@tanstack/react-table";
import { TaskPayload } from "@/app/lib/data/animals/animal-task.data";
import { DataTableViewOptions } from "@/components/table-common/data-table-view-options";

interface TasksDataTableToolbarProps {
  table: Table<TaskPayload>;
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