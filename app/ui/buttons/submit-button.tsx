import React from "react";
import clsx from "clsx";

type ButtonSubmitProps = {
  buttonName: string;
  isPending: boolean;
};

const SubmitButton = ({ buttonName, isPending }: ButtonSubmitProps) => {
  return (
    <button
      type="submit"
      disabled={isPending}
      className={clsx(
        "rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-xs",
        "hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600",
        isPending && "opacity-50 cursor-not-allowed"
      )}
    >
      {isPending ? "Submitting..." : buttonName}
    </button>
  );
};

export default SubmitButton;