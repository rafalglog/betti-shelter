import clsx from "clsx";
import Link from "next/link";
import { PlusIcon } from "@heroicons/react/24/outline";

interface CreatePetButtonProps {
  canManage?: boolean;
}

export const CreatePetButton = ({ canManage = true }: CreatePetButtonProps) => {
  const commonStyles =
    "flex py-2 items-center rounded-lg px-4 text-sm font-medium";

  const content = (
    <>
      <span className="hidden md:block">New Pet</span>
      <PlusIcon className="h-5 md:ml-4" />
    </>
  );

  if (!canManage) {
    return (
      <div
        className={clsx(
          commonStyles,
          "bg-gray-300 text-gray-600 cursor-not-allowed"
        )}
        aria-disabled="true"
        title="You do not have permission to create a new pet."
      >
        {content}
      </div>
    );
  }

  return (
    <Link
      href="/dashboard/pets/create"
      className={clsx(
        commonStyles,
        "bg-indigo-600 text-white transition-colors hover:bg-indigo-700",
        "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      )}
    >
      {content}
    </Link>
  );
};