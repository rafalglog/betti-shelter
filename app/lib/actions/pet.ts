"use server";

import { unlink } from "fs/promises";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import path from "path";
import { prisma } from "@/app/lib/prisma";
import { rolesWithPermission } from "@/app/lib/actions/authorization";
import { idSchema } from "@/app/lib/zod-schemas/common";
import { validateAndUploadImages } from "@/app/lib/utils/validateAndUpload";
import { Role, Gender } from "@prisma/client";

// Define a schema for the pet form
const PetFormSchema = z.object({
  name: z.string().min(1),
  age: z.coerce
    .number()
    .gt(0, { message: "Please enter an age greater than 0." }),
  gender: z.nativeEnum(Gender, {
    required_error: "Please select a gender.",
    invalid_type_error: "Invalid gender selected.",
  }),
  species_id: z.string(),
  breed: z.string(),
  weight: z.coerce
    .number()
    .gt(0, { message: "Please enter an weight greater than 0." }),
  height: z.coerce
    .number()
    .gt(0, { message: "Please enter an height greater than 0." }),
  city: z.string(),
  state: z.string(),
  description: z.string(),
  published: z.enum(["true", "false"], {
    invalid_type_error: "Please select a status.",
  }),
  adoption_status_id: z.string(),
});

// Define a schema for PetLike
const createPetIdUserIdSchema = z.object({
  parsedPetId: z.string(),
  parsedUserId: z.string(),
});

