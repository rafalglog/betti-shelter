"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ApplicationStatuses } from "./adoption-applications-options";
import { DataTableColumnHeader } from "../../../table-common/data-table-column-header";
import { DataTableRowActions } from "./adoption-applications-table-row-actions";
import { ApplicationWithAnimal } from "@/app/lib/data/user-application.data";
import { formatTimeAgo } from "@/app/lib/utils/date-utils";
import Link from "next/link";

type Translator = (key: string, values?: Record<string, unknown>) => string;

export const getColumns = (
  t: Translator
): ColumnDef<ApplicationWithAnimal>[] => [
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
    accessorKey: "applicantName",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t("adoptionApplications.columns.applicantName")}
      />
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
          {status && (
            <Badge variant="outline">{t(status.labelKey)}</Badge>
          )}
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("applicantName")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "applicantEmail",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t("adoptionApplications.columns.applicantEmail")}
      />
    ),
    meta: {
      displayName: "Applicant Email",
    },
    cell: ({ row }) => (
      <span className="max-w-[400px] truncate">
        {row.getValue("applicantEmail")}
      </span>
    ),
  },
  {
    accessorKey: "applicantPhone",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t("adoptionApplications.columns.applicantPhone")}
      />
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
      <DataTableColumnHeader
        column={column}
        title={t("adoptionApplications.columns.status")}
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
    id: "animalName",
    accessorFn: (row) => row.animal.name,
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t("adoptionApplications.columns.animalName")}
      />
    ),
    meta: {
      displayName: "Animal Name",
    },
    cell: ({ row }) => {
      const animal = row.original.animal;
      return (
        <span className="font-medium hover:underline">
          <Link href={`/dashboard/animals/${animal.id}`}>{animal.name}</Link>
        </span>
      );
    },
  },
  {
    id: "animalSpecies",
    accessorFn: (row) => row.animal.species.name,
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t("adoptionApplications.columns.animalSpecies")}
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
        title={t("adoptionApplications.columns.submittedAt")}
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
