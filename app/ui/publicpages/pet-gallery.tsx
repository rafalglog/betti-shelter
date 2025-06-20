"use client";

import React, { useState, Fragment } from "react";
import Image from "next/image";
import { PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { PetImage as PrismaPetImage } from "@prisma/client";
import { shimmer, toBase64 } from "@/app/lib/utils/image-loading-placeholder";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import LikeButton from "./like-button";
import clsx from "clsx";

interface PetGalleryProps {
  images: PrismaPetImage[];
  currentUserId: string | undefined;
  petId: string;
  isLikedByCurrentUser: boolean;
}

const PetGallery = ({ images, currentUserId, petId, isLikedByCurrentUser }: PetGalleryProps) => {
  // State to keep track of the selected image
  const [selectedImage, setSelectedImage] = useState(
    images.length > 0 ? images[0].url : ""
  );
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxImageUrl, setLightboxImageUrl] = useState("");

  const openLightbox = (imageUrl: string) => {
    setLightboxImageUrl(imageUrl);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  return (
    <>
      <div className="flex flex-col lg:mr-8 gap-y-2">
        {/* large image */}
        <div
          className="relative overflow-hidden flex items-center justify-center w-full h-80 bg-slate-200 rounded-sm cursor-pointer group"
          onClick={() => selectedImage && openLightbox(selectedImage)}
        >
          {selectedImage ? (
            <Image
              className="object-cover group-hover:opacity-90 transition-opacity"
              src={selectedImage}
              width={600}
              height={600}
              placeholder={`data:image/svg+xml;base64,${toBase64(
                shimmer(600, 600)
              )}`}
              alt="Selected pet image, click to enlarge"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 rounded-md flex">
              <PhotoIcon className="w-8 h-8 m-auto text-gray-500" />
            </div>
          )}
          <div className="absolute top-2 right-2 z-10">
            <LikeButton
              petId={petId}
              currentUserId={currentUserId}
              isLikedByCurrentUser={isLikedByCurrentUser}
            />
          </div>
        </div>
        {/* thumbnail images */}
        <div className="flex flex-row gap-x-2 overflow-auto">
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              className={clsx(
                "group shrink-0 rounded-sm aspect-square min-w-[24%] cursor-pointer overflow-hidden focus:outline-none transition-opacity duration-150 ease-in-out relative",
                selectedImage === image.url
                  ? "opacity-100 before:content-[''] before:absolute before:left-0 before:right-0 before:bottom-0 before:h-[3px] before:bg-blue-600 before:rounded-b-sm before:z-10" // Selected: full opacity, bottom border with space
                  : "opacity-70 hover:opacity-100 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white" // Not selected: dimmer, full opacity on hover, standard focus ring
              )}
              onClick={() => setSelectedImage(image.url)}
              aria-label={`Select pet image ${index + 1}`}
            >
              <Image
                className="w-full h-full object-cover transition-transform duration-150 ease-in-out group-hover:scale-110"
                src={image.url}
                height={100}
                width={100}
                placeholder={`data:image/svg+xml;base64,${toBase64(
                  shimmer(100, 100)
                )}`}
                alt={`Pet image thumbnail ${index + 1}`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox Dialog */}
      <Transition appear show={isLightboxOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeLightbox}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/75" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="relative w-full max-w-3xl transform overflow-hidden rounded-lg bg-white p-2 text-left align-middle shadow-xl transition-all">
                  <button
                    type="button"
                    className="absolute top-2 right-2 z-10 p-1 bg-white/50 hover:bg-white/80 rounded-full text-gray-700 hover:text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={closeLightbox}
                    aria-label="Close image viewer"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                  {lightboxImageUrl && (
                    <Image
                      src={lightboxImageUrl}
                      alt="Enlarged pet image"
                      width={1200}
                      height={800}
                      className="object-contain w-full h-auto max-h-[80vh] rounded"
                      placeholder={`data:image/svg+xml;base64,${toBase64(
                        shimmer(1200, 800)
                      )}`}
                    />
                  )}
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default PetGallery;
