"use client";

import { TrashIcon } from "@heroicons/react/24/outline";
import { deleteUser } from "@/app/lib/actions/user.actions";
import { useState } from "react";
import { UserIdProps } from "@/app/lib/types";
import { ConfirmationModal } from "@/app/ui/confirmation-modal";

export const DeleteUser = ({ id }: UserIdProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteUser(id);
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to delete user:", error);
      setIsOpen(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="rounded-md border p-2 hover:bg-gray-100"
        aria-label="Delete user"
      >
        <TrashIcon className="w-5" />
      </button>

      <ConfirmationModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleDelete}
        actionTitle="User Deletion"
        itemName="user"
      />
    </>
  );
};
