"use client";

import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

// Helper function to capitalize the first letter
const capitalize = (s: string) => {
  if (typeof s !== 'string' || s.length === 0) {
    return '';
  }
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function SiteHeader() {
  const pathname = usePathname(); // e.g., "/dashboard/animals/create"
  const segments = pathname.split('/').filter(Boolean); // e.g., ["dashboard", "animals", "create"]

  let title = "Dashboard"; // Default title

  // If the path is /dashboard/animals or /dashboard/animals/*, show "Animals"
  if (segments[0] === 'dashboard' && segments.length > 1) {
    title = capitalize(segments[1]);
  } else if (segments.length > 0) {
    title = capitalize(segments[0]);
  }

  return (
    <header className="flex h-[var(--header-height)] shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-[var(--header-height)]">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        {/* The h1 from your original file is used with the dynamic title */}
        <h1 className="text-base font-medium">{title}</h1> 
        <div className="ml-auto flex items-center gap-2">
          
        </div>
      </div>
    </header>
  );
}
// import { Button } from "@/components/ui/button"
// import { Separator } from "@/components/ui/separator"
// import { SidebarTrigger } from "@/components/ui/sidebar"

// export function SiteHeader() {
//   return (
//     <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
//       <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
//         <SidebarTrigger className="-ml-1" />
//         <Separator
//           orientation="vertical"
//           className="mx-2 data-[orientation=vertical]:h-4"
//         />
//         <h1 className="text-base font-medium">Animals</h1>
//         <div className="ml-auto flex items-center gap-2">
          
//         </div>
//       </div>
//     </header>
//   )
// }
