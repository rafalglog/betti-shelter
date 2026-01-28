"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { UserRoles } from "./users-options";
import { DataTableColumnHeader } from "../../../table-common/data-table-column-header";
import { DataTableRowActions } from "./users-table-row-actions";
import { UsersPayload } from "@/app/lib/types";

type Translator = (key: string, values?: Record<string, unknown>) => string;

export const getColumns = (t: Translator): ColumnDef<UsersPayload>[] => [
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
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t("users.columns.email")} />
    ),
    cell: ({ row }) => {
      const role = UserRoles.find(
        (role) => role.value === row.original.role
      );

      return (
        <div className="flex space-x-2">
          {role && <Badge variant="outline">{t(role.labelKey)}</Badge>}
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("email")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t("users.columns.role")} />
    ),
    cell: ({ row }) => {
      const role = row.getValue("role") as string;

      return (
        <span className="max-w-[400px] truncate">
          {t(`users.roleOptions.${role}`)}
        </span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
