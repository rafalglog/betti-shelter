"use server";

import bcrypt from "bcrypt";
import crypto from "crypto";
import { prisma } from "@/app/lib/prisma";
import { RegisterSchema } from "@/app/lib/zod-schemas/auth.schemas";
import { RegisterFormState } from "@/app/lib/form-state-types";
import { Role } from "@prisma/client";
import { sendVerificationEmail } from "@/lib/email";

const hashToken = (token: string) =>
  crypto.createHash("sha256").update(token).digest("hex");

export const registerUser = async (
  prevState: RegisterFormState,
  formData: FormData
): Promise<RegisterFormState> => {
  const validated = RegisterSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
      message: "Please fix the highlighted errors.",
    };
  }

  const { name, email, password } = validated.data;

  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existingUser) {
    return {
      message: "If an account exists, you will receive a verification email.",
      success: true,
    };
  }

  const existingPerson = await prisma.person.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existingPerson) {
    return {
      message: "If an account exists, you will receive a verification email.",
      success: true,
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 hours

  try {
    await prisma.$transaction(async (tx) => {
      const person = await tx.person.create({
        data: {
          name,
          email,
        },
      });

      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          role: Role.USER,
          mustChangePassword: false,
          person: { connect: { id: person.id } },
        },
      });

      await tx.emailVerificationToken.create({
        data: {
          tokenHash,
          userId: user.id,
          expiresAt,
        },
      });
    });
  } catch (error) {
    console.error("Failed to register user:", error);
    return { message: "Database error: Could not create account." };
  }

  try {
    await sendVerificationEmail(email, token);
  } catch (error) {
    console.error("Failed to send verification email:", error);
    return {
      message:
        "Your account was created, but email sending is not configured.",
    };
  }

  return {
    success: true,
    message: "Please check your email to verify your account.",
  };
};

export const verifyEmailToken = async (token: string) => {
  if (!token) {
    return { success: false, message: "Verification token is missing." };
  }

  const tokenHash = hashToken(token);

  const record = await prisma.emailVerificationToken.findUnique({
    where: { tokenHash },
    select: { userId: true, expiresAt: true },
  });

  if (!record || record.expiresAt < new Date()) {
    return {
      success: false,
      message: "Verification token is invalid or expired.",
    };
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: { emailVerified: new Date() },
    }),
    prisma.emailVerificationToken.deleteMany({
      where: { userId: record.userId },
    }),
  ]);

  return { success: true, message: "Your email has been verified." };
};
