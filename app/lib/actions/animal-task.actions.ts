"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/prisma";
import { cuidSchema } from "../zod-schemas/common.schemas";
import { AnimalTaskFormState } from "../form-state-types";
import {
  RequirePermission,
  SessionUser,
  withAuthenticatedUser,
} from "../auth/protected-actions";
import { Permissions } from "@/app/lib/auth/permissions";
import { TaskFormSchema } from "../zod-schemas/pet.schemas";
import { TaskStatus } from "@prisma/client";

const _createAnimalTask = async (
  user: SessionUser, // Injected by withAuthenticatedUser
  animalId: string,
  prevState: AnimalTaskFormState,
  formData: FormData
): Promise<AnimalTaskFormState> => {
  const taskCreatorId = user.personId;

  const parsedId = cuidSchema.safeParse(animalId);
  if (!parsedId.success) {
    if (process.env.NODE_ENV !== "production") {
      console.error(
        "Zod validation error in createAnimalTask:",
        parsedId.error.flatten()
      );
    }
    throw new Error(
      parsedId.error.errors[0]?.message || "Invalid animal ID format."
    );
  }

  const validatedFields = TaskFormSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing or invalid fields. Failed to create task.",
    };
  }

  const { title, details, status, category, priority, dueDate, assigneeId } =
    validatedFields.data;

  try {
    await prisma.task.create({
      data: {
        title: title,
        details: details,
        status: status, // Prisma will use default if undefined
        category: category,
        priority: priority, // Prisma will use default if undefined
        dueDate: dueDate,
        animalId: parsedId.data,
        assigneeId: assigneeId,
        createdById: taskCreatorId, // Assign the task creator
      },
    });
  } catch (error) {
    console.error("Database Error creating task:", error);
    return {
      message: "Database Error: Failed to create task.",
    };
  }

  console.log("Task created successfully.");
  revalidatePath(`dashboard/animals/${animalId}/tasks`);

  return {
    message: "Task created successfully.",
  };
};

const _updateAnimalTask = async (
  taskId: string,
  animalId: string,
  prevState: AnimalTaskFormState,
  formData: FormData
): Promise<AnimalTaskFormState> => {
  // Validate the task ID
  const parsedTaskId = cuidSchema.safeParse(taskId);
  if (!parsedTaskId.success) {
    if (process.env.NODE_ENV !== "production") {
      console.error(
        "Zod validation error in updateAnimalTask (taskId):",
        parsedTaskId.error.flatten()
      );
    }
    throw new Error("Invalid task ID format.");
  }

  // Validate the animal ID
  const parsedAnimalId = cuidSchema.safeParse(animalId);
  if (!parsedAnimalId.success) {
    if (process.env.NODE_ENV !== "production") {
      console.error(
        "Zod validation error in updateAnimalTask (animalId):",
        parsedAnimalId.error.flatten()
      );
    }
    throw new Error("Invalid animal ID format.");
  }

  // Validate the form fields
  const validatedFields = TaskFormSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing or invalid fields. Failed to update task.",
    };
  }

  const { title, details, status, category, priority, dueDate, assigneeId } =
    validatedFields.data;

  try {
    // Update the task in the database
    await prisma.task.update({
      where: {
        id: parsedTaskId.data,
        animalId: parsedAnimalId.data, // Ensures the task belongs to the correct animal
      },
      data: {
        title: title,
        details: details,
        status: status,
        category: category,
        priority: priority,
        dueDate: dueDate,
        assigneeId: assigneeId,
        // Note: createdById is not updated as it should be immutable.
      },
    });
  } catch (error) {
    console.error("Database Error updating task:", error);
    return {
      message: "Database Error: Failed to update task.",
    };
  }

  console.log("Task updated successfully.");
  revalidatePath(`dashboard/animals/${animalId}/tasks`);
  return {
    message: "Task updated successfully.",
  };
};

const _updateTaskStatus = async (
  animalId: string,
  taskId: string,
  status: TaskStatus
): Promise<{ message: string }> => {
  const parsedTaskId = cuidSchema.safeParse(taskId);
  if (!parsedTaskId.success) {
    throw new Error("Invalid task ID format.");
  }

  const parsedAnimalId = cuidSchema.safeParse(animalId);
  if (!parsedAnimalId.success) {
    throw new Error("Invalid animal ID format.");
  }

  try {
    await prisma.task.update({
      where: { id: parsedTaskId.data },
      data: { status: status },
    });
  } catch (error) {
    console.error("Database Error updating task status:", error);
    return { message: "Database Error: Failed to update task status." };
  }

  revalidatePath(`/dashboard/animals/${animalId}/tasks`);
  return { message: `Task status updated to ${status}.` };
};


export const updateAnimalTaskStatus = RequirePermission(Permissions.ANIMAL_UPDATE)(
  _updateTaskStatus
);

export const updateAnimalTask = RequirePermission(Permissions.ANIMAL_UPDATE)(
  _updateAnimalTask
);
export const createAnimalTask = withAuthenticatedUser(
  RequirePermission(Permissions.ANIMAL_CREATE)(_createAnimalTask)
);
