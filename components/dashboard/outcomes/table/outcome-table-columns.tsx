"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { OutcomeTypesOptions } from "./outcome-options";
import { DataTableColumnHeader } from "../../../table-common/data-table-column-header";
import { DataTableRowActions } from "./outcome-table-row-actions";
import { OutcomeWithDetails } from "@/app/lib/data/outcome.data";
import { formatDateOrNA } from "@/app/lib/utils/date-utils";

export const columns: ColumnDef<OutcomeWithDetails>[] = [
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
    accessorFn: (row) => row.animal.name,
    id: "animal",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Animal" />
    ),
    cell: ({ row }) => {
      const { animal } = row.original;
      return (
        <div>
          <div className="font-medium">{animal.name}</div>
          <div className="text-sm text-muted-foreground">
            {animal.species.name}
          </div>
        </div>
      );
    },
  },
  {
    accessorFn: (row) =>
      row.adoptionApplication?.applicantName ||
      row.destinationPartner?.name ||
      row.owner?.name ||
      "",
    id: "recipient",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Recipient" />
    ),
    cell: ({ row }) => (
      <span className="max-w-[500px] truncate font-medium">
        {row.getValue("recipient") || "N/A"}
      </span>
    ),
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => {
      const outcomeType = OutcomeTypesOptions.find(
        (type) => type.value === row.getValue("type")
      );

      if (!outcomeType) {
        return null;
      }

      // Define a mapping from outcome type to badge variant
      const variantMap: {
        [key: string]: "default" | "secondary" | "destructive" | "outline";
      } = {
        ADOPTION: "default",
        TRANSFER_OUT: "secondary",
        RETURN_TO_OWNER: "outline",
        DECEASED: "destructive",
      };

      const variant = variantMap[outcomeType.value] || "secondary";

      return (
        <Badge variant={variant} className="whitespace-nowrap">
          {outcomeType.icon && <outcomeType.icon className="mr-2 h-4 w-4" />}
          {outcomeType.label}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorFn: (row) => row.outcomeDate,
    id: "outcomeDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Outcome Date" />
    ),
    meta: {
      displayName: "Outcome Date",
    },
    cell: ({ row }) => {
      const date = row.getValue("outcomeDate") as string | Date | undefined | null;
      return <span>{formatDateOrNA(date)}</span>;
    },
  },
  {
    accessorKey: "staffMember.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Processed By" />
    ),
    meta: {
      displayName: "Staff Name",
    },
    cell: ({ row }) => {
      return (
        <span className="max-w-[400px] truncate">
          {row.getValue("staffMember.name")}
        </span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];