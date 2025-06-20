"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import { Permissions } from "@/app/lib/auth/permissions";
import { cuidSchema } from "../zod-schemas/common.schemas";
import { updateUserRoleFormSchema } from "../zod-schemas/user.schemas";
import { UpdateUserFormState } from "../form-state-types";
import { RequirePermission } from "../auth/protected-actions";

const _updateUserRole = async (
  userId: string,
  prevState: UpdateUserFormState,
  formData: FormData
): Promise<UpdateUserFormState> => {

  // Validate the userId at runtime
  const parsedUserId = cuidSchema.safeParse(userId);
  if (!parsedUserId.success) {
    return {
      message: "Invalid User ID format.",
    };
  }
  const validatedUserId = parsedUserId.data;

  // Validate the form data using Zod
  const validatedFields = updateUserRoleFormSchema.safeParse({
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
      where: { id: validatedUserId },
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

export const updateUserRole = RequirePermission(Permissions.MANAGE_ROLES)(_updateUserRole);