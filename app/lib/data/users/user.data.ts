import { prisma } from "@/app/lib/prisma";
import { ITEMS_PER_PAGE } from "@/app/lib/constants/constants";
import { Role } from "@prisma/client";
import { cuidSchema, searchQuerySchema } from "../../zod-schemas/common.schemas";
import {
  FilteredUsersParamsSchema
} from "../../zod-schemas/user.schemas";
import { RequirePermission } from "../../auth/protected-actions";
import { Permissions } from "@/app/lib/auth/permissions";
import { FilteredUsersPayload, UserByIdPayload } from "../../types";

const _fetchFilteredUsers = async (
  queryInput: string,
  currentPageInput: number
): Promise<FilteredUsersPayload[]> => {
  // Parse the query and currentPage
  const validatedArgs = FilteredUsersParamsSchema.safeParse({
    query: queryInput,
    currentPage: currentPageInput,
  });
  if (!validatedArgs.success) {
    if (process.env.NODE_ENV !== "production") {
      console.error(
        "Zod validation error in fetchFilteredUsers:",
        validatedArgs.error.flatten()
      );
    }
    throw new Error(validatedArgs.error.errors[0]?.message || "Invalid arguments for fetching users.");
  }
  const { query, currentPage } = validatedArgs.data;

  // page offset
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  // fetch the users
  try {
    const users = await prisma.user.findMany({
      where: {
        email: {
          contains: query,
          mode: "insensitive",
        },
        role: {
          not: Role.ADMIN,
        },
      },
      select: {
        id: true,
        email: true,
        image: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: ITEMS_PER_PAGE,
      skip: offset,
    });

    // add a 4 seconds delay to simulate a slow network
    // await new Promise((resolve) => setTimeout(resolve, 4000));

    // return the users
    return users;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error fetching users.", error);
    }
    throw new Error("Error fetching users.");
  }
};

const _fetchUserPages = async (queryInput: string): Promise<number> => {
  // Parse the query
  const parsedQuery = searchQuerySchema.safeParse(queryInput);
  if (!parsedQuery.success) {
    if (process.env.NODE_ENV !== "production") {
      console.error(
        "Zod validation error in fetchUserPages:",
        parsedQuery.error.flatten()
      );
    }
    throw new Error(parsedQuery.error.errors[0]?.message || "Invalid query format.");
  }
  const validatedQuery = parsedQuery.data;

  // Get the total number of users that contains the query
  try {
    const count = await prisma.user.count({
      where: {
        email: {
          contains: validatedQuery,
          mode: "insensitive",
        },
      },
    });

    // Calculate the total number of pages
    const totalPages = Math.ceil(count / ITEMS_PER_PAGE);

    // return the total number of pages
    return totalPages;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error fetching user pages.", error);
    }
    throw new Error("Error fetching user pages.");
  }
};

const _fetchUserById = async (id: string): Promise<UserByIdPayload | null> => {
  // Validate the id
  const parsedId = cuidSchema.safeParse(id);
  if (!parsedId.success) {
    if (process.env.NODE_ENV !== "production") {
      console.error(
        "Zod validation error in fetchUserById:",
        parsedId.error.flatten()
      );
    }
    throw new Error(parsedId.error.errors[0]?.message || "Invalid User ID format.");
  }
  const validatedId = parsedId.data;

  // Fetch the user
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: validatedId,
      },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    // return the user
    return user;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error fetching user.", error);
    }
    throw new Error("Error fetching user.");
  }
};

export const fetchFilteredUsers = RequirePermission(Permissions.MANAGE_ROLES)(_fetchFilteredUsers);
export const fetchUserPages = RequirePermission(Permissions.MANAGE_ROLES)(_fetchUserPages);
export const fetchUserById = RequirePermission(Permissions.MANAGE_ROLES)(_fetchUserById);