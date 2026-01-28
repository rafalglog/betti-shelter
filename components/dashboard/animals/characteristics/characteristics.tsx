"use client";

import React, { useState, useMemo, useTransition, useCallback } from "react";
import { CharacteristicCategory } from "@prisma/client";
import { clsx } from "clsx";
import {
  X,
  PlusCircle,
  Pencil,
  HeartPulse,
  Stethoscope,
  Home,
  FileText,
  ChevronsUpDown,
  Loader2,
} from "lucide-react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CharacteristicWithAssignment } from "@/app/lib/data/animals/animal-characteristics.data";
import { updateAnimalCharacteristics } from "@/app/lib/actions/animal-characteristics.actions";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

type CategoryUIDefinition = {
  label: string;
  color: string;
  icon: React.ElementType;
};

const CATEGORIES: Record<CharacteristicCategory, CategoryUIDefinition> = {
  [CharacteristicCategory.BEHAVIOR]: {
    label: "Behavior",
    color: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100",
    icon: HeartPulse,
  },
  [CharacteristicCategory.MEDICAL]: {
    label: "Medical",
    color: "bg-red-100 text-red-800 border-red-200 hover:bg-red-100",
    icon: Stethoscope,
  },
  [CharacteristicCategory.ENVIRONMENT]: {
    label: "Environment",
    color: "bg-green-100 text-green-800 border-green-200 hover:bg-green-100",
    icon: Home,
  },
  [CharacteristicCategory.ADMINISTRATIVE]: {
    label: "Administrative",
    color: "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-100",
    icon: FileText,
  },
  [CharacteristicCategory.OTHER]: {
    label: "Other",
    color:
      "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100",
    icon: PlusCircle,
  },
};

const CATEGORY_KEYS = Object.values(CharacteristicCategory);

interface Props {
  animalCharacteristics: CharacteristicWithAssignment[];
  animalId: string;
}

