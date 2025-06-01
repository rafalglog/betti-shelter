"use server";

import { unlink } from "fs/promises";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import path from "path";
import { prisma } from "@/app/lib/prisma";
import { rolesWithPermission } from "@/app/lib/actions/auth.actions";
import { validateAndUploadImages } from "@/app/lib/actions/validateAndUpload";
import { Role } from "@prisma/client";
import { cuidSchema } from "../zod-schemas/common.schemas";
import { petLikeSchema, PetFormSchema } from "../zod-schemas/pet.schemas";
import { CreatePetFormState } from "../error-messages-type";

export const createPet = async (
  prevState: CreatePetFormState,
  formData: FormData
) => {
  // Check if the user has permission
  const hasPermission = await rolesWithPermission([Role.ADMIN, Role.STAFF]);
  if (!hasPermission) {
    throw new Error("Access Denied. Failed to Create Pet.");
  }

  // Validate form fields using Zod
  const validatedFields = PetFormSchema.safeParse({
    name: formData.get("name"),
    age: formData.get("age"),
    gender: formData.get("gender"),
    speciesId: formData.get("speciesId"),
    breed: formData.get("breed"),
    weightKg: formData.get("weightKg"),
    heightCm: formData.get("heightCm"),
    city: formData.get("city"),
    state: formData.get("state"),
    description: formData.get("description"),
    listingStatus: formData.get("listingStatus"),
    adoptionStatusId: formData.get("adoptionStatusId"),
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
    age,
    gender,
    speciesId,
    breed,
    weightKg,
    heightCm,
    city,
    state,
    description,
    listingStatus,
    adoptionStatusId,
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
        age: age,
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
        adoptionStatus: {
          connect: {
            id: adoptionStatusId,
          },
        },
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

export const updatePet = async (
  id: string,
  prevState: CreatePetFormState,
  formData: FormData
) => {
  // Check if the user has permission
  const hasPermission = await rolesWithPermission([Role.ADMIN, Role.STAFF]);
  if (!hasPermission) {
    throw new Error("Access Denied. Failed to Update Pet.");
  }

  // Validate the id at runtime
  const parsedId = cuidSchema.safeParse(id);
  if (!parsedId.success) {
    return {
      message: "Invalid Pet ID format.",
    };
  }
  const validatedId = parsedId.data;

  // Validate form fields using Zod
  const validatedFields = PetFormSchema.safeParse({
    name: formData.get("name"),
    age: formData.get("age"),
    gender: formData.get("gender"),
    speciesId: formData.get("speciesId"),
    breed: formData.get("breed"),
    weightKg: formData.get("weightKg"),
    heightCm: formData.get("heightCm"),
    city: formData.get("city"),
    state: formData.get("state"),
    description: formData.get("description"),
    listingStatus: formData.get("listingStatus"),
    adoptionStatusId: formData.get("adoptionStatusId"),
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
    age,
    gender,
    speciesId,
    breed,
    weightKg,
    heightCm,
    city,
    state,
    description,
    listingStatus,
    adoptionStatusId,
  } = validatedFields.data;

  const petImages = formData.getAll("petImages");

  // store the images urls
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
      where: { id: validatedId },
      data: {
        name: name,
        age: age,
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
        adoptionStatus: {
          connect: {
            id: adoptionStatusId,
          },
        },
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
    console.error(`Database Error updating pet ${validatedId}:`, error) 
    return {
      message: "Database Error: Failed to Update Pet.",
    };
  }

  // Revalidate the cache for the /dashboard/pets path and the individual pet page
  // This ensures that the updated pet data is reflected in the UI
  revalidatePath("/dashboard/pets");
  revalidatePath(`/pets/${validatedId}`);

  // Redirect to the /dashboard/pets path
  redirect("/dashboard/pets");
};

export const deletePet = async (id: string) => {
  // Check if the user has permission
  const hasPermission = await rolesWithPermission([Role.ADMIN, Role.STAFF]);
  if (!hasPermission) {
    throw new Error("Access Denied. Failed to Delete Pet.");
  }

  // Validate the id at runtime
  const parsedId = cuidSchema.safeParse(id);
  if (!parsedId.success) {
    console.error(`Invalid Pet ID format for update: ${parsedId.error.flatten().formErrors.join(", ")}`);
    throw new Error("Invalid Pet ID format.");
  }
  const validatedId = parsedId.data;

  // Delete the pet from the database
  try {
    // Consider deleting associated images from storage first
    const petToDelete = await prisma.pet.findUnique({
      where: { id: validatedId },
      include: { petImages: true },
    });

    const failedToDeleteFiles: { url: string; error: string }[] = [];

    if (petToDelete?.petImages && petToDelete.petImages.length > 0) {
      for (const image of petToDelete.petImages) {
        try {
          const filePath = path.join(process.cwd(), "public", image.url);
          await unlink(filePath);
        } catch (fileError: any) {
          const errorMessage = `Failed to delete image file ${image.url} for pet ${validatedId}: ${fileError.message}`;
          console.error(errorMessage, fileError);
          failedToDeleteFiles.push({ url: image.url, error: fileError.message });
        }
      }
    }

    await prisma.pet.delete({
      where: { id: validatedId },
    });

    // Revalidate the cache for the /dashboard/pets path
    revalidatePath("/dashboard/pets");
    revalidatePath(`/pets/${validatedId}`);

    // If there were any file deletion errors, return them
    if (failedToDeleteFiles.length > 0) {
      return {
        message: `Pet deleted successfully, but ${failedToDeleteFiles.length} associated image file(s) could not be deleted. Please check server logs or contact support.`,
        details: failedToDeleteFiles,
      };
    }

  } catch (error) {
    console.error(`Database Error deleting pet ${validatedId}:`, error);
    return {
      message: "Database Error: Failed to Delete Pet.",
    };
  }
};

export const deletePetImage = async (id: string) => {
  // Check if the user has permission
  const hasPermission = await rolesWithPermission([Role.ADMIN, Role.STAFF]);
  if (!hasPermission) {
    throw new Error("Access Denied. Failed to Delete Image.");
  }

  // Validate the id at runtime
  const parsedId = cuidSchema.safeParse(id);
  if (!parsedId.success) {
    console.error(`Invalid Pet ID format for update: ${parsedId.error.flatten().formErrors.join(", ")}`);
    throw new Error("Invalid Pet ID format.");
  }
  const validatedId = parsedId.data; // This is the PetImage ID

  // Delete the image from the database
  try {
    const deletedPetImage = await prisma.petImage.delete({
      where: { id: validatedId },
    });

    // Delete the file from the uploads folder
    const filePath = path.join(process.cwd(), "public", deletedPetImage.url);
    await unlink(filePath);

    revalidatePath("/dashboard/pets");
  } catch (error) {
    console.error(`Database Error deleting image ${validatedId}:`, error);
    throw new Error("Database Error: Failed to Delete Image.");
  }
};

export const createPetLike = async (
  petId: string,
  userId: string
): Promise<void> => {
  const hasPermission = await rolesWithPermission([
    Role.ADMIN,
    Role.STAFF,
    Role.USER,
  ]);
  if (!hasPermission) {
    console.error(
      `Access Denied: User ${userId} (unvalidated) attempted to like pet ${petId} (unvalidated) without permission.`
    );
    throw new Error(
      "Access Denied. You do not have permission to like this pet. Please log in."
    );
  }

  const validatedArgs = petLikeSchema.safeParse({ petId, userId });

  if (!validatedArgs.success) {
    const errorMessages = JSON.stringify(
      validatedArgs.error.flatten().fieldErrors
    );
    console.error(`Validation Error for createPetLike: ${errorMessages}`);
    throw new Error(
      `Invalid pet or user ID provided for liking. Errors: ${errorMessages}`
    );
  }

  const { petId: validatedPetId, userId: validatedUserId } = validatedArgs.data;

  try {
    await prisma.like.create({
      data: {
        petId: validatedPetId,
        userId: validatedUserId,
      },
    });

    // Revalidate the cache for the /pets path and the individual pet page
    revalidatePath("/pets");
    revalidatePath(`/pets/${validatedPetId}`);

  } catch (error: any) {
    if (error.code === "P2002") {
      console.warn(
        `User ${validatedUserId} already liked pet ${validatedPetId}. No action taken.`
      );
      revalidatePath("/pets");
      revalidatePath(`/pets/${validatedPetId}`);
      return;
    }
    console.error(
      `Database Error: Failed to add pet like for pet ${validatedPetId}, user ${validatedUserId}.`,
      error
    );
    throw new Error(
      "Database Error: Failed to add pet to likes. Please try again."
    );
  }
};

export const deletePetLike = async (
  petId: string,
  userId: string
): Promise<void> => {
  const hasPermission = await rolesWithPermission([
    Role.ADMIN,
    Role.STAFF,
    Role.USER,
  ]);
  if (!hasPermission) {
    console.error(
      `Access Denied: User ${userId} (unvalidated) attempted to unlike pet ${petId} (unvalidated) without permission.`
    );
    throw new Error(
      "Access Denied. You do not have permission to unlike this pet."
    );
  }

  const validatedArgs = petLikeSchema.safeParse({ petId, userId });

  if (!validatedArgs.success) {
    const errorMessages = JSON.stringify(
      validatedArgs.error.flatten().fieldErrors
    );
    console.error(`Validation Error for deletePetLike: ${errorMessages}`);
    throw new Error(
      `Invalid pet or user ID for unliking. Errors: ${errorMessages}`
    );
  }

  const { petId: validatedPetId, userId: validatedUserId } = validatedArgs.data;

  try {
    await prisma.like.delete({
      where: {
        userId_petId: {
          petId: validatedPetId,
          userId: validatedUserId,
        },
      },
    });

    revalidatePath("/pets");
    revalidatePath(`/pets/${validatedPetId}`);
  } catch (error: any) {
    if (error.code === "P2025") {
      console.warn(
        `Like not found for user ${validatedUserId} and pet ${validatedPetId} during delete. No action taken.`
      );
      revalidatePath("/pets");
      revalidatePath(`/pets/${validatedPetId}`);
      return;
    }
    console.error(
      `Database Error: Failed to delete pet like for pet ${validatedPetId}, user ${validatedUserId}.`,
      error
    );
    throw new Error(
      "Database Error: Failed to remove pet from likes. Please try again."
    );
  }
};

export const togglePetLike = async (
  petId: string,
  userId: string,
  isCurrentlyLiked: boolean
): Promise<void> => {
  const hasPermission = await rolesWithPermission([
    Role.ADMIN,
    Role.STAFF,
    Role.USER,
  ]);
  if (!hasPermission) {
    console.error(
      `Access Denied: User ${userId} (unvalidated) attempted to toggle like for pet ${petId} (unvalidated) without permission.`
    );
    throw new Error(
      "Access Denied. You do not have permission to change like status for this pet."
    );
  }

  // Validate IDs before passing them to other actions
  const validatedArgs = petLikeSchema.safeParse({ petId, userId });

  if (!validatedArgs.success) {
    const errorMessages = JSON.stringify(
      validatedArgs.error.flatten().fieldErrors
    );
    console.error(`Validation Error for togglePetLike: ${errorMessages} ${petId}, ${userId}`);
    throw new Error(
      `Invalid arguments for toggling like status. Errors: ${errorMessages}`
    );
  }

  const { petId: validatedPetId, userId: validatedUserId } = validatedArgs.data;

  if (isCurrentlyLiked) {
    await deletePetLike(validatedPetId, validatedUserId);
  } else {
    await createPetLike(validatedPetId, validatedUserId);
  }
};