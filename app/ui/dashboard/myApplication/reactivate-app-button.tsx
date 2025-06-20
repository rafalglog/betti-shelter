"use client";

import { useState, useTransition } from "react";
import { ConfirmationModal } from "@/app/ui/confirmation-modal";
import { reactivateMyApplication } from "@/app/lib/actions/myApplication.action";
import clsx from "clsx";
import { toast } from "react-hot-toast";

interface Props {
  myApplicationId: string;
}

const ReactivateAppButton = ({ myApplicationId }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    setError(null); // Clear previous errors

    startTransition(async () => {
      const result = await reactivateMyApplication(myApplicationId);

      if (result.success) {
        toast.success(result.message || "Application reactivated!");
        setIsOpen(false);
      } else {
        toast.error(result.message || "An error occurred.");
        setIsOpen(false);
      }
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={clsx(
          "rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-xs",
          "hover:bg-green-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600",
          isPending && "opacity-50 cursor-not-allowed"
        )}
        disabled={isPending}
        aria-label="Reactivate Application"
      >
        {isPending ? "Reactivating..." : "Reactivate Application"}
      </button>

      {/* Conditionally render the error message below the button */}
      {error && (
        <p className="mt-2 text-sm text-red-600" aria-live="polite">
          {error}
        </p>
      )}

      <ConfirmationModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleSubmit}
        actionTitle="reactivate application"
        message="Are you sure you want to reactivate this application?"
      />
    </>
  );
};

export default ReactivateAppButton;
