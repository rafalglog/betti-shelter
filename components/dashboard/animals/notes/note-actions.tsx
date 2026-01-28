"use client";

import { useState, useTransition } from "react";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NotePayload } from "@/app/lib/data/animals/animal-note.data";
import { NoteForm } from "./note-form";
import { deleteAnimalNote, restoreAnimalNote } from "@/app/lib/actions/animal-note.actions";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

interface NoteActionsProps {
  note: NotePayload;
  animalId: string;
}

export function NoteActions({ note, animalId }: NoteActionsProps) {
  const t = useTranslations("dashboard");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const onSoftDelete = () => {
    startTransition(() => {
      deleteAnimalNote(note.id, animalId).then((data) => {
        if (data?.message) {
          toast.success(data.message, {
            action: {
              label: t("common.undo"),
              onClick: () => onRestore(),
            },
          });
        }
      });
    });
  };

  const onRestore = () => {
    startTransition(() => {
      restoreAnimalNote(note.id, animalId).then((data) => {
        if (data?.message) {
          toast.success(data.message);
        }
      });
    });
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DialogTrigger asChild>
            <DropdownMenuItem>{t("table.edit")}</DropdownMenuItem>
          </DialogTrigger>
          {note.deletedAt ? (
            <DropdownMenuItem onClick={onRestore} disabled={isPending}>
              {t("table.restore")}
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              variant="destructive"
              onClick={onSoftDelete}
              disabled={isPending}
            >
              {t("table.delete")}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{t("notes.dialog.editTitle")}</DialogTitle>
          <DialogDescription>
            {t("notes.dialog.editDescription")}
          </DialogDescription>
        </DialogHeader>
        <NoteForm
          animalId={animalId}
          onFormSubmit={() => setIsDialogOpen(false)}
          note={note}
        />
      </DialogContent>
    </Dialog>
  );
}
