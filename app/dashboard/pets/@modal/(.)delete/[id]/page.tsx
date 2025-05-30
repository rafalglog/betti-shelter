"use client";
import { useRouter } from "next/navigation";
import { deletePet } from "@/app/lib/actions/pet";
import { use } from "react";

interface Props {
  params: Promise<{ id: string }>;
}

export default function DeletePetModal({ params }: Props) {
  const router = useRouter();
  const { id } = use(params);

  const handleDelete = async () => {
    await deletePet(id);
    router.back();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
      <div className="bg-white p-6 rounded-md">
        <h2 className="font-medium mb-2">Confirm Pet Deletion</h2>
        <p>Are you sure you want to delete this pet?</p>
        <div className="mt-4 flex justify-end space-x-2">
          <button
            className="px-4 py-2 bg-gray-200 rounded-md"
            onClick={() => router.back()}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded-md"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