const AnimalCharacteristicsManager = ({
  animalCharacteristics,
  animalId,
}: Props) => {
  const t = useTranslations("dashboard");
  const [isPending, startTransition] = useTransition();

  // Component state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [stagedChanges, setStagedChanges] = useState<Set<string>>(new Set());
  const [openCombobox, setOpenCombobox] = useState(false);

  const initialAssignedIds = useMemo(
    () =>
      new Set(
        animalCharacteristics
          .filter((char) => char.isAssigned)
          .map((char) => char.id)
      ),
    [animalCharacteristics]
  );

  // Use stagedChanges if dialog is open, otherwise use initial data
  const activeIds = isDialogOpen ? stagedChanges : initialAssignedIds;

  const assignedCharacteristics = useMemo(
    () => animalCharacteristics.filter((char) => activeIds.has(char.id)),
    [animalCharacteristics, activeIds]
  );

  const savedGroupedCharacteristics = useMemo(() => {
    const savedChars = animalCharacteristics.filter((char) =>
      initialAssignedIds.has(char.id)
    );
    return savedChars.reduce<
      Record<CharacteristicCategory, CharacteristicWithAssignment[]>
    >((acc, char) => {
      const categoryKey = char.category;
      (acc[categoryKey] = acc[categoryKey] || []).push(char);
      return acc;
    }, {} as Record<CharacteristicCategory, CharacteristicWithAssignment[]>);
  }, [animalCharacteristics, initialAssignedIds]);

  const availableForAdding = useMemo(
    () => animalCharacteristics.filter((char) => !stagedChanges.has(char.id)),
    [animalCharacteristics, stagedChanges]
  );

  const handleOpenDialog = useCallback(() => {
    setStagedChanges(new Set(initialAssignedIds));
    setIsDialogOpen(true);
  }, [initialAssignedIds]);

  const handleCancel = useCallback(() => {
    setStagedChanges(new Set());
    setIsDialogOpen(false);
  }, []);

  const handleSave = useCallback(() => {
    startTransition(async () => {
      const result = await updateAnimalCharacteristics({
        animalId,
        characteristicIds: Array.from(stagedChanges),
      });

      if (result.success) {
        toast.success(result.message || t("characteristics.toast.updated"));
        setIsDialogOpen(false);
      } else {
        toast.error(result.message || t("common.unexpectedError"));
      }
    });
  }, [animalId, stagedChanges]);

  const handleTagRemove = useCallback(
    (charId: string) => {
      const newStagedChanges = new Set(stagedChanges);
      newStagedChanges.delete(charId);
      setStagedChanges(newStagedChanges);
    },
    [stagedChanges]
  );

  const handleTagAdd = useCallback(
    (charId: string) => {
      const newStagedChanges = new Set(stagedChanges);
      newStagedChanges.add(charId);
      setStagedChanges(newStagedChanges);
      setOpenCombobox(false);
    },
    [stagedChanges]
  );

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <Card className="w-full mx-auto">
        <CardHeader className="relative">
          <CardTitle>{t("characteristics.title")}</CardTitle>
          <CardDescription>
            {t("characteristics.description")}
          </CardDescription>
          <CardAction>
            <DialogTrigger asChild>
              <Button variant="default" size="sm" onClick={handleOpenDialog}>
                <Pencil className="size-4 mr-2" />
                {t("table.edit")}
              </Button>
            </DialogTrigger>
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {CATEGORY_KEYS.map((key) => {
              const Icon = CATEGORIES[key].icon;
              const characteristicsForCategory =
                savedGroupedCharacteristics[key];
              return (
                characteristicsForCategory &&
                characteristicsForCategory.length > 0 && (
                  <div key={key} className="border rounded-lg p-4 bg-white">
                    <h4 className="font-medium mb-3 flex items-center gap-2 text-gray-700">
                      <Icon className="h-5 w-5 text-gray-500" />
                      {t(`characteristics.categories.${key}`)}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {characteristicsForCategory.map((char) => (
                        <Badge
                          key={char.id}
                          variant="secondary"
                          className={clsx(
                            "font-normal text-sm py-1 px-2.5",
                            CATEGORIES[char.category]?.color
                          )}
                        >
                          {char.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )
              );
            })}
            {initialAssignedIds.size === 0 && (
              <div className="text-center py-8 px-4 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground text-sm">
                  {t("characteristics.empty")}
                </p>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={handleOpenDialog}
                  >
                    <PlusCircle className="size-4 mr-2" />
                    {t("characteristics.addButton")}
                  </Button>
                </DialogTrigger>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{t("characteristics.dialog.title")}</DialogTitle>
          <DialogDescription>
            {t("characteristics.dialog.description")}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <div className="p-3 border rounded-lg space-y-3 bg-slate-50/50">
            <Label>{t("characteristics.selectedLabel")}</Label>
            <div className="flex flex-wrap gap-2 min-h-[2.5rem] max-h-40 overflow-y-auto">
              {assignedCharacteristics.map((char) => (
                <Badge
                  key={char.id}
                  variant="secondary"
                  className={clsx(
                    "flex items-center gap-1.5 py-1",
                    CATEGORIES[char.category]?.color
                  )}
                >
                  <span>{char.name}</span>
                  <button
                    onClick={() => handleTagRemove(char.id)}
                    className="rounded-full hover:bg-black/10 p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {assignedCharacteristics.length === 0 && (
                <p className="text-muted-foreground text-sm p-2">
                  {t("characteristics.searchHint")}
                </p>
              )}
            </div>
          </div>

          <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openCombobox}
                className="w-full justify-between font-normal text-muted-foreground"
              >
                {t("characteristics.addPlaceholder")}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
              <Command>
                <CommandInput placeholder={t("characteristics.searchPlaceholder")} />
                <CommandList>
                  <CommandEmpty>{t("characteristics.noResults")}</CommandEmpty>
                  <CommandGroup>
                    {availableForAdding.map((char) => (
                      <CommandItem
                        key={char.id}
                        value={char.name}
                        onSelect={() => handleTagAdd(char.id)}
                      >
                        <div className="flex-grow">{char.name}</div>
                        <Badge variant="outline" className="ml-2">
                          {t(`characteristics.categories.${char.category}`)}
                        </Badge>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={handleCancel} disabled={isPending}>
            {t("common.cancel")}
          </Button>
          <Button onClick={handleSave} disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("common.saving")}
              </>
            ) : (
              t("common.saveChanges")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AnimalCharacteristicsManager;
