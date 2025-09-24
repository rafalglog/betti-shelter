"use server";

import { unlink } from "fs/promises";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import path from "path";
import { prisma } from "@/app/lib/prisma";
import { validateAndUploadImages } from "@/app/lib/utils/validateAndUpload";
import { cuidSchema } from "../zod-schemas/common.schemas";
import { AnimalFormSchema } from "../zod-schemas/animal.schemas";
import { AnimalFormState } from "../form-state-types";
import {
  RequirePermission,
  SessionUser,
  withAuthenticatedUser,
} from "../auth/protected-actions";
import { Permissions } from "@/app/lib/auth/permissions";
import { AnimalActivityType, AnimalSize, IntakeType, PersonType } from "@prisma/client";

const _createAnimal = async (
  user: SessionUser, // Injected by withAuthenticatedUser
  prevState: AnimalFormState,
  formData: FormData
): Promise<AnimalFormState> => {
  const staffMemberId = user.personId;

  if (!staffMemberId) {
    return {
      message:
        "Authentication Error: Your user account is not associated with a person record.",
    };
  }

  const validatedFields = AnimalFormSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing or invalid fields. Failed to create intake record.",
    };
  }

  if (!validatedFields.data.intakeType || !validatedFields.data.intakeDate) {
    return {
      message:
        "Intake type and date are required to create a new animal record.",
    };
  }

  const {
    animalName,
    estimatedBirthDate,
    sex,
    healthStatus,
    microchipNumber,
    description,
    species: speciesId,
    breed: breedId,
    primaryColor: primaryColorId,
    intakeType,
    intakeDate,
    notes,
    sourcePartnerId,
    foundAddress,
    foundCity,
    foundState,
    surrenderingPersonName,
    surrenderingPersonPhone,
    weightKg,
    heightCm,
  } = validatedFields.data;

  try {
    await prisma.$transaction(async (tx) => {
      const speciesRecord = await tx.species.findUnique({
        where: { id: speciesId },
        select: { name: true },
      });

      if (!speciesRecord) {
        throw new Error("Invalid Species ID provided.");
      }

      // Calculate the size based on weight and species name
      const calculatedSize = getAnimalSize(
        speciesRecord.name,
        weightKg as number | null
      );

      let surrenderingPersonId: string | undefined;
      if (intakeType === IntakeType.OWNER_SURRENDER && surrenderingPersonName) {
        const person = await tx.person.create({
          data: {
            name: surrenderingPersonName,
            phone: surrenderingPersonPhone,
            type: PersonType.INDIVIDUAL,
          },
        });
        surrenderingPersonId = person.id;
      }

      const newAnimal = await tx.animal.create({
        data: {
          name: animalName,
          birthDate: estimatedBirthDate,
          sex: sex,
          size: calculatedSize,
          description: description,
          weightKg: weightKg ? Number(weightKg) : undefined,
          heightCm: heightCm ? Number(heightCm) : undefined,
          healthStatus: healthStatus,
          microchipNumber: microchipNumber,
          city: validatedFields.data.foundCity || null,
          state: validatedFields.data.foundState || null,
          species: { connect: { id: speciesId } },
          breeds: { connect: { id: breedId } },
          colors: { connect: { id: primaryColorId } },
        },
      });

      await tx.intake.create({
        data: {
          type: intakeType,
          intakeDate: intakeDate,
          notes: notes,
          animalId: newAnimal.id,
          staffMemberId: staffMemberId,
          sourcePartnerId:
            intakeType === IntakeType.TRANSFER_IN ? sourcePartnerId : undefined,
          surrenderingPersonId:
            intakeType === IntakeType.OWNER_SURRENDER
              ? surrenderingPersonId
              : undefined,
          foundAddress:
            intakeType === IntakeType.STRAY ? foundAddress : undefined,
          foundCity: intakeType === IntakeType.STRAY ? foundCity : undefined,
          foundState: intakeType === IntakeType.STRAY ? foundState : undefined,
        },
      });
      
      await tx.animalActivityLog.create({
        data: {
          animalId: newAnimal.id,
          activityType: AnimalActivityType.INTAKE_PROCESSED,
          changedById: staffMemberId,
          changeSummary: `Animal was admitted as ${intakeType
            .replace(/_/g, " ")
            .toLowerCase()}.`,
        },
      });

    });
  } catch (error) {
    console.error("Database Error creating intake record:", error);
    return {
      message: "Database Error: Failed to create intake record.",
    };
  }

  console.log("Animal created successfully.");
  revalidatePath("/dashboard/animals");
  redirect("/dashboard/animals");
};

