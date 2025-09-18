"use client";

import React, { useState, useMemo } from "react";
import { formatDistanceToNowStrict, format } from "date-fns";
import { clsx } from "clsx";
import {
  ArrowUpDown,
  Filter,
  MoreHorizontal,
  PlusCircle,
  X,
} from "lucide-react";

// --- SHADCN/UI IMPORTS ---
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Note } from "@prisma/client";
import { FilteredNotePayload } from "@/app/lib/data/animals/animal-note.data";

const NOTE_CATEGORIES = {
  BEHAVIORAL: {
    label: "Behavioral",
    color: "bg-blue-100 text-blue-800 border-blue-200",
  },

  MEDICAL: {
    label: "Medical",
    color: "bg-red-100 text-red-800 border-red-200",
  },

  FEEDING: {
    label: "Feeding",
    color: "bg-amber-100 text-amber-800 border-amber-200",
  },

  GENERAL: {
    label: "General",
    color: "bg-gray-100 text-gray-800 border-gray-200",
  },

  ADOPTION_UPDATE: {
    label: "Adoption Update",
    color: "bg-purple-100 text-purple-800 border-purple-200",
  },

  FOSTER_UPDATE: {
    label: "Foster Update",
    color: "bg-green-100 text-green-800 border-green-200",
  },
} as const;

type NoteCategory = keyof typeof NOTE_CATEGORIES;

// type Note = {
//   id: string;
//   category: NoteCategory;
//   content: string;
//   createdBy: string;
//   createdAt: string; // ISO string format
// };

// --- MOCK DATA ---

// const initialNotes: Note[] = [
//   {
//     id: "note1",
//     category: "BEHAVIORAL",
//     content:
//       "Seems anxious during thunderstorms but is generally calm. Responds well to gentle petting and a quiet environment.",
//     createdBy: "Alice Johnson",
//     createdAt: "2024-10-26T10:00:00Z",
//   },
//   {
//     id: "note2",
//     category: "MEDICAL",
//     content:
//       "Completed course of antibiotics for a minor ear infection on 10/25. Follow-up vet appointment scheduled for 11/05.",
//     createdBy: "Dr. Smith",
//     createdAt: "2024-10-25T15:30:00Z",
//   },
//   {
//     id: "note3",
//     category: "FEEDING",
//     content:
//       "Is a bit of a picky eater. Prefers wet food over dry kibble. Currently on a diet of 1/2 can of salmon pate twice a day.",
//     createdBy: "Bob Williams",
//     createdAt: "2024-10-24T08:45:00Z",
//   },

//   {
//     id: "note4",
//     category: "FOSTER_UPDATE",
//     content:
//       "Fido is settling in well at his foster home. He loves playing with their resident dog and enjoys his daily walks in the park.",
//     createdBy: "Carol White",
//     createdAt: "2024-10-22T18:00:00Z",
//   },
//   {
//     id: "note5",
//     category: "GENERAL",
//     content:
//       "Loves belly rubs and will roll over for them instantly. Not a fan of having his nails trimmed.",
//     createdBy: "Alice Johnson",
//     createdAt: "2024-10-20T11:20:00Z",
//   },
// ];

// --- END MOCK DATA ---

const NOTE_CATEGORY_KEYS = Object.keys(NOTE_CATEGORIES) as NoteCategory[];

type CreateEditNoteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (noteData: { content: string; category: NoteCategory }) => void;
  noteToEdit?: Note | null;
};

