'use client';

import Image from 'next/image';
import { AnimalImage } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useTransition } from 'react';
import { deleteAnimalImage } from '@/app/lib/actions/animal.actions';
import { toast } from 'sonner';

interface AnimalImageGalleryProps {
  images: AnimalImage[];
  animalId: string;
}

export default function AnimalImageGallery({ images, animalId }: AnimalImageGalleryProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = (imageId: string, imageUrl: string) => {
    if (confirm('Are you sure you want to delete this image? This cannot be undone.')) {
      startTransition(async () => {
        const result = await deleteAnimalImage(imageId, imageUrl, animalId);
        if (result.success) {
          toast.success(result.message);
        } else {
          toast.error(result.message);
        }
      });
    }
  };

  if (images.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        This animal has no images yet.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((image) => (
        <div key={image.id} className="relative group border rounded-lg overflow-hidden">
          <Image
            src={image.url}
            alt="Animal image"
            width={300}
            height={300}
            className="object-cover w-full h-full aspect-square"
          />
          <div className="absolute top-2 right-2">
            <Button
              size="icon"
              variant="destructive"
              onClick={() => handleDelete(image.id, image.url)}
              disabled={isPending}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Delete image"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}