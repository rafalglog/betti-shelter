import { prisma } from "@/app/lib/prisma";
import { Prisma, NoteCategory } from "@prisma/client";
import {
  cuidSchema,
  currentPageSchema,
} from "../../zod-schemas/common.schemas";
import z from "zod";
import { Permissions } from "@/app/lib/auth/permissions";
import { RequirePermission } from "../../auth/protected-actions";

export type FilteredNotePayload = Prisma.NoteGetPayload<{
  select: {
    id: true;
    content: true;
    category: true;
    createdAt: true;
    updatedAt: true;
    deletedAt: true;
    author: {
      select: {
        id: true;
        name: true;
      };
    };
  };
}>;

export const DashboardNotesFilterSchema = z.object({
  currentPage: currentPageSchema,
  animalId: cuidSchema,
  category: z.string().optional(),
  sort: z.string().optional(),
  showDeleted: z.boolean().optional(),
});
const NOTES_PER_PAGE = 10;

const _fetchFilteredAnimalNotes = async (
  currentPageInput: number,
  categoryInput: string | undefined,
  sortInput: string | undefined,
  inputAnimalId: string,
  showDeleted: boolean = false
): Promise<{ notes: FilteredNotePayload[]; totalPages: number }> => {
  // Validate and parse the input arguments using the Zod schema
  const validatedArgs = DashboardNotesFilterSchema.safeParse({
    currentPage: currentPageInput,
    category: categoryInput,
    sort: sortInput,
    animalId: inputAnimalId,
    showDeleted,
  });
  // If validation fails, log the error and throw an exception
  if (!validatedArgs.success) {
    if (process.env.NODE_ENV !== "production") {
      console.error(
        "Zod validation error in fetchFilteredAnimalNotes:",
        validatedArgs.error.flatten()
      );
    }
    throw new Error(
      validatedArgs.error.errors[0]?.message ||
        "Invalid arguments for fetching filtered notes."
    );
  }

  const { currentPage, category, sort, animalId, showDeleted: includeDeleted } = validatedArgs.data;
  // Determine the sorting order for the query, defaulting to newest first
  const orderBy: Prisma.NoteOrderByWithRelationInput = (() => {
    if (!sort) return { createdAt: "desc" };
    const [id, dir] = sort.split(".");
    return { [id]: dir === "desc" ? "desc" : "asc" };
  })();
  // Construct the 'where' clause for the Prisma query based on filters
  const whereClause: Prisma.NoteWhereInput = {
    animalId: animalId,
    ...(category && {
      category: { in: category.split(",") as NoteCategory[] },
    }),
    ...(includeDeleted ? {} : { deletedAt: null }),
  };
  try {
    // Calculate the offset for pagination
    const offset = (currentPage - 1) * NOTES_PER_PAGE;
    // Use a transaction to fetch the total count and the notes data in one go
    const [totalCount, notes] = await prisma.$transaction([
      prisma.note.count({ where: whereClause }),
      prisma.note.findMany({
        where: whereClause,
        select: {
          id: true,
          content: true,
          category: true,
          createdAt: true,
          updatedAt: true,
          deletedAt: true,
          author: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: orderBy,
        take: NOTES_PER_PAGE, // Limit the number of records returned
        skip: offset, // Skip records for pagination
      }),
    ]);
    // Calculate the total number of pages
    const totalPages = Math.ceil(totalCount / NOTES_PER_PAGE);
    return { notes, totalPages };
  } catch (error) {
    // Catch and handle any database errors
    if (process.env.NODE_ENV !== "production") {
      console.error("Error fetching notes:", error);
    }
    throw new Error("Error fetching notes.");
  }
};

export type FetchAnimalNoteByIdPayload = Prisma.NoteGetPayload<{
  select: {
    id: true;
    category: true;
    content: true;
  };
}>;

// Renamed: Internal function is now prefixed with an underscore
const _fetchAnimalNoteById = async (
  id: string
): Promise<FetchAnimalNoteByIdPayload | null> => {
  try {
    const note = await prisma.note.findUnique({
      where: { id },
      select: {
        id: true,
        category: true,
        content: true,
      },
    });
    return note;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error(`Error fetching note with ID ${id}:`, error);
    }
    throw new Error(`Error fetching note with ID ${id}.`);
  }
};

// Added: Export the protected version of the function
export const fetchAnimalNoteById = RequirePermission(
  Permissions.ANIMAL_READ_DETAIL
)(_fetchAnimalNoteById);

export const fetchFilteredAnimalNotes = RequirePermission(
  Permissions.ANIMAL_READ_DETAIL
)(_fetchFilteredAnimalNotes);