// Error messages for the pet form
export type CreatePetFormState = {
  errors?: {
    name?: string[];
    age?: string[];
    gender?: string[];
    species_id?: string[];
    breed?: string[];
    weight?: string[];
    height?: string[];
    city?: string[];
    state?: string[];
    description?: string[];
    published?: string[];
    adoption_status_id?: string[];
    petImages?: string[];
  };
  message?: string | null;
};

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
    species_id: formData.get("species_id"),
    breed: formData.get("breed"),
    weight: formData.get("weight"),
    height: formData.get("height"),
    city: formData.get("city"),
    state: formData.get("state"),
    description: formData.get("description"),
    published: formData.get("published"),
    adoption_status_id: formData.get("adoption_status_id"),
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
    species_id,
    breed,
    weight,
    height,
    city,
    state,
    description,
    published,
    adoption_status_id,
  } = validatedFields.data;

  const petImages = formData.getAll("petImages");

  // store the images urls
  let imageUrlArray: string[] = [];

  const result = await validateAndUploadImages(petImages);
  if (Array.isArray(result)) {
    // Images were successfully uploaded
    imageUrlArray = result;
  } else {
    // There was an error
    return result;
  }

  // Convert the published value to a boolean
  const publishedToBoolean = published === "true" ? true : false;

  // Insert the pet into the database
  try {
    await prisma.pet.create({
      data: {
        name: name,
        age: age,
        gender: gender,
        species: {
          connect: {
            id: species_id,
          },
        },
        breed: breed,
        weight: weight,
        height: height,
        city: city,
        state: state,
        description: description,
        published: publishedToBoolean,
        adoptionStatus: {
          connect: {
            id: adoption_status_id,
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
  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) {
    throw new Error("Invalid ID format.");
  }
  const validatedId = parsedId.data;

  // Validate form fields using Zod
  const validatedFields = PetFormSchema.safeParse({
    name: formData.get("name"),
    age: formData.get("age"),
    gender: formData.get("gender"),
    species_id: formData.get("species_id"),
    breed: formData.get("breed"),
    weight: formData.get("weight"),
    height: formData.get("height"),
    city: formData.get("city"),
    state: formData.get("state"),
    description: formData.get("description"),
    published: formData.get("published"),
    adoption_status_id: formData.get("adoption_status_id"),
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
    species_id,
    breed,
    weight,
    height,
    city,
    state,
    description,
    published,
    adoption_status_id,
  } = validatedFields.data;

  const petImages = formData.getAll("petImages");

  // store the images urls
  let imageUrlArray: string[] = [];

  const result = await validateAndUploadImages(petImages);
  if (Array.isArray(result)) {
    // Images were successfully uploaded
    imageUrlArray = result;
  } else {
    // Return the error
    return result;
  }

  // Convert the published value to a boolean
  const publishedToBoolean = published === "true" ? true : false;

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
            id: species_id,
          },
        },
        breed: breed,
        weight: weight,
        height: height,
        city: city,
        state: state,
        description: description,
        published: publishedToBoolean,
        adoptionStatus: {
          connect: {
            id: adoption_status_id,
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
    return {
      message: "Database Error: Failed to Update Pet.",
    };
  }

  // Revalidate the cache for the /dashboard/pets path
  revalidatePath("/dashboard/pets");

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
  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) {
    throw new Error("Invalid ID format.");
  }
  const validatedId = parsedId.data;

  // Delete the pet from the database
  try {
    await prisma.pet.delete({
      where: { id: validatedId },
    });

    // Revalidate the cache for the /dashboard/pets path
    revalidatePath("/dashboard/pets");
  } catch (error) {
    return {
      message: "Database Error: Failed to Create Pet.",
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
  const parsedId = idSchema.safeParse(id);
  if (!parsedId.success) {
    throw new Error("Invalid ID format.");
  }
  const validatedId = parsedId.data;

  // Delete the image from the database
  try {
    const deletedPetImage = await prisma.petImage.delete({
      where: { id: validatedId },
    });

    // Delete the file from the uploads folder
    const filePath = path.join(process.cwd(), "public", deletedPetImage.url);
    await unlink(filePath);

    // Revalidate the cache for the /dashboard/pets path
    revalidatePath("/dashboard/pets");
  } catch (error) {
    console.error("Database Error: Failed to Delete Image.");
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
      `Access Denied: User ${userId} attempted to like pet ${petId} without permission.`
    );
    throw new Error(
      "Access Denied. You do not have permission to like this pet."
    );
  }

  const validatedArgs = createPetIdUserIdSchema.safeParse({
    parsedPetId: petId,
    parsedUserId: userId,
  });

  if (!validatedArgs.success) {
    const errorMessages = JSON.stringify(
      validatedArgs.error.flatten().fieldErrors
    );
    console.error(`Validation Error for createPetLike: ${errorMessages}`);
    throw new Error(
      `Invalid pet or user ID provided for liking. Errors: ${errorMessages}`
    );
  }

  const { parsedPetId, parsedUserId } = validatedArgs.data;

  try {
    await prisma.like.create({
      data: {
        petId: parsedPetId,
        userId: parsedUserId,
      },
    });
    revalidatePath("/pets");
  } catch (error: any) {
    if (error.code === "P2002") {
      console.warn(
        `User ${parsedUserId} already liked pet ${parsedPetId}. No action taken.`
      );
      revalidatePath("/pets");
      return;
    }
    console.error(
      `Database Error: Failed to add pet like for pet ${parsedPetId}, user ${parsedUserId}.`,
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
      `Access Denied: User ${userId} attempted to unlike pet ${petId} without permission.`
    );
    throw new Error(
      "Access Denied. You do not have permission to unlike this pet."
    );
  }

  const parsedArgs = createPetIdUserIdSchema.safeParse({
    parsedPetId: petId,
    parsedUserId: userId,
  });

  if (!parsedArgs.success) {
    const errorMessages = JSON.stringify(
      parsedArgs.error.flatten().fieldErrors
    );
    console.error(`Validation Error for deletePetLike: ${errorMessages}`);
    throw new Error(
      `Invalid pet or user ID for unliking. Errors: ${errorMessages}`
    );
  }

  const { parsedPetId, parsedUserId } = parsedArgs.data;

  try {
    await prisma.like.delete({
      where: {
        userId_petId: {
          petId: parsedPetId,
          userId: parsedUserId,
        },
      },
    });
    revalidatePath("/pets");
  } catch (error: any) {
    if (error.code === "P2025") {
      // Record to delete not found
      console.warn(
        `Like not found for user ${parsedUserId} and pet ${parsedPetId} during delete. No action taken.`
      );
      revalidatePath("/pets");
      revalidatePath(`/pets/${parsedPetId}`);
      return;
    }
    console.error(
      `Database Error: Failed to delete pet like for pet ${parsedPetId}, user ${parsedUserId}.`,
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
      `Access Denied: User ${userId} attempted to unlike pet ${petId} without permission.`
    );
    throw new Error(
      "Access Denied. You do not have permission to unlike this pet."
    );
  }

  const validatedArgs = createPetIdUserIdSchema.safeParse({
    parsedPetId: petId,
    parsedUserId: userId,
  });

  if (!validatedArgs.success) {
    const errorMessages = JSON.stringify(
      validatedArgs.error.flatten().fieldErrors
    );
    console.error(`Validation Error for togglePetLike: ${errorMessages}`);
    throw new Error(
      `Invalid arguments for toggling like status. Errors: ${errorMessages}`
    );
  }

  // No try-catch needed here if createPetLike/deletePetLike throw errors,
  // as those errors will propagate up.
  if (isCurrentlyLiked) {
    await deletePetLike(petId, userId);
  } else {
    await createPetLike(petId, userId);
  }
};
