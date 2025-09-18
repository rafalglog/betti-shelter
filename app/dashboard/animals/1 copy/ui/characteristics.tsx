"use client";

import React, { useState, useMemo, useEffect } from "react";
import { clsx } from "clsx";
import {
  X,
  PlusCircle,
  Pencil,
  HeartPulse,
  Stethoscope,
  Home,
  FileText,
} from "lucide-react";

// --- SHADCN/UI IMPORTS ---
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// --- TYPES ---
const CATEGORIES = {
  BEHAVIOR: {
    label: "Behavior",
    color: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100",
    icon: HeartPulse,
  },
  MEDICAL: {
    label: "Medical",
    color: "bg-red-100 text-red-800 border-red-200 hover:bg-red-100",
    icon: Stethoscope,
  },
  ENVIRONMENT: {
    label: "Environment",
    color: "bg-green-100 text-green-800 border-green-200 hover:bg-green-100",
    icon: Home,
  },
  ADMINISTRATIVE: {
    label: "Administrative",
    color: "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-100",
    icon: FileText,
  },
} as const;

type CategoryKey = keyof typeof CATEGORIES;

type Characteristic = {
  id: string;
  name: string;
  category: CategoryKey;
};

type Pet = {
  id: string;
  name: string;
  characteristicIds: string[];
};

// MOCK DATA
const initialCharacteristics: Characteristic[] = [
  { id: "char1", name: "Bite History", category: "BEHAVIOR" },
  { id: "char2", name: "On-Leash Reactivity", category: "BEHAVIOR" },
  { id: "char3", name: "Crate Trained", category: "BEHAVIOR" },
  { id: "char4", name: "Heartworm Positive", category: "MEDICAL" },
  { id: "char5", name: "Deaf", category: "MEDICAL" },
  { id: "char6", name: "Good with Kids", category: "ENVIRONMENT" },
  { id: "char7", name: "Housebroken", category: "ENVIRONMENT" },
  { id: "char8", name: "Good with other dogs", category: "ENVIRONMENT" },
  { id: "char9", name: "Adoption Fee Waived", category: "ADMINISTRATIVE" },
  { id: "char10", name: "Requires Experienced Owner", category: "BEHAVIOR" },
];

const initialPetData: Pet = {
  id: "pet123",
  name: "Fido",
  characteristicIds: ["char2", "char5", "char6"],
};
// END MOCK DATA

const CATEGORY_KEYS = Object.keys(CATEGORIES) as CategoryKey[];

type CreateCharacteristicDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (newChar: { name: string; category: CategoryKey }) => void;
  newTagName: string;
};

