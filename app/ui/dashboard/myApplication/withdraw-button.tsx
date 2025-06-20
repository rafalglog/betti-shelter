"use client";

import { useState, useTransition } from "react";
import { ConfirmationModal } from "@/app/ui/confirmation-modal";
import { withdrawMyApplication } from "@/app/lib/actions/myApplication.action";
import clsx from "clsx";

interface Props {
  myApplicationId: string;
}

export const WithDrawButton = ({ myApplicationId }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    // Clear any previous errors
    setError(null);

    startTransition(async () => {
      const result = await withdrawMyApplication(myApplicationId);

      if (!result.success) {
        setError(result.message);
        setIsOpen(false); // Close the modal to show the error
      }
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={clsx(
          "rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-xs",
          "hover:bg-red-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600",
          isPending && "opacity-50 cursor-not-allowed"
        )}
        aria-label="Withdraw Application"
        disabled={isPending}
      >
        {isPending ? "Withdrawing..." : "Withdraw Application"}
      </button>

      {/* Display the error message */}
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}


      <ConfirmationModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleSubmit}
        actionTitle="withdraw application"
        message="Are you sure you want to withdraw this application?"
      />
    </>
  );
};