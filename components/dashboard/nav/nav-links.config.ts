import { Permissions } from "@/app/lib/auth/permissions";

export type IconName = 
  | "IconDashboard"
  | "IconListDetails"
  | "IconUsers"
  | "IconFolder"
  | "IconClipboardList"
  | "IconCamera"
  | "IconFileDescription"
  | "IconFileAi"
  | "IconSettings"
  | "IconHelp"
  | "IconSearch"
  | "IconReport"
  | "IconFileWord"
  | "IconCirclePlus"
  | "IconChartBar";

export interface NavItem {
  id: string;
  title: string;
  labelKey?: string;
  url: string;
  icon: IconName;
  permission?: string;
  isActive?: boolean;
  items?: Array<{
    id: string;
    title: string;
    labelKey?: string;
    url: string;
    permission?: string;
  }>;
}

export interface NavDocument {
  id: string;
  name: string;
  labelKey?: string;
  url: string;
  icon: IconName;
  permission?: string;
}

// Main navigation items
export const navMainItems: readonly NavItem[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    labelKey: "dashboard.nav.main.dashboard",
    url: "/dashboard",
    icon: "IconDashboard",
    permission: Permissions.ANIMAL_READ_ANALYTICS,
  },
  {
    id: "animals",
    title: "Animals",
    labelKey: "dashboard.nav.main.animals",
    url: "/dashboard/animals",
    icon: "IconListDetails",
    permission: Permissions.ANIMAL_READ_LISTING,
  },
  {
    id: "users",
    title: "Users",
    labelKey: "dashboard.nav.main.users",
    url: "/dashboard/users",
    icon: "IconChartBar",
    permission: Permissions.MANAGE_ROLES,
  },
  {
    id: "myApplications",
    title: "My Applications",
    labelKey: "dashboard.nav.main.myApplications",
    url: "/dashboard/my-applications",
    icon: "IconFolder",
    permission: Permissions.MY_APPLICATIONS_READ,
  },
  {
    id: "adoptionApplications",
    title: "Adoption Applications",
    labelKey: "dashboard.nav.main.adoptionApplications",
    url: "/dashboard/adoption-applications",
    icon: "IconUsers",
    permission: Permissions.APPLICATIONS_READ_LISTING,
  },
  {
    id: "outcomes",
    title: "Outcomes",
    labelKey: "dashboard.nav.main.outcomes",
    url: "/dashboard/outcomes",
    icon: "IconUsers",
    permission: Permissions.OUTCOMES_MANAGE,
  },
  {
    id: "animalTasks",
    title: "Animal Tasks",
    labelKey: "dashboard.nav.main.animalTasks",
    url: "/dashboard/animal-tasks",
    icon: "IconUsers",
    permission: Permissions.OUTCOMES_MANAGE,
  },
] as const;

// Navigation with collapsible sub-items
export const navCollapsibleItems: readonly NavItem[] = [
  {
    id: "capture",
    title: "Capture",
    labelKey: "dashboard.nav.collapsible.capture",
    icon: "IconCamera",
    isActive: true,
    url: "#",
    items: [
      {
        id: "captureActive",
        title: "Active Proposals",
        labelKey: "dashboard.nav.collapsible.activeProposals",
        url: "#",
      },
      {
        id: "captureArchived",
        title: "Archived",
        labelKey: "dashboard.nav.collapsible.archived",
        url: "#",
      },
    ],
  },
  {
    id: "proposal",
    title: "Proposal",
    labelKey: "dashboard.nav.collapsible.proposal",
    icon: "IconFileDescription",
    url: "#",
    items: [
      {
        id: "proposalActive",
        title: "Active Proposals",
        labelKey: "dashboard.nav.collapsible.activeProposals",
        url: "#",
      },
      {
        id: "proposalArchived",
        title: "Archived",
        labelKey: "dashboard.nav.collapsible.archived",
        url: "#",
      },
    ],
  },
] as const;

// Secondary navigation items
export const navSecondaryItems: readonly NavItem[] = [
  {
    id: "settings",
    title: "Settings",
    labelKey: "dashboard.nav.secondary.settings",
    url: "/dashboard/settings",
    icon: "IconSettings",
  },
  {
    id: "help",
    title: "Get Help",
    labelKey: "dashboard.nav.secondary.help",
    url: "#",
    icon: "IconHelp",
  },
  {
    id: "search",
    title: "Search",
    labelKey: "dashboard.nav.secondary.search",
    url: "#",
    icon: "IconSearch",
  },
] as const;

// Documents/Quick actions
export const documentItems: readonly NavDocument[] = [
  {
    id: "reports",
    name: "Reports",
    labelKey: "dashboard.nav.documents.reports",
    url: "#",
    icon: "IconReport",
  },
] as const;