const CreateEditNoteDialog = ({
  open,
  onOpenChange,
  onSave,
  noteToEdit,
}: CreateEditNoteDialogProps) => {
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<NoteCategory | "">("");
  const [error, setError] = useState("");
  const isEditMode = !!noteToEdit;
  React.useEffect(() => {
    if (open) {
      setContent(noteToEdit?.content || "");
      setCategory(noteToEdit?.category || "");
      setError("");
    }
  }, [open, noteToEdit]);

  const handleSave = () => {
    if (!content.trim()) {
      setError("Note content cannot be empty.");
      return;
    }

    if (!category) {
      setError("Please select a category.");
      return;
    }
    onSave({ content, category: category as NoteCategory });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Note" : "Create New Note"}
          </DialogTitle>

          <DialogDescription>
            {isEditMode
              ? "Update the details for this note."
              : "Add a new note for this pet. Select a category and provide details."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="category">Category</Label>
            <Select
              onValueChange={(value) => setCategory(value as NoteCategory)}
              value={category}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {NOTE_CATEGORY_KEYS.map((key) => (
                  <SelectItem key={key} value={key}>
                    {NOTE_CATEGORIES[key].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-3">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[120px]"
              placeholder="Write your note here..."
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground text-right mt-1">
              {content.length} / 500
            </p>
          </div>

          {error && <p className="text-center text-sm text-red-500">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>

          <Button onClick={handleSave}>
            {isEditMode ? "Save Changes" : "Create Note"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

type DeleteConfirmationDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

const DeleteConfirmationDialog = ({
  open,
  onOpenChange,
  onConfirm,
}: DeleteConfirmationDialogProps) => {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>

          <DialogDescription>
            Are you sure you want to delete this note? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <p className="text-sm text-gray-700">
            Deleting this note will permanently remove it from the system.
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>

          <Button variant="destructive" onClick={handleConfirm}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface Props {
  notes: FilteredNotePayload[];
  totalPages: number;
}

// --- MAIN COMPONENT ---
const AnimalNotes = ({notes, totalPages}: Props) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] =
    useState(false);
  const [noteToDeleteId, setNoteToDeleteId] = useState<string | null>(null);
  // State for filtering and sorting
  const [filterCategory, setFilterCategory] = useState<NoteCategory | "all">(
    "all"
  );
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  // const handleCreateClick = () => {
  //   setNoteToEdit(null);
  //   setIsDialogOpen(true);
  // };
  // const handleEditClick = (note: Note) => {
  //   setNoteToEdit(note);
  //   setIsDialogOpen(true);
  // };
  // const handleDeleteClick = (id: string) => {
  //   setNoteToDeleteId(id);
  //   setIsConfirmDeleteDialogOpen(true);
  // };
  // const handleConfirmDelete = () => {
  //   setNotes((prevNotes) => prevNotes.filter((n) => n.id !== noteToDeleteId));
  //   setNoteToDeleteId(null);
  // };

  // const handleSaveNote = (noteData: {
  //   content: string;
  //   category: NoteCategory;
  // }) => {
  //   if (noteToEdit) {
  //     // Update existing note
  //     setNotes((prevNotes) =>
  //       prevNotes.map((n) =>
  //         n.id === noteToEdit.id ? { ...n, ...noteData } : n
  //       )
  //     );
  //   } else {
  //     // Create new note
  //     const newNote: Note = {
  //       id: `note-${Date.now()}`,
  //       ...noteData,
  //       createdBy: "Current User",
  //       createdAt: new Date().toISOString(),
  //     };
  //     setNotes((prevNotes) => [newNote, ...prevNotes]);
  //   }
  // };

  // Memoized filtered and sorted notes

  // const filteredAndSortedNotes = useMemo(() => {
  //   return notes
  //     .filter((note) => {
  //       if (filterCategory === "all") return true;

  //       return note.category === filterCategory;
  //     })
  //     .sort((a, b) => {
  //       const dateA = new Date(a.createdAt).getTime();
  //       const dateB = new Date(b.createdAt).getTime();
  //       return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  //     });
  // }, [notes, filterCategory, sortOrder]);

  // Helper function to format date for display (relative or full)
  // const getFormattedDate = (dateString: string) => {
  //   const date = new Date(dateString);
  //   // For the tooltip, always show the full date
  //   const fullDate = format(date, "PPP p"); // e.g., "October 26th, 2024, 10:00 AM"
  //   // For the main display, use relative time
  //   const relativeTime = formatDistanceToNowStrict(date, { addSuffix: true });
  //   return { display: relativeTime, tooltip: fullDate };
  // };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Pet Notes</CardTitle>

          <CardDescription>
            Keep track of important notes about this pet.
          </CardDescription>

          <CardAction>
            <Button variant="default" size="sm">
              <PlusCircle className="mr-1 size-4" />
              Add Note
            </Button>
          </CardAction>

          {/* Filter and Sort Controls */}
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="category-filter" className="sr-only text-sm font-medium">
                Filter by:
              </Label>

              <div className="relative">
                <Select
                  value={filterCategory}
                  onValueChange={(value) =>
                    setFilterCategory(value as NoteCategory | "all")
                  }
                >
                  <SelectTrigger id="category-filter" className="w-[230px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {NOTE_CATEGORY_KEYS.map((key) => (
                      <SelectItem key={key} value={key}>
                        {NOTE_CATEGORIES[key].label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {filterCategory !== "all" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 absolute right-8 top-1/2 -translate-y-1/2"
                    onClick={() => setFilterCategory("all")}
                  >
                    <X className="h-4 w-4 text-muted-foreground" />
                  </Button>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Label htmlFor="sort-order" className="sr-only text-sm font-medium">
                Sort by:
              </Label>

              <Select
                value={sortOrder}
                onValueChange={(value) =>
                  setSortOrder(value as "newest" | "oldest")
                }
              >
                <SelectTrigger id="sort-order" className="w-[160px]">
                  <ArrowUpDown className="size-4 mr-2" />
                  <SelectValue placeholder="Select order" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>

                  <SelectItem value="oldest">Oldest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {filteredAndSortedNotes.length > 0 ? (
              filteredAndSortedNotes.map((note) => (
                <div
                  key={note.id}
                  className="border rounded-lg p-4 relative group"
                >
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditClick(note)}>
                          Edit
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => handleDeleteClick(note.id)}
                          className="text-red-500 focus:text-red-500"
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <Badge
                        variant="outline"
                        className={clsx(
                          "font-semibold",

                          NOTE_CATEGORIES[note.category].color
                        )}
                      >
                        {NOTE_CATEGORIES[note.category].label}
                      </Badge>

                      <p className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">
                        {note.content}
                      </p>

                      <div className="text-xs text-gray-500 mt-3">
                        <span>{note.createdBy}</span> &middot;{" "}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="underline decoration-dotted cursor-help">
                              {getFormattedDate(note.createdAt).display}
                            </span>
                          </TooltipTrigger>

                          <TooltipContent>
                            {getFormattedDate(note.createdAt).tooltip}
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-12 border-2 border-dashed rounded-lg">
                <p className="font-semibold text-lg">No Matching Notes Found</p>

                <p className="text-sm mt-1">
                  Try adjusting your filters or creating a new note.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <CreateEditNoteDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSaveNote}
        noteToEdit={noteToEdit}
      />

      <DeleteConfirmationDialog
        open={isConfirmDeleteDialogOpen}
        onOpenChange={setIsConfirmDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}

export default AnimalNotes;