import { prisma } from "@/app/lib/prisma";
import { Prisma, TaskCategory, TaskStatus } from "@prisma/client";
import { DashboardTasksFilterSchema } from "../../zod-schemas/animal.schemas";

export type FilteredTaskPayload = Prisma.TaskGetPayload<{
  select: {
    id: true;
    title: true;
    details: true;
    status: true;
    priority: true;
    category: true;
    dueDate: true;
    animal: { select: { id: true; name: true } };
    assignee: { select: { id: true; name: true } };
    medicationLog: {
      select: { id: true; schedule: { select: { medicationName: true } } };
    };
    createdBy: { select: { id: true; name: true } };
    createdAt: true;
    updatedAt: true;
  };
}>;

export const fetchFilteredAnimalTasks = async (
  queryInput: string,
  currentPageInput: number,
  categoryInput: string | undefined,
  statusInput: string | undefined,
  pageSizeInput: number,
  sortInput: string | undefined,
  inputAnimalId: string
): Promise<{ tasks: FilteredTaskPayload[]; totalPages: number }> => {
  const validatedArgs = DashboardTasksFilterSchema.safeParse({
    query: queryInput,
    currentPage: currentPageInput,
    category: categoryInput,
    status: statusInput,
    pageSize: pageSizeInput,
    sort: sortInput,
    animalId: inputAnimalId,
  });

  if (!validatedArgs.success) {
    if (process.env.NODE_ENV !== "production") {
      console.error(
        "Zod validation error in fetchFilteredAnimalTasks:",
        validatedArgs.error.flatten()
      );
    }
    throw new Error(
      validatedArgs.error.errors[0]?.message ||
        "Invalid arguments for fetching filtered tasks."
    );
  }

  const { query, currentPage, category, status, pageSize, sort, animalId } =
    validatedArgs.data;

  const orderBy: Prisma.TaskOrderByWithRelationInput = (() => {
    if (!sort) return { createdAt: "desc" }; // Default sort
    const [id, dir] = sort.split(".");
    return { [id]: dir === "desc" ? "desc" : "asc" };
  })();

  // The where clause is updated to filter by animalId if it's provided
  const whereClause: Prisma.TaskWhereInput = {
    ...(animalId && { animalId: animalId }),
    title: { contains: query, mode: "insensitive" },
    ...(category && {
      category: { in: category.split(",") as TaskCategory[] },
    }),
    ...(status && {
      status: { in: status.split(",") as TaskStatus[] },
    }),
  };

  try {
    const offset = (currentPage - 1) * pageSize;

    const [totalCount, tasks] = await prisma.$transaction([
      prisma.task.count({ where: whereClause }),
      prisma.task.findMany({
        where: whereClause,
        select: {
          id: true,
          title: true,
          details: true,
          status: true,
          priority: true,
          category: true,
          dueDate: true,
          animal: { select: { id: true, name: true } },
          assignee: { select: { id: true, name: true } },
          medicationLog: {
            select: {
              id: true,
              schedule: { select: { medicationName: true } },
            },
          },
          createdBy: { select: { id: true, name: true } },
          createdAt: true,
          updatedAt: true,
        },
        orderBy: orderBy,
        take: pageSize,
        skip: offset,
      }),
    ]);

    const totalPages = Math.ceil(totalCount / pageSize);

    return { tasks, totalPages };
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error fetching tasks:", error);
    }
    throw new Error("Error fetching tasks.");
  }
};

export type FetchAnimalTaskByIdPayload = Prisma.TaskGetPayload<{
  select: {
    id: true;
    title: true;
    details: true;
    status: true;
    priority: true;
    category: true;
    dueDate: true;
    animal: { select: { id: true; name: true } };
    assignee: { select: { id: true; name: true } };
    medicationLog: {
      select: { id: true; schedule: { select: { medicationName: true } } };
    };
    createdBy: { select: { id: true; name: true } };
    createdAt: true;
    updatedAt: true;
  };
}>;

export const fetchAnimalTaskById = async (
  id: string
): Promise<FetchAnimalTaskByIdPayload | null> => {
  try {
    const task = await prisma.task.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        details: true,
        status: true,
        priority: true,
        category: true,
        dueDate: true,
        animal: { select: { id: true, name: true } },
        assignee: { select: { id: true, name: true } },
        medicationLog: {
          select: { id: true, schedule: { select: { medicationName: true } } },
        },
        createdBy: { select: { id: true, name: true } },
        createdAt: true,
        updatedAt: true,
      },
    });
    return task;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error(`Error fetching task with ID ${id}:`, error);
    }
    throw new Error(`Error fetching task with ID ${id}.`);
  }
};
