"use client"

import { TrashIcon } from "@heroicons/react/24/outline";
import { deletePetImage } from "@/app/lib/actions/pet.actions";
import { useState } from "react";
import { ConfirmationModal } from "@/app/ui/confirmation-modal";

export const DeletePetImage = ({ id }: { id: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleDeleteImage = async () => {
    try {
      await deletePetImage(id);
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to delete image:", error);
      setIsOpen(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="mt-1 h-8 text-center text-sm rounded-sm border hover:bg-red-500 hover:text-white hover:cursor-pointer flex items-center justify-center w-full"
        aria-label="Delete image"
      >
        <TrashIcon className="w-4" />
      </button>

      <ConfirmationModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleDeleteImage}
        actionTitle="Image Deletion"
        itemName="image"
      />
    </>
  );
};