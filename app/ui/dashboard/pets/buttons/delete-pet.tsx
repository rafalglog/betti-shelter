"use client"

import { deletePet } from "@/app/lib/actions/pet.actions";
import { useState } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";
import { ConfirmationModal } from "@/app/ui/confirmation-modal";

export const DeletePet = ({ id }: { id: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async () => {
    await deletePet(id);
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="rounded-md border p-2 hover:bg-gray-100"
        aria-label="Delete pet"
      >
        <TrashIcon className="w-5" />
      </button>
      
      <ConfirmationModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleDelete}
        actionTitle="Pet Deletion"
        itemName="pet"
      />
    </>
  );
};
