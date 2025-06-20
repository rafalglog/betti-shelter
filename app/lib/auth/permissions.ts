export const Permissions = {
  // Pet Management
  PET_CREATE: "pet:create",
  PET_UPDATE: "pet:update",
  PET_READ_ANALYTICS: "pet:read_analytics", // For pet analytics (e.g., on the main dashboard overview)
  PET_DELETE_IMAGE: "pet:delete_image",
  PET_READ_DETAIL: "pet:read_detail", // For viewing detailed pet information (including the edit form in read-only)
  PET_READ_LISTING: "pet:read_listing",   // For viewing the pets list page (e.g., dashboard/pets)

  // Application Management (for staff/admins, and volunteers for read-only)
  APPLICATIONS_READ_LISTING: "applications:read_listing", // View list of ALL user applications
  APPLICATIONS_READ_DETAIL: "applications:read_detail", 
  APPLICATIONS_MANAGE_STATUS: "applications:manage_status", // Update status (approve/reject) of any application

  // My Application Management (for users managing their own applications)
  MY_APPLICATIONS_READ: "my_applications:read",   // View list of own applications
  MY_APPLICATIONS_CREATE: "my_applications:create",   // Create an application
  MY_APPLICATIONS_UPDATE: "my_applications:update", // Edit own application

  // Role Management (admins only)
  MANAGE_ROLES: "user:manage_roles",
} as const;
