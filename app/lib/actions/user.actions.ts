"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import { rolesWithPermission } from "@/app/lib/actions/auth.actions";
import { Role } from "@prisma/client";
import { cuidSchema } from "../zod-schemas/common.schemas";
import { updateUserFormSchema } from "../zod-schemas/user.schemas";
import { updateUserFormState } from "../error-messages-type";

export const deleteUser = async (id: string) => {
  // Check if the user has permission
  const hasPermission = await rolesWithPermission([Role.ADMIN]);
  if (!hasPermission) {
    throw new Error("Access Denied. Failed to Delete User.");
  }

  // Validate the id at runtime
  const parsedId = cuidSchema.safeParse(id);
  if (!parsedId.success) {
    console.error("Invalid User ID format for deletion:", parsedId.error.flatten().formErrors.join(", "));
    throw new Error("Invalid User ID format.");
  }
  const validatedId = parsedId.data;

  // Delete the user
  try {
    await prisma.user.delete({
      where: { id: validatedId },
    });

    // Revalidate the cache
    revalidatePath("/dashboard/users");
  } catch (error) {
    console.error("Database Error: Failed to Delete User.", error);
    throw new Error("Database Error: Failed to Delete User.");
  }
};

export const updateUser = async (
  id: string,
  prevState: updateUserFormState,
  formData: FormData
) => {
  // Check if the user has permission
  const hasPermission = await rolesWithPermission([Role.ADMIN]);
  if (!hasPermission) {
    throw new Error("Access Denied. Failed to Update User.");
  }

  // Validate the id at runtime
  const parsedId = cuidSchema.safeParse(id);
  if (!parsedId.success) {
    return {
      message: "Invalid User ID. Failed to Update User.",
    };
  }
  const validatedId = parsedId.data;

  // Validate the form data using Zod
  const validatedFields = updateUserFormSchema.safeParse({
    role: formData.get("role"),
  });
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update User.",
    };
  }
  // Prepare data for insertion into the database
  const { role } = validatedFields.data;

  // Update the user in the database
  try {
    await prisma.user.update({
      where: { id: validatedId },
      data: {
        role: role,
      },
    });
  } catch (error) {
    return {
      message: "Database Error: Failed to Update User.",
    };
  }

  // Revalidate the cache
  revalidatePath("/dashboard/users");

  // Redirect to the users page
  redirect("/dashboard/users");
};
