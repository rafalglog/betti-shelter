"use client";

import { signOut } from "next-auth/react";
import { BellIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

interface UserAvatarProps {
  userImage?: string | null;
}

const UserMenu = ({ userImage }: UserAvatarProps) => {
  const t = useTranslations("nav");
  return (
    <div className="flex items-center gap-x-4 ml-auto">
      <Button variant="ghost" size="icon" aria-label={t("notifications")}>
        <BellIcon className="size-6 text-gray-300" />
      </Button>

      {/* User Dropdown Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <span className="sr-only">{t("openUserMenu")}</span>
            <Avatar className="h-8 w-8">
              {/* If userImage exists, display it */}
              <AvatarImage
                src={userImage || ""}
                alt={t("userImageAlt")}
              />
              {/* Fallback for when there is no image */}
              <AvatarFallback className="bg-slate-600" />
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48" align="end" forceMount>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/settings">{t("settings")}</Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer">
            {t("signOut")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserMenu;
