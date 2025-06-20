"use client";

import { Fragment } from 'react';
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from '@headlessui/react';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { LockClosedIcon, ArrowRightEndOnRectangleIcon } from '@heroicons/react/24/outline';

interface LoginPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginPromptModal = ({ isOpen, onClose }: LoginPromptModalProps) => {
  const router = useRouter();

  const handleLoginRedirect = () => {
    onClose();
    router.push("/api/auth/signin");
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
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
              as={Fragment}
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
                  className="text-xl font-semibold font-opensans leading-6 text-gray-800 flex items-center"
                >
                  <LockClosedIcon className="h-6 w-6 text-indigo-600 mr-2" />
                  Login Required
                </DialogTitle>
                <div className="mt-3">
                  <p className="text-sm text-gray-600">
                    You need to be logged in to like pets and save your favorites.
                    Please log in or create an account to continue.
                  </p>
                </div>
                <div className="mt-6 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
                  <button
                    type="button"
                    className={clsx(
                      "inline-flex w-full sm:w-auto justify-center rounded-md border border-gray-300 bg-white px-4 py-2",
                      "text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-100",
                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                    )}
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className={clsx(
                      "inline-flex w-full sm:w-auto items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2",
                      "text-sm font-medium text-white shadow-sm hover:bg-indigo-700",
                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                    )}
                    onClick={handleLoginRedirect}
                  >
                    <ArrowRightEndOnRectangleIcon className="h-5 w-5 mr-2" />
                    Login / Sign Up
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

export default LoginPromptModal;