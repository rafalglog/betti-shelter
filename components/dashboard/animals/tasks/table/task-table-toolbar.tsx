"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { Table } from "@tanstack/react-table";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  TaskCategoryOptions,
  TaskStatusOptions,
} from "@/app/lib/utils/enum-formatter";
import { FetchAnimalTasksPayload } from "@/app/lib/data/animals/animal-task.data";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { TaskForm } from "../task-form";
import { TaskAssignee } from "@/app/lib/types";
import { ServerSideFacetedFilter } from "@/components/table-common/server-side-faceted-filter";
import { DataTableViewOptions } from "@/components/table-common/data-table-view-options";

interface TasksDataTableToolbarProps {
  table: Table<FetchAnimalTasksPayload>;
  animalId: string;
  assigneeList: TaskAssignee[];
}

const TasksDataTableToolbar = ({ table, animalId, assigneeList }: TasksDataTableToolbarProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const handleSearch = useDebouncedCallback((term) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    router.replace(`${pathname}?${params.toString()}`);
  }, 300);

  const isFiltered =
    searchParams.has("query") ||
    searchParams.has("category") ||
    searchParams.has("status");

  return (
    <div className="@container/toolbar flex items-center justify-between">
      <div className="grid grid-cols-1 items-center gap-y-2 @[736px]/toolbar:grid-cols-[200px_1fr] @[736px]/toolbar:gap-x-4">
        <div>
          <Input
            id="task-search"
            placeholder="Filter Tasks..."
            onChange={(e) => {
              handleSearch(e.target.value);
            }}
            defaultValue={searchParams.get("query")?.toString()}
            className="h-8 w-[200px] @[736px]/toolbar:w-full"
          />
        </div>
        <div className="space-x-2 @[736px]/toolbar:justify-self-start items-center flex">
          <ServerSideFacetedFilter
            title="Category"
            paramKey="category"
            options={TaskCategoryOptions}
          />
          <ServerSideFacetedFilter
            title="Status"
            paramKey="status"
            options={TaskStatusOptions}
          />
          {isFiltered && (
            <Button
              variant="ghost"
              onClick={() => router.push(pathname)}
              className="h-8 px-2 lg:px-3"
            >
              Reset
              <X className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      <div className="flex self-start gap-2">
        <DataTableViewOptions table={table} />

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="h-8">Add Task</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create Task</DialogTitle>
              <DialogDescription>
                Create a new task for this animal. Click create task when you&apos;re done.
              </DialogDescription>
            </DialogHeader>
            <TaskForm
              animalId={animalId}
              onFormSubmit={() => setIsDialogOpen(false)}
              assigneeList={assigneeList}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default TasksDataTableToolbar;