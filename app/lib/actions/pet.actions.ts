"use server";

import { unlink } from "fs/promises";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import path from "path";
import { prisma } from "@/app/lib/prisma";
import { validateAndUploadImages } from "@/app/lib/utils/validateAndUpload";
import { cuidSchema } from "../zod-schemas/common.schemas";
import { PetFormSchema } from "../zod-schemas/pet.schemas";
import { PetFormState } from "../form-state-types";
import {
  RequirePermission,
  SessionUser,
  withAuthenticatedUser,
} from "../auth/protected-actions";
import { Permissions } from "@/app/lib/auth/permissions";

const _createPet = async (
  prevState: PetFormState,
  formData: FormData
): Promise<PetFormState> => {
  // Validate form fields using Zod
  const validatedFields = PetFormSchema.safeParse({
    name: formData.get("name"),
    birthDate: formData.get("birthDate"),
    gender: formData.get("gender"),
    speciesId: formData.get("speciesId"),
    breed: formData.get("breed"),
    weightKg: formData.get("weightKg"),
    heightCm: formData.get("heightCm"),
    city: formData.get("city"),
    state: formData.get("state"),
    description: formData.get("description"),
    listingStatus: formData.get("listingStatus"),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create pet.",
    };
  }

  // Prepare data for insertion into the database
  const {
    name,
    birthDate,
    gender,
    speciesId,
    breed,
    weightKg,
    heightCm,
    city,
    state,
    description,
    listingStatus,
  } = validatedFields.data;

  const petImages = formData.getAll("petImages");
  let imageUrlArray: string[] = [];

  const result = await validateAndUploadImages(petImages);
  if (Array.isArray(result)) {
    // Images were successfully uploaded
    imageUrlArray = result;
  } else {
    // There was an error
    return result;
  }

  // Insert the pet into the database
  try {
    await prisma.pet.create({
      data: {
        name: name,
        birthDate: birthDate,
        gender: gender,
        species: {
          connect: {
            id: speciesId,
          },
        },
        breed: breed,
        weightKg: weightKg,
        heightCm: heightCm,
        city: city,
        state: state,
        description: description,
        listingStatus: listingStatus,
        petImages: {
          create: imageUrlArray.map((url) => ({
            url: url,
          })),
        },
      },
    });
  } catch (error) {
    console.error("Database Error creating pet:", error);
    return {
      message: "Database Error: Failed to Create Pet.",
    };
  }

  // Revalidate the cache for the /dashboard/pets path
  revalidatePath("/dashboard/pets");

  // Redirect to the /dashboard/pets path
  redirect("/dashboard/pets");
};

const _updatePet = async (
  petId: string, // Pet ID from the URL parameters
  prevState: PetFormState,
  formData: FormData
): Promise<PetFormState> => {
  // Validate the petId at runtime
  const parsedPetId = cuidSchema.safeParse(petId);
  if (!parsedPetId.success) {
    return {
      message: "Invalid Pet ID format.",
    };
  }
  const validatedPetId = parsedPetId.data;

  // Validate form fields using Zod
  const validatedFields = PetFormSchema.safeParse({
    name: formData.get("name"),
    birthDate: formData.get("birthDate"),
    gender: formData.get("gender"),
    speciesId: formData.get("speciesId"),
    breed: formData.get("breed"),
    weightKg: formData.get("weightKg"),
    heightCm: formData.get("heightCm"),
    city: formData.get("city"),
    state: formData.get("state"),
    description: formData.get("description"),
    listingStatus: formData.get("listingStatus"),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Pet.",
    };
  }

  // Prepare data for insertion into the database
  const {
    name,
    birthDate,
    gender,
    speciesId,
    breed,
    weightKg,
    heightCm,
    city,
    state,
    description,
    listingStatus,
  } = validatedFields.data;

  const petImages = formData.getAll("petImages");

  // Store the images URLs
  let imageUrlArray: string[] = [];

  // Only validate and upload if new images are provided
  if (petImages.length > 0 && (petImages[0] as File).size > 0) {
    const result = await validateAndUploadImages(petImages);
    if (Array.isArray(result)) {
      // Images were successfully uploaded
      imageUrlArray = result;
    } else {
      // Return the error
      return result;
    }
  }

  // Update the pet in the database
  try {
    await prisma.pet.update({
      where: { id: validatedPetId },
      data: {
        name: name,
        birthDate: birthDate,
        gender: gender,
        species: {
          connect: {
            id: speciesId,
          },
        },
        breed: breed,
        weightKg: weightKg,
        heightCm: heightCm,
        city: city,
        state: state,
        description: description,
        listingStatus: listingStatus,
        // Conditionally update images only if new ones were uploaded
        ...(imageUrlArray.length > 0 && {
          petImages: {
            create: imageUrlArray.map((url) => ({
              url: url,
            })),
          },
        }),
      },
    });
  } catch (error) {
    console.error(`Database Error updating pet ${validatedPetId}:`, error);
    return {
      message: "Database Error: Failed to Update Pet.",
    };
  }

  // Revalidate the cache for the /dashboard/pets path and the individual pet page
  revalidatePath("/dashboard/pets");
  revalidatePath(`/pets/${validatedPetId}`);

  // Redirect to the /dashboard/pets path
  redirect("/dashboard/pets");
};