const _updateAnimal = async (
  user: SessionUser, // Injected by withAuthenticatedUser
  animalId: string,
  prevState: AnimalFormState,
  formData: FormData
): Promise<AnimalFormState> => {
  const parsedId = cuidSchema.safeParse(animalId);
  if (!parsedId.success) {
    return { message: "Invalid Animal ID." };
  }
  const validatedAnimalId = parsedId.data;

  const validatedFields = AnimalFormSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing or invalid fields. Failed to update animal.",
    };
  }

  const {
    animalName,
    estimatedBirthDate,
    sex,
    healthStatus,
    microchipNumber,
    description,
    species: speciesId,
    breed: breedId,
    primaryColor: primaryColorId,
    weightKg,
    heightCm,
    city,
    state,
    notes,
  } = validatedFields.data;

  const numericWeight = weightKg === "" ? undefined : weightKg;
  const numericHeight = heightCm === "" ? undefined : heightCm;

  try {
    await prisma.$transaction(async (tx) => {
      // Fetch species name to calculate the size
      const speciesRecord = await tx.species.findUnique({
        where: { id: speciesId },
        select: { name: true },
      });

      if (!speciesRecord) {
        throw new Error("Invalid Species ID provided.");
      }

      // Re-calculate size based on potentially updated weight/species
      const calculatedSize = getAnimalSize(
        speciesRecord.name,
        numericWeight as number | null
      );

      if (notes !== undefined) {
        // Find the intake record associated with this animal
        const intakeRecord = await tx.intake.findFirst({
          where: { animalId: validatedAnimalId },
          select: { id: true },
        });

        if (intakeRecord) {
          await tx.intake.update({
            where: { id: intakeRecord.id },
            data: { notes: notes },
          });
        }
      }

      await tx.animal.update({
        where: { id: validatedAnimalId },
        data: {
          name: animalName,
          birthDate: estimatedBirthDate,
          sex: sex,
          size: calculatedSize,
          description: description,
          weightKg: numericWeight,
          heightCm: numericHeight,
          healthStatus: healthStatus,
          microchipNumber: microchipNumber,
          city: city,
          state: state,
          species: { connect: { id: speciesId } },
          breeds: { set: [{ id: breedId }] },
          colors: { set: [{ id: primaryColorId }] },
        },
      });
    });
  } catch (error) {
    console.error("Database Error updating animal:", error);
    return {
      message: "Database Error: Failed to update animal record.",
    };
  }

  // Revalidate paths to clear cache and show updated data
  revalidatePath("/dashboard/animals");
  revalidatePath(`/dashboard/animals/${validatedAnimalId}`);
  redirect(`/dashboard/animals/${validatedAnimalId}`);
};

/**
 * Calculates the animal's size category based on its species and weight.
 * @param speciesName The name of the species (e.g., "Dog", "Cat").
 * @param weightKg The animal's weight in kilograms.
 * @returns The calculated AnimalSize enum or null if unable to determine.
 */
const getAnimalSize = (
  speciesName: string,
  weightKg: number | undefined | null
): AnimalSize | null => {
  if (!weightKg || weightKg <= 0) {
    return null;
  }

  const species = speciesName.toLowerCase();

  if (species === "dog") {
    if (weightKg < 10) return AnimalSize.SMALL;
    if (weightKg < 25) return AnimalSize.MEDIUM;
    if (weightKg < 45) return AnimalSize.LARGE;
    return AnimalSize.XLARGE;
  }

  if (species === "cat") {
    if (weightKg < 4) return AnimalSize.SMALL;
    if (weightKg < 7) return AnimalSize.MEDIUM;
    return AnimalSize.LARGE;
  }

  // A generic fallback for other species
  if (weightKg < 5) return AnimalSize.SMALL;
  if (weightKg < 20) return AnimalSize.MEDIUM;
  return AnimalSize.LARGE;
};

const _togglePetLike = async (
  user: SessionUser, // Injected by withAuthenticatedUser
  animalId: string
): Promise<void> => {
  const personId = user.personId;

  // Validate Pet ID
  const parsedPetId = cuidSchema.safeParse(animalId);
  if (!parsedPetId.success) {
    console.error(
      "Invalid Pet ID format in _togglePetLike:",
      parsedPetId.error
    );
    throw new Error("Invalid Pet ID format.");
  }
  const validatedAnimalId = parsedPetId.data;

  let pet;
  try {
    // Fetch the pet from the database
    pet = await prisma.animal.findUnique({
      where: { id: validatedAnimalId },
      select: { listingStatus: true },
    });
  } catch (error) {
    console.error(
      `Database error fetching pet ${validatedAnimalId} in _togglePetLike:`,
      error
    );
    throw new Error("Failed to retrieve pet information. Please try again.");
  }

  // Check if the pet exists and is likeable
  if (!pet) {
    throw new Error("Pet not found.");
  }

  const isLikeableStatus =
    pet.listingStatus === "PUBLISHED" ||
    pet.listingStatus === "PENDING_ADOPTION";

  if (!isLikeableStatus) {
    throw new Error(
      "This pet is not available for interaction at its current status."
    );
  }

  try {
    // Check if the user has already liked the pet
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_animalId: {
          userId: personId,
          animalId: validatedAnimalId,
        },
      },
    });

    if (existingLike) {
      // If like exists, delete it
      await prisma.like.delete({
        where: {
          userId_animalId: {
            userId: personId,
            animalId: validatedAnimalId,
          },
        },
      });
    } else {
      // If like does not exist, create it
      await prisma.like.create({
        data: {
          userId: personId,
          animalId: validatedAnimalId,
        },
      });
    }
  } catch (error) {
    console.error(
      `Database error toggling like for pet ${validatedAnimalId} and user ${personId}:`,
      error
    );
    throw new Error(
      "An error occurred while updating the like status. Please try again."
    );
  }

  revalidatePath("/pets");
  revalidatePath(`/pets/${validatedAnimalId}`);
};

export const createAnimal = withAuthenticatedUser(
  RequirePermission(Permissions.ANIMAL_CREATE)(_createAnimal)
);

export const updateAnimal = withAuthenticatedUser(
  RequirePermission(Permissions.ANIMAL_UPDATE)(_updateAnimal)
);

export const togglePetLike = withAuthenticatedUser(_togglePetLike);
