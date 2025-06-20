import { Role } from "@prisma/client";
import { Permissions } from "./permissions";

// Permissions for the base user role
const userPermissions = [
  Permissions.MY_APPLICATIONS_READ,   // Any registered user can see their applications list
  Permissions.MY_APPLICATIONS_UPDATE, // Any registered user can edit their own applications
  Permissions.MY_APPLICATIONS_CREATE, // Any registered user can create new applications
] as const;

// Permissions for the volunteer role
const volunteerPermissions = [
  ...userPermissions, // Volunteers inherit base user permissions
  Permissions.PET_READ_ANALYTICS, // Volunteers can view pet analytics
  Permissions.PET_READ_LISTING,   // Volunteers can view the list of pets
  Permissions.PET_READ_DETAIL,    // Volunteers can view detailed pet information (read-only)
  Permissions.APPLICATIONS_READ_LISTING, // Volunteers can view the list of all user applications (read-only)
  Permissions.APPLICATIONS_READ_DETAIL,  // Volunteers can view detailed application information (read-only)
] as const;

// Staff inherits all USER permissions and gets additional ones
const staffPermissions = [
  ...volunteerPermissions,
  Permissions.PET_CREATE,
  Permissions.PET_UPDATE, 
  Permissions.PET_DELETE_IMAGE,
  Permissions.APPLICATIONS_MANAGE_STATUS, // Staff can manage the status of applications
] as const;

// Admin inherits all STAFF permissions
const adminPermissions = [
  ...staffPermissions,
  Permissions.MANAGE_ROLES,
] as const;

// Final mapping object
export const rolePermissions: Record<Role, readonly string[]> = {
  [Role.USER]: userPermissions,
  [Role.VOLUNTEER]: volunteerPermissions,
  [Role.STAFF]: staffPermissions,
  [Role.ADMIN]: adminPermissions,
};