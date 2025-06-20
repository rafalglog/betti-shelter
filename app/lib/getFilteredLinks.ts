import type { NavItem } from "@/app/ui/dashboard/nav-links.config";
import { hasPermission } from "./auth/hasPermission";

/**
 * A generic function that filters an array of navigation items
 * based on the current user's permissions.
 * @param items An array of NavItem objects to filter.
 * @returns A promise that resolves to the filtered array of NavItems.
 */
export const getFilteredLinks = async (items: readonly NavItem[]): Promise<NavItem[]> => {
  const allowedLinks: NavItem[] = [];
  for (const link of items) {
    if (!link.permission || (await hasPermission(link.permission))) {
      allowedLinks.push(link);
    }
  }
  return allowedLinks;
};