"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ApplicationStatuses } from "./my-applications-options";
import { DataTableColumnHeader } from "../../../table-common/data-table-column-header";
import { DataTableRowActions } from "./my-applications-table-row-actions";
import { FilteredMyApplicationPayload } from "@/app/lib/types";

export const columns: ColumnDef<FilteredMyApplicationPayload>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "applicantName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Applicant Name" />
    ),
    meta: {
      displayName: "Applicant Name",
    },
    cell: ({ row }) => {
      const status = ApplicationStatuses.find(
        (status) => status.value === row.original.status
      );

      return (
        <div className="flex space-x-2">
          {status && <Badge variant="outline">{status.label}</Badge>}
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("applicantName")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "applicantPhone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Applicant Phone" />
    ),
    meta: {
      displayName: "Applicant Phone",
    },
    cell: ({ row }) => (
      <span className="max-w-[400px] truncate">
        {row.getValue("applicantPhone")}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = ApplicationStatuses.find(
        (status) => status.value === row.getValue("status")
      );

      if (!status) {
        return null;
      }

      return (
        <div className="flex w-[100px] items-center">
          {status.icon && (
            <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{status.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "animalName",
    accessorFn: (row) => row.animal.name,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Pet Name" />
    ),
    meta: {
      displayName: "Animal Name",
    },
    cell: ({ row }) => {
      return (
        <span className="max-w-[400px] truncate">
          {row.original.animal.name}
        </span>
      );
    },
  },
  {
    id: "animalSpecies",
    accessorFn: (row) => row.animal.species.name,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Pet Species" />
    ),
    meta: {
      displayName: "Species",
    },
    cell: ({ row }) => {
      return (
        <span className="max-w-[400px] truncate">
          {row.original.animal.species.name}
        </span>
      );
    },
  },
  {
    accessorKey: "submittedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Submitted At" />
    ),
    meta: {
      displayName: "Submitted At",
    },
    cell: ({ row }) => {
      const date = row.getValue("submittedAt");

      return date ? (
        <span>{new Date(date as string).toLocaleDateString()}</span>
      ) : null;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
