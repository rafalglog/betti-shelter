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
import { FetchAnimalTasksPayload } from "@/app/lib/data/animals/animal-task.data";
import { TaskAssignee } from "@/app/lib/types";
import { TaskForm } from "../task-form";
import { updateAnimalTaskStatus } from "@/app/lib/actions/animal-task.actions";
import { TaskStatus } from "@prisma/client";
import { TaskStatusOptions } from "@/app/lib/utils/enum-formatter";
import { useTranslations } from "next-intl";

interface DataTableRowActionsProps {
  row: Row<FetchAnimalTasksPayload>;
  assigneeList: TaskAssignee[];
  animalId: string;
}

export function DataTableRowActions({
  row,
  assigneeList,
  animalId,
}: DataTableRowActionsProps) {
  const task = row.original;
  const t = useTranslations("dashboard");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const onSoftDelete = () => {
    const originalStatus = task.status;
    updateAnimalTaskStatus(animalId, task.id, TaskStatus.DELETED);

    toast.success(t("tasks.toast.movedToTrash"), {
      action: {
        label: t("common.undo"),
        onClick: () => {
          updateAnimalTaskStatus(animalId, task.id, originalStatus);
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
                    animalId,
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
          animalId={animalId}
          onFormSubmit={() => setIsDialogOpen(false)}
          assigneeList={assigneeList}
          task={task}
        />
      </DialogContent>
    </Dialog>
  );
}
