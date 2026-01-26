"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { Role } from "@prisma/client";
import { prisma } from "@/app/lib/prisma";
import { cuidSchema } from "../zod-schemas/common.schemas";
import { RequirePermission } from "../auth/protected-actions";
import { Permissions } from "../auth/permissions";
import { UserCreateSchema } from "../zod-schemas/user.schemas";
import { UserFormState } from "../form-state-types";
import { redirect } from "next/navigation";
import bcrypt from "bcrypt";

// Define a Zod schema for input validation
const UpdateUserRoleSchema = z.object({
  userId: cuidSchema,
  // Ensure the role is one of the valid, non-admin enum values
  role: z.enum(Role).refine((role) => role !== Role.ADMIN, {
    error: "Assigning the Admin role is not permitted here.",
  }),
});

const _updateUserRole = async (userId: string, newRole: Role) => {
  const validation = UpdateUserRoleSchema.safeParse({ userId, role: newRole });

  if (!validation.success) {
    return {
      success: false,
      message: validation.error.issues[0]?.message || "Invalid input provided.",
    };
  }

  const { userId: validatedUserId, role: validatedRole } = validation.data;

  try {
    await prisma.user.update({
      where: {
        id: validatedUserId,
        // As a safeguard, ensure we're not updating an ADMIN role
        NOT: {
          role: Role.ADMIN,
        },
      },
      data: {
        role: validatedRole,
      },
    });

    revalidatePath("/dashboard/users");

    return {
      success: true,
      message: "User role updated successfully.",
    };
  } catch (error) {
    console.error("Failed to update user role:", error);
    return {
      success: false,
      message: "Database error: Could not update the user's role.",
    };
  }
};

export const updateUserRole = RequirePermission(Permissions.MANAGE_ROLES)(
  _updateUserRole
);

const _createUser = async (
  prevState: UserFormState,
  formData: FormData
): Promise<UserFormState> => {
  const validatedFields = UserCreateSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing or invalid fields. Failed to create user.",
    };
  }

  const { name, email, role, password } = validatedFields.data;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      return {
        message: "A user with this email already exists.",
      };
    }

    const existingPerson = await prisma.person.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingPerson) {
      return {
        message:
          "A person with this email already exists. Use a different email.",
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.$transaction(async (tx) => {
      const person = await tx.person.create({
        data: {
          name,
          email,
        },
      });

      await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          role,
          mustChangePassword: true,
          person: { connect: { id: person.id } },
        },
      });
    });
  } catch (error) {
    console.error("Failed to create user:", error);
    return {
      message: "Database error: Could not create the user.",
    };
  }

  revalidatePath("/dashboard/users");
  redirect("/dashboard/users");
};

export const createUser = RequirePermission(Permissions.MANAGE_ROLES)(
  _createUser
);
