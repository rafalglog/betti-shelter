"use server";

import { unlink } from "fs/promises";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import path from "path";
import { prisma } from "@/app/lib/prisma";
import { validateAndUploadImages } from "@/app/lib/utils/validateAndUpload";
import { cuidSchema } from "../zod-schemas/common.schemas";
import { IntakeFormSchema, TaskFormSchema } from "../zod-schemas/pet.schemas";
import { AnimalFormState, AnimalTaskFormState } from "../form-state-types";
import {
  RequirePermission,
  SessionUser,
  withAuthenticatedUser,
} from "../auth/protected-actions";
import { Permissions } from "@/app/lib/auth/permissions";
import { AnimalSize, IntakeType, PersonType } from "@prisma/client";

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

  const validatedFields = IntakeFormSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing or invalid fields. Failed to create intake record.",
    };
  }

  const {
    animalName,
    estimatedBirthDate,
    sex,
    healthStatus,
    microchipNumber,
    description,
    species: speciesId, // ID from the form
    breed: breedId, // ID from the form
    primaryColor: primaryColorId, // ID from the form
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
    // MODIFIED: Transaction logic updated
    await prisma.$transaction(async (tx) => {
      // Step 1: Get species name for the 'getAnimalSize' function.
      // This is the only lookup needed now.
      const speciesRecord = await tx.species.findUnique({
        where: { id: speciesId },
        select: { name: true },
      });

      if (!speciesRecord) {
        // This should ideally not happen if form validation is correct
        throw new Error("Invalid Species ID provided.");
      }

      // Calculate the size based on weight and species name
      const calculatedSize = getAnimalSize(
        speciesRecord.name,
        weightKg as number | null
      );

      // Step 2: Handle conditional person creation (logic is unchanged)
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

      // Step 3: Create the Animal record using the IDs directly
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
          // Add the species connection
          species: { connect: { id: speciesId } },
          breeds: { connect: { id: breedId } },
          colors: { connect: { id: primaryColorId } },
        },
      });

      // Step 4: Create the Intake record (logic is unchanged)
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

// const _updatePet = async (
//   animalId: string, // Pet ID from the URL parameters
//   prevState: AnimalFormState,
//   formData: FormData
// ): Promise<AnimalFormState> => {
//   // Validate the petId at runtime
//   const parsedAnimaltId = cuidSchema.safeParse(animalId);
//   if (!parsedAnimaltId.success) {
//     return {
//       message: "Invalid Pet ID format.",
//     };
//   }
//   const validatedPetId = parsedAnimaltId.data;

//   // Validate form fields using Zod
//   const validatedFields = IntakeFormSchema.safeParse({
//     name: formData.get("name"),
//     birthDate: formData.get("birthDate"),
//     sex: formData.get("sex"),
//     speciesId: formData.get("speciesId"),
//     breed: formData.get("breed"),
//     weightKg: formData.get("weightKg"),
//     heightCm: formData.get("heightCm"),
//     city: formData.get("city"),
//     state: formData.get("state"),
//     description: formData.get("description"),
//     listingStatus: formData.get("listingStatus"),
//   });

//   // If form validation fails, return errors early. Otherwise, continue.
//   if (!validatedFields.success) {
//     return {
//       errors: validatedFields.error.flatten().fieldErrors,
//       message: "Missing Fields. Failed to Update Pet.",
//     };
//   }

//   // Prepare data for insertion into the database
//   const {
//     name,
//     birthDate,
//     sex,
//     weightKg,
//     heightCm,
//     city,
//     state,
//     description,
//     listingStatus,
//   } = validatedFields.data;

//   // Update the pet in the database
//   try {
//     await prisma.animal.update({
//       where: { id: validatedPetId },
//       data: {
//         name: name,
//         birthDate: birthDate,
//         sex: sex,
//         // species: {
//         //   connect: {
//         //     id: speciesId,
//         //   },
//         // },
//         // breed: breed,
//         weightKg: weightKg,
//         heightCm: heightCm,
//         city: city,
//         state: state,
//         description: description,
//         listingStatus: listingStatus,
//         // Conditionally update images only if new ones were uploaded
//         // ...(imageUrlArray.length > 0 && {
//         //   animalImages: {
//         //     create: imageUrlArray.map((url) => ({
//         //       url: url,
//         //     })),
//         //   },
//         // }),
//       },
//     });
//   } catch (error) {
//     console.error(`Database Error updating pet ${validatedPetId}:`, error);
//     return {
//       message: "Database Error: Failed to Update Pet.",
//     };
//   }

//   // Revalidate the cache for the /dashboard/pets path and the individual pet page
//   revalidatePath("/dashboard/pets");
//   revalidatePath(`/pets/${validatedPetId}`);

//   // Redirect to the /dashboard/pets path
//   redirect("/dashboard/pets");
// };

// const _deletePetImage = async (animalImageId: string): Promise<void> => {
//   // Validate the petImageId at runtime
//   const parsedAnimalImageId = cuidSchema.safeParse(animalImageId);
//   if (!parsedAnimalImageId.success) {
//     console.error(
//       `Invalid PetImage ID format for delete: ${parsedAnimalImageId.error
//         .flatten()
//         .formErrors.join(", ")}`
//     );
//     throw new Error("Invalid PetImage ID format.");
//   }
//   const validatedPetImageId = parsedAnimalImageId.data; // This is the PetImage ID

//   // Delete the image from the database
//   try {
//     const deletedPetImage = await prisma.animalImage.delete({
//       where: { id: validatedPetImageId },
//     });

//     if (!deletedPetImage) {
//       console.error(
//         `PetImage with ID ${validatedPetImageId} not found or failed to delete.`
//       );
//       throw new Error("Image not found or failed to delete from database.");
//     }

//     // Delete the file from the uploads folder
//     const filePath = path.join(process.cwd(), "public", deletedPetImage.url);
//     try {
//       await unlink(filePath);
//     } catch (fileError: any) {
//       console.error(
//         `Failed to delete image file ${deletedPetImage.url} from filesystem for PetImage ${validatedPetImageId}:`,
//         fileError
//       );
//     }

//     revalidatePath("/dashboard/pets");
//     // Revalidate the specific pet's edit page and its public page
//     if (deletedPetImage.animalId) {
//       revalidatePath(`/dashboard/pets/${deletedPetImage.animalId}/edit`);
//       revalidatePath(`/pets/${deletedPetImage.animalId}`);
//     }
//   } catch (error) {
//     console.error(
//       `Database Error deleting image ${validatedPetImageId}:`,
//       error
//     );
//     throw new Error("Database Error: Failed to Delete Image.");
//   }
// };

const _togglePetLike = async (
  user: SessionUser, // Injected by withAuthenticatedUser
  animalId: string
): Promise<void> => {
  const userId = user.id;

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
          userId: userId,
          animalId: validatedAnimalId,
        },
      },
    });

    if (existingLike) {
      // If like exists, delete it
      await prisma.like.delete({
        where: {
          userId_animalId: {
            userId: userId,
            animalId: validatedAnimalId,
          },
        },
      });
    } else {
      // If like does not exist, create it
      await prisma.like.create({
        data: {
          userId: userId,
          animalId: validatedAnimalId,
        },
      });
    }
  } catch (error) {
    console.error(
      `Database error toggling like for pet ${validatedAnimalId} and user ${userId}:`,
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
export const togglePetLike = withAuthenticatedUser(_togglePetLike);
