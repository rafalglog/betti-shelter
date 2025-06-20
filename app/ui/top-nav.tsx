"use client";

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import {
  Bars3Icon,
  LifebuoyIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
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

  return (
    <Disclosure
      as="nav"
      className="bg-gray-800 z-20 relative rounded-md data-[headlessui-state=open]:rounded-b-none mx-auto w-full max-w-7xl mb-4"
    >
      {({ open, close }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 md:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              {/* bars menu button */}
              <div className="absolute inset-y-0 left-0 flex items-center md:hidden">
                <DisclosureButton className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-hidden focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </DisclosureButton>
              </div>

              <div className="flex flex-1 items-center justify-center md:items-stretch md:justify-start">
                {/* logo */}
                <div className="flex shrink-0 items-center">
                  <LifebuoyIcon className="h-8 w-8 text-green-400" />
                  <span className="text-white font-bold text-xl ml-2">
                    Pet Adopt
                  </span>
                </div>

                {/* top nav links */}
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

              {/* user profile menu */}
              {showUserProfile && <UserMenu userImage={userImage} />}
            </div>
          </div>

          {/* small screen drop down menu */}
          <DisclosurePanel className="md:hidden absolute left-0 right-0 z-10 bg-gray-800 rounded-b-md">
            <div className="space-y-1 px-2 pb-3 pt-2">
              <NavItemsRenderer
                links={links}
                pathname={pathname}
                showUserProfile={showUserProfile}
                onLinkClick={close}
                itemClassName="block text-base"
                signInButtonClassName="block text-base"
              />
            </div>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
};

export default TopNav;
