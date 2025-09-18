"use client";

import { usePathname } from "next/navigation";
import { LinkTabs } from "./link-tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";

// Define the tabs with their unique suffix and label.
// The default tab ('Activity') has an empty suffix to match the base route.
const animalTabDefinitions = [
  { suffix: "", label: "Activity" },
  { suffix: "/tasks", label: "Tasks" },
  { suffix: "/characteristics", label: "Characteristics" },
  { suffix: "/journey", label: "Journey" },
  { suffix: "/notes", label: "Notes" },
  { suffix: "/assessments", label: "Assessments" },
  { suffix: "/documents", label: "Documents" },
];

export function AnimalNavTabs() {
  const pathname = usePathname();

  // Extracts the base path, including the dynamic ID.
  // This assumes a URL structure of "/dashboard/animals/[id]/..."
  // It takes the first 4 segments, e.g., from "/dashboard/animals/123/tasks" it gets "/dashboard/animals/123".
  const basePath = pathname.split("/").slice(0, 4).join("/");

  // Create the fully-formed, dynamic links by appending the suffix to the base path
  const dynamicLinks = animalTabDefinitions.map((tab) => ({
    href: `${basePath}${tab.suffix}`,
    label: tab.label,
  }));

  return (
    <div className="@container/tabs">
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="w-32 @[581px]/tabs:hidden">
          <Button variant="outline">
            <Menu className="mr-2 h-4 w-4" />
            Navigation
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start">
          <DropdownMenuGroup>
            {dynamicLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link key={link.href} href={link.href} passHref>
                  <DropdownMenuItem
                    className={cn(
                      "cursor-pointer",
                      isActive ? "bg-accent font-semibold" : ""
                    )}
                  >
                    {link.label}
                  </DropdownMenuItem>
                </Link>
              );
            })}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <LinkTabs links={dynamicLinks} className="hidden @[581px]/tabs:block" />
    </div>
  );
}

// "use client";

// import { usePathname } from "next/navigation";
// import Link from "next/link";
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { LinkTabs } from "./LinkTabs";

// const settingsLinks = [
//   { href: '/dashboard/animals/activity', label: 'Activity' },
//   { href: '/dashboard/animals/tasks', label: 'Tasks' },
//   { href: '/dashboard/animals/characteristics', label: 'Characteristics' },
//   { href: '/dashboard/animals/journey', label: 'Journey' },
//   { href: '/dashboard/animals/notes', label: 'Notes' },
//   { href: '/dashboard/animals/assessments', label: 'Assessments' },
//   { href: '/dashboard/animals/documents', label: 'Documents' },
// ];

// // Helper to get the base animal ID route
// const getBasePath = (pathname: string) => {
//   const segments = pathname.split("/");
//   // Assuming URL is /dashboard/animals/[id]/...
//   return segments.slice(0, 4).join("/");
// };

// export function AnimalNavTabs() {
//   const pathname = usePathname();
//   const basePath = getBasePath(pathname);

//   // Determine the active tab from the URL's last segment
//   const segments = pathname.split("/");
//   const isActive =
//     segments[segments.length - 1] === basePath.split("/")[3]
//       ? "activity"
//       : segments[segments.length - 1];

//   return (
//     <>
//       <LinkTabs links={settingsLinks} />
//       <Tabs value={isActive} className="w-full hidden sm:block">
//         <TabsList>
//           <TabsTrigger value="activity" asChild>
//             <Link href={`${basePath}`}>Activity</Link>
//           </TabsTrigger>
//           <TabsTrigger value="tasks" asChild>
//             <Link href={`${basePath}/tasks`}>Tasks</Link>
//           </TabsTrigger>
//           <TabsTrigger value="characteristics" asChild>
//             <Link href={`${basePath}/characteristics`}>Characteristics</Link>
//           </TabsTrigger>
//           <TabsTrigger value="journey" asChild>
//             <Link href={`${basePath}/journey`}>Journey</Link>
//           </TabsTrigger>
//           <TabsTrigger value="notes" asChild>
//             <Link href={`${basePath}/notes`}>Notes</Link>
//           </TabsTrigger>
//           <TabsTrigger value="assessments" asChild>
//             <Link href={`${basePath}/assessments`}>Assessments</Link>
//           </TabsTrigger>
//           <TabsTrigger value="documents" asChild>
//             <Link href={`${basePath}/documents`}>Documents</Link>
//           </TabsTrigger>
//         </TabsList>
//       </Tabs>
//     </>
//   );
// }