const CreateCharacteristicDialog = ({
  open,
  onOpenChange,
  onCreate,
  newTagName,
}: CreateCharacteristicDialogProps) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<CategoryKey | "">("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setName(newTagName);
      setCategory("");
      setError("");
    }
  }, [open, newTagName]);

  const handleCreate = () => {
    if (!name.trim()) {
      setError("Tag name cannot be empty.");
      return;
    }
    if (!category) {
      setError("Please select a category.");
      return;
    }
    onCreate({ name: name.trim(), category });
    onOpenChange(false);
  };

  // THE FIX: Always render the Dialog component and pass the `open` and `onOpenChange`
  // props to it. Radix UI (which powers shadcn/ui) will handle the mounting,
  // unmounting, and animations correctly.
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Characteristic</DialogTitle>
          <DialogDescription>
            Add a new tag to the system. It will be available for all pets once
            created.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <Select
              onValueChange={(value) => setCategory(value as CategoryKey)}
              value={category}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORY_KEYS.map((key) => (
                  <SelectItem key={key} value={key}>
                    {CATEGORIES[key].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {error && (
            <p className="col-span-4 text-center text-sm text-red-500">
              {error}
            </p>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate}>Create and Apply</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// --- MAIN COMPONENT ---
export const PetCharacteristicsManager = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [allCharacteristics, setAllCharacteristics] = useState(
    initialCharacteristics
  );
  const [petCharacteristicIds, setPetCharacteristicIds] = useState(
    new Set(initialPetData.characteristicIds)
  );
  const [stagedChanges, setStagedChanges] = useState(
    new Set(initialPetData.characteristicIds)
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const petCharacteristics = useMemo(() => {
    const idSource = isEditing ? stagedChanges : petCharacteristicIds;
    return allCharacteristics.filter((char) => idSource.has(char.id));
  }, [isEditing, petCharacteristicIds, stagedChanges, allCharacteristics]);

  const groupedCharacteristics = useMemo(() => {
    return petCharacteristics.reduce<Record<CategoryKey, Characteristic[]>>(
      (acc, char) => {
        (acc[char.category] = acc[char.category] || []).push(char);
        return acc;
      },
      {} as Record<CategoryKey, Characteristic[]>
    );
  }, [petCharacteristics]);

  const availableCharacteristics = useMemo(() => {
    if (!searchQuery) return [];
    return allCharacteristics.filter(
      (char) =>
        !stagedChanges.has(char.id) &&
        char.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allCharacteristics, stagedChanges, searchQuery]);

  const handleEdit = () => {
    setStagedChanges(new Set(petCharacteristicIds));
    setIsEditing(true);
  };
  const handleCancel = () => {
    setStagedChanges(new Set());
    setIsEditing(false);
  };
  const handleSave = () => {
    setPetCharacteristicIds(stagedChanges);
    setIsEditing(false);
  };

  const handleTagRemove = (charId: string) => {
    const newStagedChanges = new Set(stagedChanges);
    newStagedChanges.delete(charId);
    setStagedChanges(newStagedChanges);
  };

  const handleTagAdd = (charId: string) => {
    const newStagedChanges = new Set(stagedChanges);
    newStagedChanges.add(charId);
    setStagedChanges(newStagedChanges);
    setSearchQuery("");
  };

  const handleCreateNew = (newChar: {
    name: string;
    category: CategoryKey;
  }) => {
    const createdChar = { ...newChar, id: `char${Date.now()}` };
    setAllCharacteristics((prev) => [...prev, createdChar]);
    handleTagAdd(createdChar.id);
  };

  const doesQueryMatchExisting = useMemo(() => {
    if (!searchQuery) return true;
    return allCharacteristics.some(
      (c) => c.name.toLowerCase() === searchQuery.toLowerCase()
    );
  }, [searchQuery, allCharacteristics]);

  const showDropdown = isSearchFocused && searchQuery;

  return (
    <>
      <Card className="">
        <CardHeader>
          <CardTitle>Pet Characteristics</CardTitle>
          <CardDescription>
            Track and manage this pet&apos;s unique characteristics.
          </CardDescription>
          <CardAction>
            {!isEditing && (
              <Button variant="default" size="sm" onClick={handleEdit}>
                <Pencil className="size-4 mr-1" />
                Edit
              </Button>
            )}
          </CardAction>
        </CardHeader>

        <CardContent>
          {isEditing ? (
            <div className="flex flex-col gap-4">
              <div className="p-3 border rounded-lg space-y-3">
                <Label>Selected Characteristics</Label>
                <div className="flex flex-wrap gap-2 min-h-[2.5rem]">
                  {petCharacteristics.map((char) => (
                    <Badge
                      key={char.id}
                      variant="secondary"
                      className={clsx(
                        "flex items-center gap-1.5",
                        CATEGORIES[char.category].color
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
                  {petCharacteristics.length === 0 && (
                    <p className="text-muted-foreground text-sm p-2">
                      Select characteristics below.
                    </p>
                  )}
                </div>
              </div>
              <div className="relative">
                <Input
                  placeholder="Search or add characteristics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() =>
                    setTimeout(() => setIsSearchFocused(false), 150)
                  }
                />
                {showDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-popover border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    <ul>
                      {availableCharacteristics.map((char) => (
                        <li
                          key={char.id}
                          onMouseDown={() => handleTagAdd(char.id)}
                          className="p-3 hover:bg-accent cursor-pointer flex justify-between items-center text-sm"
                        >
                          <span>{char.name}</span>
                          <Badge variant="outline">
                            {CATEGORIES[char.category].label}
                          </Badge>
                        </li>
                      ))}
                      {!doesQueryMatchExisting && (
                        <li
                          onMouseDown={() => setIsDialogOpen(true)}
                          className="p-3 hover:bg-accent cursor-pointer flex items-center gap-2 text-sm text-primary font-semibold"
                        >
                          <PlusCircle className="h-4 w-4" /> Create "
                          {searchQuery}"
                        </li>
                      )}
                      {availableCharacteristics.length === 0 &&
                        doesQueryMatchExisting && (
                          <li className="p-3 text-sm text-muted-foreground text-center">
                            No matching characteristics found.
                          </li>
                        )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {CATEGORY_KEYS.map((key) => {
                const Icon = CATEGORIES[key].icon;
                return (
                  groupedCharacteristics[key] &&
                  groupedCharacteristics[key].length > 0 && (
                    <div key={key} className="border rounded-lg p-4 bg-white">
                      <h4 className="font-medium mb-3 flex items-center gap-2 text-gray-700">
                        <Icon className="h-5 w-5 text-gray-500" />
                        {CATEGORIES[key].label}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {groupedCharacteristics[key].map((char) => (
                          <Badge
                            key={char.id}
                            variant="secondary"
                            className={clsx(
                              "font-normal text-sm py-1 px-2.5",
                              CATEGORIES[char.category].color
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
              {petCharacteristics.length === 0 && (
                <p className="text-muted-foreground text-sm">
                  This pet has no characteristics assigned.
                </p>
              )}
            </div>
          )}
        </CardContent>
        {isEditing && (
          <CardFooter className="flex justify-end gap-2">
            <Button variant="ghost" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </CardFooter>
        )}
      </Card>

      <CreateCharacteristicDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onCreate={handleCreateNew}
        newTagName={searchQuery}
      />
    </>
  );
};
