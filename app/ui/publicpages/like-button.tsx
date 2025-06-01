"use client";

import { togglePetLike } from "@/app/lib/actions/pet.actions";
import { HeartIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

interface LikeButtonProps {
  petId: string;
  currentUserId: string | undefined;
  isLikedByCurrentUser: boolean;
}

const LikeButton = ({
  petId,
  currentUserId,
  isLikedByCurrentUser,
}: LikeButtonProps) => {
  if (currentUserId) {
    // User is logged in - render a form with a submit button to toggle like
    return (
      <form
        action={togglePetLike.bind(
          null,
          petId,
          currentUserId,
          isLikedByCurrentUser
        )}
      >
        <button
          type="submit"
          aria-label={
            isLikedByCurrentUser ? "Unlike this pet" : "Like this pet"
          }
          className="p-1 rounded-full hover:bg-red-100 active:bg-red-200 focus:outline-hidden focus:ring-2 focus:ring-red-300 transition-colors duration-150 ease-in-out"
        >
          <HeartIcon
            className={clsx(
              "h-6 w-6 transition-all duration-150 ease-in-out",
              isLikedByCurrentUser
                ? "text-red-500 fill-red-500"
                : "text-red-400 hover:text-red-500"
            )}
          />
        </button>
      </form>
    );
  } else {
    // User is not logged in - render a button that could prompt for login
    return (
      <button
        type="button"
        aria-label="Like this pet (requires login)"
        className="p-1 rounded-full hover:bg-gray-100 active:bg-gray-200 focus:outline-hidden focus:ring-2 focus:ring-gray-300 transition-colors duration-150 ease-in-out"
        onClick={() => {
          alert("Please log in to like pets.");
        }}
      >
        <HeartIcon className="h-6 w-6 text-gray-400 hover:text-gray-500 transition-colors duration-150 ease-in-out" />
      </button>
    );
  }
};

export default LikeButton;
