"use client";

import { useState, useTransition } from "react";
import { togglePetLike } from "@/app/lib/actions/animal.actions";
import { HeartIcon as OutlineHeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as SolidHeartIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import LoginPromptModal from "../login-prompt-modal";

interface LikeButtonProps {
  animalId: string;
  currentUserId: string | undefined;
  isLikedByCurrentUser: boolean;
}

const LikeButton = ({
  animalId,
  currentUserId,
  isLikedByCurrentUser,
}: LikeButtonProps) => {
  const [isPending, startTransition] = useTransition();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleLikeClick = () => {
    if (!currentUserId) {
      setIsLoginModalOpen(true);
      return;
    }

    startTransition(() => {
      togglePetLike(animalId);
    });
  };

  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    handleLikeClick();
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        aria-label={isLikedByCurrentUser ? "Unlike this pet" : "Like this pet"}
        className={clsx(
          "p-1.5 rounded-full bg-white/80 hover:bg-white transition-all duration-150 ease-in-out ",
          "shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
        )}
      >
        {isLikedByCurrentUser ? (
          <SolidHeartIcon className="h-5 w-5 text-red-500" />
        ) : (
          <OutlineHeartIcon className="h-5 w-5 text-red-400" />
        )}
      </button>

      {!currentUserId && (
        <LoginPromptModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
        />
      )}
    </>
  );
};

export default LikeButton;