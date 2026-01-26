"use server";

import bcrypt from "bcrypt";
import crypto from "crypto";
import { prisma } from "@/app/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { RequirePermission } from "@/app/lib/auth/protected-actions";
import { Permissions } from "@/app/lib/auth/permissions";
import {
  AdminResetPasswordSchema,
  ChangePasswordSchema,
  RequestPasswordResetSchema,
  ResetPasswordSchema,
} from "@/app/lib/zod-schemas/password.schemas";
import { PasswordFormState } from "@/app/lib/form-state-types";
import { sendPasswordResetEmail } from "@/lib/email";

const hashToken = (token: string) =>
  crypto.createHash("sha256").update(token).digest("hex");

export const changePassword = async (
  prevState: PasswordFormState,
  formData: FormData
): Promise<PasswordFormState> => {
  const session = await auth();
  if (!session?.user?.id) {
    return { message: "You must be signed in to change your password." };
  }

  const validated = ChangePasswordSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
      message: "Please fix the highlighted errors.",
    };
  }

  const { currentPassword, newPassword } = validated.data;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { password: true },
  });

  if (!user) {
    return { message: "User not found." };
  }

  if (user.password) {
    if (!currentPassword) {
      return {
        errors: { currentPassword: ["Current password is required."] },
      };
    }

    const matches = await bcrypt.compare(currentPassword, user.password);
    if (!matches) {
      return {
        errors: { currentPassword: ["Current password is incorrect."] },
      };
    }
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      password: hashedPassword,
      mustChangePassword: false,
    },
  });

  revalidatePath("/dashboard/settings");

  return {
    success: true,
    message: "Password updated successfully.",
  };
};

export const requestPasswordReset = async (
  prevState: PasswordFormState,
  formData: FormData
): Promise<PasswordFormState> => {
  const validated = RequestPasswordResetSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
      message: "Please enter a valid email address.",
    };
  }

  const { email } = validated.data;

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  // Always return a generic response to avoid user enumeration.
  if (!user) {
    return {
      success: true,
      message: "If an account exists, you will receive a reset email shortly.",
    };
  }

  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

  await prisma.$transaction([
    prisma.passwordResetToken.deleteMany({
      where: { userId: user.id },
    }),
    prisma.passwordResetToken.create({
      data: {
        tokenHash,
        userId: user.id,
        expiresAt,
      },
    }),
  ]);

  try {
    await sendPasswordResetEmail(email, token);
  } catch (error) {
    console.error("Failed to send reset email:", error);
    return { message: "Email sending is not configured." };
  }

  return {
    success: true,
    message: "If an account exists, you will receive a reset email shortly.",
  };
};

export const resetPassword = async (
  prevState: PasswordFormState,
  formData: FormData
): Promise<PasswordFormState> => {
  const validated = ResetPasswordSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
      message: "Please fix the highlighted errors.",
    };
  }

  const { token, password } = validated.data;
  const tokenHash = hashToken(token);

  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
    select: { userId: true, expiresAt: true },
  });

  if (!resetToken || resetToken.expiresAt < new Date()) {
    return {
      errors: { token: ["Reset token is invalid or expired."] },
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: resetToken.userId },
      data: {
        password: hashedPassword,
        mustChangePassword: false,
      },
    }),
    prisma.passwordResetToken.deleteMany({
      where: { userId: resetToken.userId },
    }),
  ]);

  return {
    success: true,
    message: "Your password has been reset. You can sign in now.",
  };
};

const _adminResetUserPassword = async (
  userId: string,
  password: string,
  confirmPassword: string
) => {
  const validated = AdminResetPasswordSchema.safeParse({
    userId,
    password,
    confirmPassword,
  });

  if (!validated.success) {
    return {
      success: false,
      message: validated.error.issues[0]?.message || "Invalid input.",
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        mustChangePassword: true,
      },
    }),
    prisma.passwordResetToken.deleteMany({
      where: { userId },
    }),
  ]);

  revalidatePath("/dashboard/users");

  return {
    success: true,
    message: "Temporary password set. User must change it on next login.",
  };
};

export const adminResetUserPassword = RequirePermission(
  Permissions.MANAGE_ROLES
)(_adminResetUserPassword);
