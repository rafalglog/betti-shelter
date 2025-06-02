"use client";

import { Fragment } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import clsx from "clsx";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  actionTitle: string;
  itemName: string;
}

export const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  actionTitle,
  itemName,
}: ConfirmationModalProps) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        {/* Backdrop Transition */}
        <TransitionChild
          as="div"
          className="fixed inset-0 bg-black/30 backdrop-blur-sm" 
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        />

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            {/* Panel Transition */}
            <TransitionChild
              as="div"
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-lg bg-gray-50 p-6 text-left align-middle shadow-lg transition-all">
                <DialogTitle
                  as="h3"
                  className="text-xl font-semibold font-opensans leading-6 text-gray-800"
                >
                  Confirm {actionTitle}
                </DialogTitle>
                <div className="mt-2">
                  <p className="text-sm text-gray-600">
                    Are you sure you want to delete this {itemName}?
                    This action cannot be undone.
                  </p>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    className={clsx(
                      "inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2",
                      "text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50",
                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                    )}
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className={clsx(
                      "inline-flex justify-center rounded-md border border-transparent bg-red-500 px-4 py-2",
                      "text-sm font-medium text-white shadow-sm hover:bg-red-600 ",
                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                    )}
                    onClick={onConfirm}
                  >
                    Delete
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};