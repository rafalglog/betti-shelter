"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { sexOptions, sizeOptions } from "../animal-options";
import { DataTableColumnHeader } from "../../data-table-column-header";
import { AnimalTableRowActions } from "./animal-table-row-actions";
import { calculateAgeString } from "@/app/lib/utils/date-utils";
import { FilteredAnimalsPayload } from "@/app/lib/types";
import { animalListingStatusOptions } from "@/app/lib/utils/enum-formatter";

export const columns: ColumnDef<FilteredAnimalsPayload>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="px-1">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="px-1">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const status = animalListingStatusOptions.find(
        (status) => status.value === row.original.listingStatus
      );

      return (
        <div className="flex space-x-2">
          {status && <Badge variant="outline">{status.label}</Badge>}{" "}
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("name")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "birthDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Age" />
    ),
    cell: ({ row }) => {
      return (
        <span>
          {calculateAgeString({
            birthDate: row.getValue("birthDate"),
            simple: true,
          })}
        </span>
      );
    },
  },
  {
    accessorKey: "sex",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sex" />
    ),
    cell: ({ row }) => {
      const sex = sexOptions.find((sex) => sex.value === row.getValue("sex"));

      return sex ? (
        <div className="flex items-center">
          {sex.icon && (
            <sex.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{sex.label}</span>
        </div>
      ) : null;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "size",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Size" />
    ),
    cell: ({ row }) => {
      const size = sizeOptions.find(
        (size) => size.value === row.getValue("size")
      );

      if (!size) {
        return null;
      }

      return (
        <div className="flex w-[100px] items-center">
          {size.icon && (
            <size.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{size.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "city",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="City" />
    ),
    cell: ({ row }) => (
      <span className="max-w-[200px] truncate">{row.getValue("city")}</span>
    ),
  },
  {
    accessorKey: "state",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="State" />
    ),
    cell: ({ row }) => (
      <span className="max-w-[200px] truncate">{row.getValue("state")}</span>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <AnimalTableRowActions row={row} />,
  },
];
