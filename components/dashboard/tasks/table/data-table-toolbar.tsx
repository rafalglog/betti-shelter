"use client"

import { Table } from "@tanstack/react-table"
import { X } from "lucide-react"

import { DataTableViewOptions } from "./data-table-view-options"

import { priorities, statuses } from "../task-options"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="@container/toolbar flex items-center justify-between">
      {/* <div className="flex flex-1 items-center gap-2 "> */}
      <div className="grid grid-cols-1 items-center gap-2 @[726px]/toolbar:grid-cols-2">
        <div>
          <Input
            placeholder="Filter tasks..."
            value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("title")?.setFilterValue(event.target.value)
            }
            className="h-8 w-[150px] lg:w-[250px]"
          />
        </div>
        <div className="space-x-2">
          {table.getColumn("status") && (
            <DataTableFacetedFilter
              column={table.getColumn("status")}
              title="Status"
              options={statuses}
            />
          )}
          {table.getColumn("priority") && (
            <DataTableFacetedFilter
              column={table.getColumn("priority")}
              title="Priority"
              options={priorities}
            />
          )}
          {isFiltered && (
            <Button
              variant="ghost"
              onClick={() => table.resetColumnFilters()}
              className="h-8 px-2 lg:px-3"
            >
              Reset
              <X />
            </Button>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <DataTableViewOptions table={table} />
        <Button
          variant="default"
          size="sm"
        >Add Task</Button>
      </div>
    </div>
  )
}
