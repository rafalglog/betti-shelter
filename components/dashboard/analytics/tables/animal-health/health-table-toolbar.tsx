"use client";

import { Table } from "@tanstack/react-table";
import { DataTableViewOptions } from "@/components/table-common/data-table-view-options";
import { AnimalsRequiringAttentionPayload } from "@/app/lib/data/analytics.data";

interface HealthDataTableToolbarProps {
  table: Table<AnimalsRequiringAttentionPayload>;
}

const HealthDataTableToolbar = ({ table }: HealthDataTableToolbarProps) => {
  return (
    <div className="@container/toolbar flex items-center justify-between">
      <div className="flex self-start gap-2">
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
};

export default HealthDataTableToolbar;