import { fetchFilteredPublishedPetsWithCategory } from "@/app/lib/data/pets/public.data";
import { auth } from "@/auth";
import { PhotoIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { shimmer, toBase64 } from "@/app/lib/utils/image-loading-placeholder";
import LikeButton from "./like-button";

interface Props {
  query: string;
  currentPage: number;
  speciesName: string;
}

const PetGrid = async ({ query, currentPage, speciesName }: Props) => {
  // User session
  const session = await auth();
  const currentUserId = session?.user?.id;

  const pets = await fetchFilteredPublishedPetsWithCategory(
    query,
    currentPage,
    speciesName
  );

  return (
    <div className="mt-6 flex gap-3 flex-wrap">
      {pets.map((pet) => {
        const isLikedByCurrentUser = !!(
          currentUserId &&
          pet.likes &&
          pet.likes.some((like) => like.userId === currentUserId)
        );

        return (
          <div
            key={pet.id}
            className="bg-white relative border border-gray-200 p-4 shadow-md rounded-md w-40 flex flex-col items-center justify-center"
          >
            <div className="absolute top-2 right-2 z-10">
              <LikeButton
                petId={pet.id}
                currentUserId={currentUserId}
                isLikedByCurrentUser={isLikedByCurrentUser}
              />
            </div>

            <Link href={`/pets/${pet.id}`} className="w-full">
              <div className="w-full flex flex-col items-center">
                {pet.petImages && pet.petImages.length > 0 ? (
                  <Image
                    src={pet.petImages[0].url}
                    alt={`Photo of ${pet.name}`}
                    width={112}
                    height={112}
                    placeholder={`data:image/svg+xml;base64,${toBase64(
                      shimmer(112, 112)
                    )}`}
                    className="rounded-md w-28 h-28 object-cover mb-2"
                  />
                ) : (
                  <div className="w-28 h-28 bg-gray-200 rounded-md flex items-center justify-center mb-2">
                    <PhotoIcon className="w-8 h-8 text-gray-500" />
                  </div>
                )}
                <p
                  className="font-medium w-full text-center overflow-hidden truncate px-1"
                  title={pet.name}
                >
                  {pet.name}
                </p>
                <h2 className="text-sm text-gray-600 text-center w-full overflow-hidden truncate px-1">{`${pet.city}, ${pet.state}`}</h2>
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default PetGrid;
