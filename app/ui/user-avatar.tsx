import React from "react";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import clsx from "clsx";
import { signOut } from "next-auth/react";
import { BellIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

interface UserAvatarProps {
  userImage?: string | null;
}

const UserMenu = ({ userImage }: UserAvatarProps) => {
  return (
    <div className="flex items-center gap-x-4 ml-auto">
      <button>
        <BellIcon className="size-6 text-slate-600" />
      </button>
      <Menu as="div" className="relative ml-3">
        <div>
          <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-hidden focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
            <span className="absolute -inset-1.5" />
            <span className="sr-only">Open user menu</span>
            {userImage ? (
              <Image
                src={userImage}
                width={32}
                height={32}
                className="h-8 w-8 rounded-full object-cover"
                alt="User profile image"
              />
            ) : (
              <span className="h-8 w-8 rounded-full bg-slate-600" />
            )}
          </MenuButton>
        </div>
        <Transition
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <MenuItems className="absolute right-0 z-30 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-hidden">
            <MenuItem>
              {({ focus }) => (
                <button
                  onClick={() => signOut()}
                  className={clsx(
                    "w-full text-left px-4 py-2 text-sm text-gray-700",
                    focus && "bg-gray-100"
                  )}
                >
                  Sign out
                </button>
              )}
            </MenuItem>
          </MenuItems>
        </Transition>
      </Menu>
    </div>
  );
};

export default UserMenu;
