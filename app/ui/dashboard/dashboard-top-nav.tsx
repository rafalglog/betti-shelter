"use client";

import { Bars3Icon } from "@heroicons/react/24/outline";
import { useState } from "react";
import UserMenu from "../user-avatar";
import LeftFloatingNav from "./left-floating-nav";
import type { NavItem } from "./nav-links.config";

interface Props {
  userImage: string | null;
  links: NavItem[];
  quickActions: NavItem[];
}

const DashboardTopBar = ({ userImage, links, quickActions }: Props) => {
  let [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <div className="fixed top-0 left-0 right-0 lg:left-72 z-40 py-4 bg-white gap-x-6 items-center h-16 flex px-6 border-b border-slate-200">
        <button
          className="p-2.5 -m-2.5 lg:hidden"
          onClick={() => setIsOpen(true)}
        >
          <span className="sr-only">Open sidebar</span>
          <Bars3Icon className="size-8 text-gray-700" />
        </button>

        <UserMenu userImage={userImage} />
      </div>
      <LeftFloatingNav
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        links={links}
        quickActions={quickActions}
      />
    </>
  );
};

export default DashboardTopBar;