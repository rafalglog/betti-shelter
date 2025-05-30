import { auth } from "@/auth";
import { Role } from "@prisma/client";

// Check if the user has permission to perform an action
export const rolesWithPermission = async (allowedRoles: Role[]) => {
  // Get the current session
  const session = await auth();

  // If the session is not found, or the user object is not available, return false
  if (!session?.user) {
    return false;
  }

  // Get the role of the current user
  const userRole = session.user.role;

  if (!userRole) {
    return false;
  }

  return allowedRoles.includes(userRole);
};
