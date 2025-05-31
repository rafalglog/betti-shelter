"use client";

import {
  HomeIcon,
  ListBulletIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Role } from "@prisma/client";

// Nav links
const links = [
  { name: "Home", href: "/dashboard", icon: HomeIcon },
  {
    name: "Pets",
    href: "/dashboard/pets",
    icon: ListBulletIcon,
  },
  { name: "Users", href: "/dashboard/users", icon: ClipboardDocumentListIcon },
];

interface NavLinksProps {
  role: Role;
}

const NavLinks = ({ role }: NavLinksProps) => {
  // Get the current pathname
  const pathname = usePathname();

  // Filter out the button links if the user is not an admin
  // This ensures that the "Users" link is only visible to users with the Role.ADMIN
  // role. All other links are included regardless of the user's role.
  const filteredLinks = links.filter(
    (link) => role === Role.ADMIN || link.name !== "Users"
  );

  return (
    <>
      {filteredLinks.map((link) => {
        // Button Icon
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              "flex h-[48px] grow items-center justify-center gap-2 rounded-md p-3 text-sm font-medium border",
              "hover:border-slate-400 lg:flex-none lg:justify-start lg:p-2 lg:px-3",
              pathname === link.href &&
                "bg-slate-200 text-slate-900 border-none"
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden lg:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
};

export default NavLinks;
