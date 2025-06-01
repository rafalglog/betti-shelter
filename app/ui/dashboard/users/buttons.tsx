"use client";

import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { deleteUser } from "@/app/lib/actions/user.actions";
import { useState } from "react";
import { UserIdProps } from "@/app/lib/types";

export const EditUser = ({ id }: UserIdProps) => {
  return (
    <Link
      href={`/dashboard/users/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export const DeleteUser = ({ id }: UserIdProps) => {
  // Bind the user id to the deleteUser function
  const deleteUserWithId = deleteUser.bind(null, id);
  // Confirmation state for the delete button
  const [confirmation, setConfirmation] = useState(false);
  const handleClick = () => setConfirmation(!confirmation);
  return (
    <form action={deleteUserWithId}>
      {!confirmation ? (
        <div
          onClick={handleClick}
          className="rounded-md border p-2 hover:bg-gray-100 hover:cursor-pointer"
        >
          <span className="sr-only">Delete</span>
          <TrashIcon className="w-5" />
        </div>
      ) : (
        <button className="rounded-md border p-2 hover:bg-red-500 hover:text-white">
          <span className="sr-only">Delete</span>
          Are you sure?
        </button>
      )}
    </form>
  );
}
