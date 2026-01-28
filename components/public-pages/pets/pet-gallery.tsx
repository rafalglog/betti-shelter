"use client";

import React, { useState } from "react";
import Image from "next/image";
import { PhotoIcon } from "@heroicons/react/24/outline";
import { AnimalImage as PrismaPetImage } from "@prisma/client";
import { shimmer, toBase64 } from "@/app/lib/utils/image-loading-placeholder";
import LikeButton from "../like-button";
import clsx from "clsx";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useTranslations } from "next-intl";

interface PetGalleryProps {
  images: PrismaPetImage[];
  currentUserPersonId: string | undefined;
  animalId: string;
  isLikedByCurrentUser: boolean;
}

const PetGallery = ({
  images,
  currentUserPersonId,
  animalId,
  isLikedByCurrentUser,
}: PetGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState(
    images.length > 0 ? images[0].url : ""
  );
  const t = useTranslations("petGallery");
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxImageUrl, setLightboxImageUrl] = useState("");

  const openLightbox = (imageUrl: string) => {
    setLightboxImageUrl(imageUrl);
    setIsLightboxOpen(true);
  };

  return (
    <>
      <div className="flex flex-col lg:mr-8 gap-y-2">
        {/* Large image */}
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
              alt={t("selectedAlt")}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 rounded-md flex">
              <PhotoIcon className="w-8 h-8 m-auto text-gray-500" />
            </div>
          )}
          <div className="absolute top-2 right-2 z-10">
            <LikeButton
              animalId={animalId}
              currentUserPersonId={currentUserPersonId}
              isLikedByCurrentUser={isLikedByCurrentUser}
            />
          </div>
        </div>
        {/* Thumbnail images */}
        <div className="flex flex-row gap-x-2 overflow-auto">
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              className={clsx(
                "group shrink-0 rounded-sm aspect-square min-w-[24%] cursor-pointer overflow-hidden focus:outline-none transition-opacity duration-150 ease-in-out relative",
                selectedImage === image.url
                  ? "opacity-100 before:content-[''] before:absolute before:left-0 before:right-0 before:bottom-0 before:h-[3px] before:bg-blue-600 before:rounded-b-sm before:z-10"
                  : "opacity-70 hover:opacity-100 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white"
              )}
              onClick={() => setSelectedImage(image.url)}
              aria-label={t("thumbnailAria", { index: index + 1 })}
            >
              <Image
                className="w-full h-full object-cover transition-transform duration-150 ease-in-out group-hover:scale-110"
                src={image.url}
                height={100}
                width={100}
                placeholder={`data:image/svg+xml;base64,${toBase64(
                  shimmer(100, 100)
                )}`}
                alt={t("thumbnailAlt", { index: index + 1 })}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox Dialog using shadcn/ui */}
      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent className="max-w-3xl p-2 bg-white border-none sm:rounded-lg">
          {/* Add a visually hidden title for screen reader accessibility */}
          <DialogTitle className="sr-only">{t("lightboxTitle")}</DialogTitle>
          {lightboxImageUrl && (
            <Image
              src={lightboxImageUrl}
              alt={t("lightboxAlt")}
              width={1200}
              height={800}
              className="object-contain w-full h-auto max-h-[80vh] rounded"
              placeholder={`data:image/svg+xml;base64,${toBase64(
                shimmer(1200, 800)
              )}`}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PetGallery;
