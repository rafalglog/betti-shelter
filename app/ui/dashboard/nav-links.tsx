"use client";

import Link from "next/link";
import {
  ArrowLeftStartOnRectangleIcon,
  HomeIcon,
  ClipboardDocumentListIcon,
  ClipboardDocumentCheckIcon,
  ChartPieIcon,
  UserGroupIcon,
  PlusCircleIcon,
  InformationCircleIcon,
  QuestionMarkCircleIcon,
  ChatBubbleLeftEllipsisIcon,
  ListBulletIcon,
} from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { signOut } from "next-auth/react";
import { NavItem } from "./nav-links.config";

const helpItems = [
  { href: "#", label: "Help Center", icon: QuestionMarkCircleIcon },
  { href: "#", label: "Contact Support", icon: InformationCircleIcon },
  { href: "#", label: "Send Feedback", icon: ChatBubbleLeftEllipsisIcon },
];

// Create a map from the string name to the actual component
const iconMap: { [key: string]: React.ForwardRefExoticComponent<any> } = {
  HomeIcon,
  ChartPieIcon,
  ListBulletIcon,
  ClipboardDocumentListIcon,
  ClipboardDocumentCheckIcon,
  UserGroupIcon,
  PlusCircleIcon,
};

interface NavLinksProps {
  links: NavItem[];
  quickActions: NavItem[];
}

const NavLinks = ({ links, quickActions }: NavLinksProps) => {
  const pathname = usePathname();

  return (
    <nav className="flex-col flex-1 flex text-gray-900">
      <ul className="gap-y-7 flex-col flex-1 flex">
        <li>
          <div className="text-slate-400 text-xs/6 font-semibold">
            Navigation
          </div>
          <ul className="-mx-2">
            {links.map((item) => {
              // Look up the component from the map using the iconName string
              const IconComponent = iconMap[item.iconName];
              return (
                <li
                  key={item.href}
                  className={clsx(
                    "mt-1.5 group rounded-md text-gray-700 hover:bg-slate-100 hover:text-gray-900",
                    pathname === item.href && "bg-slate-100 text-gray-900"
                  )}
                >
                  <Link
                    href={item.href}
                    className="text-sm/6 p-2 rounded-md gap-x-3 flex font-semibold"
                  >
                    {IconComponent && <IconComponent className="w-6 h-6" />}
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </li>

        {/* Quick actions */}
        <li>
          <div className="text-slate-400 text-xs/6 font-semibold mb-2">
            Quick Actions
          </div>
          <ul className="-mx-2">
            {quickActions.map((item) => {
              // Look up the component from the map using the iconName string
              const IconComponent = item.iconName ? iconMap[item.iconName] : null;
              return (
                <li
                  key={item.label}
                  className="group text-slate-700 rounded-md hover:text-black"
                >
                  <Link
                    href={item.href}
                    className="flex items-center gap-2 text-xs/6 font-medium px-2 py-0.5 rounded-md"
                  >
                    {IconComponent && (
                      <IconComponent className="w-4 h-4 text-gray-400/85 group-hover:text-slate-600" />
                    )}
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </li>

        {/* help links */}
        <li>
          <div className="text-slate-400 text-xs/6 font-semibold mb-2">
            Help
          </div>
          <ul className="-mx-2">
            {helpItems.map((item) => {
              const IconName = item.icon;
              return (
                <li
                  key={item.label}
                  className="group text-slate-700 rounded-md hover:text-black"
                >
                  <Link
                    href={item.href}
                    className="flex items-center gap-2 text-xs/6 font-medium px-2 py-0.5 rounded-md"
                  >
                    <IconName className="w-4 h-4 text-gray-400/85 group-hover:text-slate-600" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </li>

        {/* Log out */}
        <li className="-mx-6 mt-auto hover:bg-slate-100">
          <button
            // On click sign out and redirect to home page
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex gap-x-3 items-center font-semibold py-4 px-6 text-sm/6 w-full cursor:pointer"
          >
            <ArrowLeftStartOnRectangleIcon className="w-5 h-5" />
            Log out
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default NavLinks;