const _deletePetImage = async (petImageId: string): Promise<void> => {
  // Validate the petImageId at runtime
  const parsedPetImageId = cuidSchema.safeParse(petImageId);
  if (!parsedPetImageId.success) {
    console.error(
      `Invalid PetImage ID format for delete: ${parsedPetImageId.error
        .flatten()
        .formErrors.join(", ")}`
    );
    throw new Error("Invalid PetImage ID format.");
  }
  const validatedPetImageId = parsedPetImageId.data; // This is the PetImage ID

  // Delete the image from the database
  try {
    const deletedPetImage = await prisma.petImage.delete({
      where: { id: validatedPetImageId },
    });

    if (!deletedPetImage) {
      console.error(
        `PetImage with ID ${validatedPetImageId} not found or failed to delete.`
      );
      throw new Error("Image not found or failed to delete from database.");
    }

    // Delete the file from the uploads folder
    const filePath = path.join(process.cwd(), "public", deletedPetImage.url);
    try {
      await unlink(filePath);
    } catch (fileError: any) {
      console.error(
        `Failed to delete image file ${deletedPetImage.url} from filesystem for PetImage ${validatedPetImageId}:`,
        fileError
      );
    }

    revalidatePath("/dashboard/pets");
    // Revalidate the specific pet's edit page and its public page
    if (deletedPetImage.petId) {
      revalidatePath(`/dashboard/pets/${deletedPetImage.petId}/edit`);
      revalidatePath(`/pets/${deletedPetImage.petId}`);
    }
  } catch (error) {
    console.error(
      `Database Error deleting image ${validatedPetImageId}:`,
      error
    );
    throw new Error("Database Error: Failed to Delete Image.");
  }
};

const _togglePetLike = async (
  user: SessionUser, // Injected by withAuthenticatedUser
  petId: string
): Promise<void> => {
  
  const userId = user.id;

  // Validate Pet ID
  const parsedPetId = cuidSchema.safeParse(petId);
  if (!parsedPetId.success) {
    console.error("Invalid Pet ID format in _togglePetLike:", parsedPetId.error);
    throw new Error("Invalid Pet ID format.");
  }
  const validatedPetId = parsedPetId.data;

  let pet;
  try {
    // Fetch the pet from the database
    pet = await prisma.pet.findUnique({
      where: { id: validatedPetId },
      select: { listingStatus: true },
    });
  } catch (error) {
    console.error(`Database error fetching pet ${validatedPetId} in _togglePetLike:`, error);
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
    throw new Error("This pet is not available for interaction at its current status.");
  }

  try {
    // Check if the user has already liked the pet
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_petId: {
          userId: userId,
          petId: validatedPetId,
        },
      },
    });

    if (existingLike) {
      // If like exists, delete it
      await prisma.like.delete({
        where: {
          userId_petId: {
            userId: userId,
            petId: validatedPetId,
          },
        },
      });
    } else {
      // If like does not exist, create it
      await prisma.like.create({
        data: {
          userId: userId,
          petId: validatedPetId,
        },
      });
    }
  } catch (error) {
    console.error(`Database error toggling like for pet ${validatedPetId} and user ${userId}:`, error);
    throw new Error("An error occurred while updating the like status. Please try again.");
  }

  revalidatePath("/pets");
  revalidatePath(`/pets/${validatedPetId}`);
};

// The actions are protected by the permissions defined in the Permissions file.
export const createPet = RequirePermission(Permissions.PET_CREATE)(_createPet);
export const updatePet = RequirePermission(Permissions.PET_UPDATE)(_updatePet);
export const deletePetImage = RequirePermission(Permissions.PET_DELETE_IMAGE)(
  _deletePetImage
);

export const togglePetLike = withAuthenticatedUser(_togglePetLike);
