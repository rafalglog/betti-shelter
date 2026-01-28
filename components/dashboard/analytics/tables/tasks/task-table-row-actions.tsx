"use client";

import { Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TaskAssignee } from "@/app/lib/types";
import { updateAnimalTaskStatus } from "@/app/lib/actions/animal-task.actions";
import { TaskStatus } from "@prisma/client";
import { TaskStatusOptions } from "@/app/lib/utils/enum-formatter";
import { TaskForm } from "../../../animals/tasks/task-form";
import { TaskAnalyticsPayload } from "@/app/lib/data/analytics.data";
import { useTranslations } from "next-intl";

interface DataTableRowActionsProps {
  row: Row<TaskAnalyticsPayload>;
  assigneeList: TaskAssignee[];
}

export function DataTableRowActions({
  row,
  assigneeList,
}: DataTableRowActionsProps) {
  const t = useTranslations("dashboard");
  const task = row.original;
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const onSoftDelete = () => {
    const originalStatus = task.status;
    updateAnimalTaskStatus(row.original.animal.id, task.id, TaskStatus.DELETED);

    toast.success(t("tasks.toast.movedToTrash"), {
      action: {
        label: t("common.undo"),
        onClick: () => {
          updateAnimalTaskStatus(row.original.animal.id, task.id, originalStatus);
          toast.info(t("tasks.toast.restored"));
        },
      },
    });
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">{t("table.openMenu")}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DialogTrigger asChild>
            <DropdownMenuItem>
              {t("table.edit")}
            </DropdownMenuItem>
          </DialogTrigger>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger>{t("table.status")}</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup
                value={task.status}
                onValueChange={(newStatus) => {
                  updateAnimalTaskStatus(
                    row.original.animal.id,
                    task.id,
                    newStatus as TaskStatus
                  );
                  toast.success(t("tasks.toast.statusUpdated"));
                }}
              >
                {TaskStatusOptions.map((status) => (
                  <DropdownMenuRadioItem
                    key={status.value}
                    value={status.value}
                    disabled={task.status === status.value}
                  >
                    {t(`tasks.options.status.${status.value}`)}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            variant="destructive"
            onClick={onSoftDelete}
            disabled={task.status === TaskStatus.DELETED}
          >
            {t("table.moveToTrash")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{t("tasks.dialog.editTitle")}</DialogTitle>
          <DialogDescription>
            {t("tasks.dialog.editDescription")}
          </DialogDescription>
        </DialogHeader>
        <TaskForm
          animalId={row.original.animal.id}
          onFormSubmit={() => setIsDialogOpen(false)}
          assigneeList={assigneeList}
          task={task}
        />
      </DialogContent>
    </Dialog>
  );
}
