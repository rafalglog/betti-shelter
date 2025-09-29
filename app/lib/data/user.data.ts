import { prisma } from "@/app/lib/prisma";
import { ITEMS_PER_PAGE } from "@/app/lib/constants/constants";
import { Prisma, Role } from "@prisma/client";
import { cuidSchema, searchQuerySchema } from "../zod-schemas/common.schemas";
import { UsersParamsSchema } from "../zod-schemas/user.schemas";
import { RequirePermission } from "../auth/protected-actions";
import { Permissions } from "@/app/lib/auth/permissions";
import { UsersPayload, TaskAssignee, UserByIdPayload } from "../types";

const _fetchUsers = async (
  queryInput: string,
  currentPageInput: number,
  sortInput: string | undefined,
  roleInput: string | undefined
): Promise<{ users: UsersPayload[]; totalPages: number }> => {
  // Parse and validate all arguments
  const validatedArgs = UsersParamsSchema.safeParse({
    query: queryInput,
    currentPage: currentPageInput,
    sort: sortInput,
    role: roleInput,
  });

  if (!validatedArgs.success) {
    if (process.env.NODE_ENV !== "production") {
      console.error(
        "Zod validation error in fetchFilteredUsers:",
        validatedArgs.error.flatten()
      );
    }
    throw new Error(
      validatedArgs.error.errors[0]?.message ||
        "Invalid arguments for fetching users."
    );
  }
  const { query, currentPage, sort, role } = validatedArgs.data;

  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  // Dynamically set the sorting order
  const orderBy: Prisma.UserOrderByWithRelationInput = (() => {
    if (!sort) return { createdAt: "desc" }; // Default sort
    const [field, direction] = sort.split(".");
    const dir = direction === "asc" ? "asc" : "desc";

    switch (field) {
      case "email":
        return { email: dir };
      case "role":
        return { role: dir };
      case "createdAt":
        return { createdAt: dir };
      default:
        return { createdAt: "desc" };
    }
  })();

  // Define the base where clause for filtering
  const whereClause: Prisma.UserWhereInput = {
    email: {
      contains: query,
      mode: "insensitive",
    },
    // Exclude admins from the general user list by default
    role: {
      not: Role.ADMIN,
    },
  };

  // If a specific role is provided for filtering, apply it
  if (role && Object.values(Role).includes(role as Role)) {
    whereClause.role = role as Role;
  }

  // Fetch count and users in a single database transaction for efficiency
  try {
    const [count, users] = await prisma.$transaction([
      prisma.user.count({ where: whereClause }),
      prisma.user.findMany({
        where: whereClause,
        select: {
          id: true,
          email: true,
          image: true,
          role: true,
          createdAt: true,
        },
        orderBy: orderBy,
        take: ITEMS_PER_PAGE,
        skip: offset,
      }),
    ]);

    // Calculate the total number of pages
    const totalPages = Math.ceil(count / ITEMS_PER_PAGE);

    return { users, totalPages };
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
    throw new Error(
      parsedQuery.error.errors[0]?.message || "Invalid query format."
    );
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
    throw new Error(
      parsedId.error.errors[0]?.message || "Invalid User ID format."
    );
  }
  const validatedId = parsedId.data;

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
    return user;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error fetching user.", error);
    }
    throw new Error("Error fetching user.");
  }
};

const _fetchTaskAssigneeList = async (): Promise<TaskAssignee[]> => {
  try {
    const assignees = await prisma.person.findMany({
      where: {
        // Filter based on the role of the associated User
        user: {
          role: {
            in: [Role.STAFF, Role.ADMIN, Role.VOLUNTEER],
          },
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        user: {
          select: {
            image: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });
    // Map the result to a flat structure for your form's dropdown/list
    const mappedList = assignees.map((person) => ({
      id: person.id,
      name: person.name,
      email: person.email,
      image: person.user?.image,
    }));
    return mappedList;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error fetching assignee list:", error);
    }
    throw new Error("Failed to fetch assignee list.");
  }
};

export const fetchTaskAssigneeList = RequirePermission(
  Permissions.ANIMAL_CREATE
)(_fetchTaskAssigneeList);

export const fetchUsers = RequirePermission(Permissions.MANAGE_ROLES)(
  _fetchUsers
);
export const fetchUserPages = RequirePermission(Permissions.MANAGE_ROLES)(
  _fetchUserPages
);
export const fetchUserById = RequirePermission(Permissions.MANAGE_ROLES)(
  _fetchUserById
);
