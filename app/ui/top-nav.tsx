"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Bars3Icon, LifebuoyIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import NavItemsRenderer from "./nav-items-renderer";
import UserMenu from "./user-avatar";

const links = [
  { name: "Home", href: "/" },
  { name: "Pets", href: "/pets" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
  { name: "Dashboard", href: "/dashboard" },
];

interface TopNavProps {
  userImage: string | null | undefined;
  showUserProfile: boolean;
}

const TopNav = ({ userImage, showUserProfile }: TopNavProps) => {
  const pathname = usePathname();
  // State to control the Sheet component for mobile navigation
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-gray-800 z-20 relative rounded-md mx-auto w-full max-w-7xl mb-4">
      <div className="mx-auto max-w-7xl px-2 md:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:bg-gray-700 hover:text-white"
                >
                  <span className="sr-only">Open main menu</span>
                  <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="bg-gray-800 text-white border-r-gray-700 p-4"
              >
                <SheetHeader className="sr-only">
                  <SheetTitle className="text-white">Menu</SheetTitle>
                  <SheetDescription className="sr-only">
                    Mobile navigation menu with links to different sections of
                    the website.
                  </SheetDescription>
                </SheetHeader>
                {/* Logo inside the Sheet */}
                <div className="flex shrink-0 items-center">
                  <LifebuoyIcon className="h-8 w-8 text-green-400" />
                  <span className="text-white font-bold text-xl ml-2">
                    Pet Adopt
                  </span>
                </div>

                {/* Navigation links inside the Sheet */}
                <div className="space-y-1">
                  <NavItemsRenderer
                    links={links}
                    pathname={pathname}
                    showUserProfile={showUserProfile}
                    onLinkClick={() => setIsMobileMenuOpen(false)}
                    itemClassName="block text-base"
                    signInButtonClassName="block text-base"
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <div className="flex flex-1 items-center justify-center md:items-stretch md:justify-start">
            {/* Logo for desktop */}
            <div className="flex shrink-0 items-center">
              <LifebuoyIcon className="h-8 w-8 text-green-400" />
              <span className="text-white font-bold text-xl ml-2">
                Pet Adopt
              </span>
            </div>

            {/* Top nav links for desktop */}
            <div className="hidden md:ml-6 md:flex md:space-x-2">
              <NavItemsRenderer
                links={links}
                pathname={pathname}
                showUserProfile={showUserProfile}
                itemClassName="text-sm"
                signInButtonClassName="text-sm"
              />
            </div>
          </div>

          {/* User profile menu */}
          {showUserProfile && <UserMenu userImage={userImage} />}
        </div>
      </div>
    </nav>
  );
};

export default TopNav;

// "use client";

// import { useState } from "react";
// import { usePathname } from "next/navigation";
// import { Bars3Icon, LifebuoyIcon } from "@heroicons/react/24/outline";
// import { Button } from "@/components/ui/button";
// import {
//   Sheet,
//   SheetContent,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from "@/components/ui/sheet";
// import NavItemsRenderer from "./nav-items-renderer";
// import UserMenu from "./user-avatar";

// const links = [
//   { name: "Home", href: "/" },
//   { name: "Pets", href: "/pets" },
//   { name: "About", href: "/about" },
//   { name: "Contact", href: "/contact" },
//   { name: "Dashboard", href: "/dashboard" },
// ];

// interface TopNavProps {
//   userImage: string | null | undefined;
//   showUserProfile: boolean;
// }

// const TopNav = ({ userImage, showUserProfile }: TopNavProps) => {
//   const pathname = usePathname();
//   // State to control the Sheet component for mobile navigation
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   return (
//     <nav className="bg-gray-800 z-20 relative rounded-md mx-auto w-full max-w-7xl mb-4">
//       <div className="mx-auto max-w-7xl px-2 md:px-6 lg:px-8">
//         <div className="relative flex h-16 items-center justify-between">
//           <div className="absolute inset-y-0 left-0 flex items-center md:hidden">
//             <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
//               <SheetTrigger asChild>
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   className="text-gray-400 hover:bg-gray-700 hover:text-white"
//                 >
//                   <span className="sr-only">Open main menu</span>
//                   <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
//                 </Button>
//               </SheetTrigger>
//               <SheetContent
//                 side="left"
//                 className="bg-gray-800 text-white border-r-gray-700 w-64 p-4"
//               >
//                 <SheetHeader>
//                   <SheetTitle className="text-white">Pet Adopt</SheetTitle>
//                 </SheetHeader>
//                 {/* Logo inside the Sheet */}
//                 <div className="flex shrink-0 items-center mb-6">
//                   <LifebuoyIcon className="h-8 w-8 text-green-400" />
//                   <span className="text-white font-bold text-xl ml-2">
//                     Pet Adopt
//                   </span>
//                 </div>
//                 {/* Navigation links inside the Sheet */}
//                 <div className="space-y-1">
//                   <NavItemsRenderer
//                     links={links}
//                     pathname={pathname}
//                     showUserProfile={showUserProfile}
//                     onLinkClick={() => setIsMobileMenuOpen(false)}
//                     itemClassName="block text-base"
//                     signInButtonClassName="block text-base"
//                   />
//                 </div>
//               </SheetContent>
//             </Sheet>
//           </div>

//           <div className="flex flex-1 items-center justify-center md:items-stretch md:justify-start">
//             {/* Logo for desktop */}
//             <div className="flex shrink-0 items-center">
//               <LifebuoyIcon className="h-8 w-8 text-green-400" />
//               <span className="text-white font-bold text-xl ml-2">
//                 Pet Adopt
//               </span>
//             </div>

//             {/* Top nav links for desktop */}
//             <div className="hidden md:ml-6 md:flex md:space-x-2">
//               <NavItemsRenderer
//                 links={links}
//                 pathname={pathname}
//                 showUserProfile={showUserProfile}
//                 itemClassName="text-sm"
//                 signInButtonClassName="text-sm"
//               />
//             </div>
//           </div>

//           {/* User profile menu */}
//           {showUserProfile && <UserMenu userImage={userImage} />}
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default TopNav;
