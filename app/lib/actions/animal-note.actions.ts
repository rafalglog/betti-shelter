"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/prisma";
import { cuidSchema } from "../zod-schemas/common.schemas";
import {
  RequirePermission,
  SessionUser,
  withAuthenticatedUser,
} from "../auth/protected-actions";
import { Permissions } from "@/app/lib/auth/permissions";
import { NoteFormSchema } from "../zod-schemas/pet.schemas";

export interface AnimalNoteFormState {
  message?: string | null;
  errors?: {
    category?: string[];
    content?: string[];
  };
}

const _createAnimalNote = async (
  user: SessionUser, // Injected by withAuthenticatedUser
  animalId: string,
  prevState: AnimalNoteFormState,
  formData: FormData
): Promise<AnimalNoteFormState> => {
  const NoteAuthorId = user.personId;

  const parsedAnimalId = cuidSchema.safeParse(animalId);
  if (!parsedAnimalId.success) {
    if (process.env.NODE_ENV !== "production") {
      console.error(
        "Zod validation error in createAnimalNote:",
        parsedAnimalId.error.flatten()
      );
    }
    throw new Error(
      parsedAnimalId.error.errors[0]?.message || "Invalid animal ID format."
    );
  }

  const validatedFields = NoteFormSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing or invalid fields. Failed to create animal.",
    };
  }

  const { category, content } = validatedFields.data;

  try {
    await prisma.note.create({
      data: {
        category: category,
        content: content,
        animalId: parsedAnimalId.data,
        authorId: NoteAuthorId,
      },
    });
  } catch (error) {
    console.error("Database Error creating notes:", error);
    return {
      message: "Database Error: Failed to create notes.",
    };
  }

  console.log("Note created successfully.");
  revalidatePath(`dashboard/animals/${animalId}/notes`);

  return {
    message: "Note created successfully.",
  };
};

const _updateAnimalNote = async (
  noteId: string,
  animalId: string,
  prevState: AnimalNoteFormState,
  formData: FormData
): Promise<AnimalNoteFormState> => {
  const parsedNoteId = cuidSchema.safeParse(noteId);
  if (!parsedNoteId.success) {
    if (process.env.NODE_ENV !== "production") {
      console.error(
        "Zod validation error in updateAnimalNote:",
        parsedNoteId.error.flatten()
      );
    }
    throw new Error("Invalid animal ID format.");
  }

  // Validate the animal ID
  const parsedAnimalId = cuidSchema.safeParse(animalId);
  if (!parsedAnimalId.success) {
    if (process.env.NODE_ENV !== "production") {
      console.error(
        "Zod validation error in updateAnimalNote:",
        parsedAnimalId.error.flatten()
      );
    }
    throw new Error("Invalid animal ID format.");
  }

  // Validate the form fields
  const validatedFields = NoteFormSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing or invalid fields. Failed to update note.",
    };
  }

  const { category, content } = validatedFields.data;

  try {
    await prisma.note.update({
      where: {
        id: parsedNoteId.data,
        animalId: parsedAnimalId.data,
      },
      data: {
        category: category,
        content: content,
      },
    });
  } catch (error) {
    console.error("Database Error updating note:", error);
    return {
      message: "Database Error: Failed to update note.",
    };
  }

  console.log("Note updated successfully.");
  revalidatePath(`dashboard/animals/${animalId}/notes`);
  return {
    message: "Note updated successfully.",
  };
};

export const createAnimalNote = withAuthenticatedUser(
  RequirePermission(Permissions.ANIMAL_CREATE)(_createAnimalNote)
);

export const updateAnimalNote = RequirePermission(Permissions.ANIMAL_UPDATE)(
  _updateAnimalNote
);

const _deleteAnimalNote = async (noteId: string, animalId: string) => {
  const parsedNoteId = cuidSchema.safeParse(noteId);
  if (!parsedNoteId.success) {
    throw new Error("Invalid note ID format.");
  }
  
  try {
    await prisma.note.update({
      where: {
        id: parsedNoteId.data,
      },
      data: {
        deletedAt: new Date(),
      },
    });
    revalidatePath(`/dashboard/animals/${animalId}/notes`);
    return { message: "Note deleted successfully." };
  } catch (error) {
    console.error("Database Error deleting note:", error);
    return {
      message: "Database Error: Failed to delete note.",
    };
  }
};

const _restoreAnimalNote = async (noteId: string, animalId: string) => {
  const parsedNoteId = cuidSchema.safeParse(noteId);
  if (!parsedNoteId.success) {
    throw new Error("Invalid note ID format.");
  }

  try {
    await prisma.note.update({
      where: {
        id: parsedNoteId.data,
      },
      data: {
        deletedAt: null,
      },
    });

    revalidatePath(`/dashboard/animals/${animalId}/notes`);
    return { message: "Note restored successfully." };
  } catch (error) {
    console.error("Database Error restoring note:", error);
    return {
      message: "Database Error: Failed to restore note.",
    };
  }
};

export const deleteAnimalNote = RequirePermission(Permissions.ANIMAL_CREATE)(
  _deleteAnimalNote
);

export const restoreAnimalNote = RequirePermission(Permissions.ANIMAL_CREATE)(
  _restoreAnimalNote
);
