import { signOut } from "next-auth/react";
import { BellIcon } from "@heroicons/react/24/outline";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserAvatarProps {
  userImage?: string | null;
}

const UserMenu = ({ userImage }: UserAvatarProps) => {
  return (
    <div className="flex items-center gap-x-4 ml-auto">
      <Button variant="ghost" size="icon" aria-label="View notifications">
        <BellIcon className="size-6 text-gray-300" />
      </Button>

      {/* User Dropdown Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <span className="sr-only">Open user menu</span>
            <Avatar className="h-8 w-8">
              {/* If userImage exists, display it */}
              <AvatarImage
                src={userImage || ""}
                alt="User profile image"
              />
              {/* Fallback for when there is no image */}
              <AvatarFallback className="bg-slate-600" />
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48" align="end" forceMount>
          <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer">
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserMenu;