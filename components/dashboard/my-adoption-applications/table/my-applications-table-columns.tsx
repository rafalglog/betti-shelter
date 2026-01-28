"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ApplicationStatuses } from "./my-applications-options";
import { DataTableColumnHeader } from "../../../table-common/data-table-column-header";
import { DataTableRowActions } from "./my-applications-table-row-actions";
import { MyApplicationPayload } from "@/app/lib/types";
import { formatTimeAgo } from "@/app/lib/utils/date-utils";
import Link from "next/link";

type Translator = (key: string, values?: Record<string, unknown>) => string;

export const getColumns = (
  t: Translator
): ColumnDef<MyApplicationPayload>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label={t("table.selectAll")}
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label={t("table.selectRow")}
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "animalName",
    accessorFn: (row) => row.animal.name,
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t("myApplications.columns.petName")}
      />
    ),
    meta: {
      displayName: "Animal Name",
    },
    cell: ({ row }) => {
      const status = ApplicationStatuses.find(
        (status) => status.value === row.original.status
      );
      const animal = row.original.animal;

      return (
        <div className="flex space-x-2">
          {status && (
            <Badge variant="outline">{t(status.labelKey)}</Badge>
          )}
          <Link
            href={`/pets/${animal.id}`}
            className="font-medium hover:underline"
          >
            {animal.name}
          </Link>
        </div>
      );
    },
  },
  {
    accessorKey: "applicantName",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t("myApplications.columns.applicantName")}
      />
    ),
    meta: {
      displayName: "Applicant Name",
    },
    cell: ({ row }) => {
      return (
        <span className="max-w-[500px] truncate">
          {row.getValue("applicantName")}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t("myApplications.columns.status")}
      />
    ),
    cell: ({ row }) => {
      const status = ApplicationStatuses.find(
        (status) => status.value === row.getValue("status")
      );

      if (!status) {
        return null;
      }

      return (
        <Badge variant="outline" className="flex w-fit items-center">
          {status.icon && (
            <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{t(status.labelKey)}</span>
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "animalSpecies",
    accessorFn: (row) => row.animal.species.name,
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t("myApplications.columns.petSpecies")}
      />
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
      <DataTableColumnHeader
        column={column}
        title={t("myApplications.columns.submittedAt")}
      />
    ),
    meta: {
      displayName: "Submitted At",
    },
    cell: ({ row }) => {
      const date = row.getValue("submittedAt") as string | Date | null;
      return <span>{formatTimeAgo(date)}</span>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
