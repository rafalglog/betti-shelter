import { fetchFilteredPublishedPetsWithCategory } from "@/app/lib/data/pets/public.data";
import { auth } from "@/auth";
import { PhotoIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { shimmer, toBase64 } from "@/app/lib/utils/image-loading-placeholder";
import LikeButton from "./like-button";
import { calculateAgeString } from "@/app/lib/utils/date-utils";

interface Props {
  query: string;
  currentPage: number;
  speciesName: string;
}

const PetGrid = async ({ query, currentPage, speciesName }: Props) => {
  const session = await auth();
  const currentUserId = session?.user?.id;

  const pets = await fetchFilteredPublishedPetsWithCategory(
    query,
    currentPage,
    speciesName
  );

  return (
    <div className="my-6 mb-12 grid gap-4 gap-y-14 grid-cols-[repeat(auto-fit,minmax(theme('spacing.40'),1fr))]">
      {pets.map((pet) => {
        const isLikedByCurrentUser = !!(currentUserId && pet.likes?.length > 0);
        const ageString = calculateAgeString({
          birthDate: pet.birthDate,
          simple: true,
        });

        return (
          <Link
            href={`/pets/${pet.id}`}
            key={pet.id}
            className="relative max-w-[224px] bg-white block hover:shadow-lg transition-shadow duration-150 ease-in-out group rounded-lg"
          >
            <div className="relative w-full aspect-square overflow-hidden rounded-lg">
              {pet.petImages?.length > 0 ? (
                <Image
                  src={pet.petImages[0].url}
                  alt={`Photo of ${pet.name}`}
                  fill
                  sizes="(max-width: 480px) 80vw, (max-width: 768px) 40vw, (max-width: 1024px) 30vw, 224px"
                  placeholder={`data:image/svg+xml;base64,${toBase64(
                    shimmer(224, 224)
                  )}`}
                  className="rounded-md object-cover group-hover:scale-110 transition-transform duration-300 ease-in-out"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center">
                  <PhotoIcon className="w-16 h-16 text-gray-400" />
                </div>
              )}
            </div>

            <div className="absolute bottom-[-26px] left-2 right-2">
              <div className="text-sm flex flex-col px-4 py-2 bg-white shadow-lg rounded-lg relative">
                <span className="font-semibold w-full">{pet.name}</span>
                <div className="text-xs text-gray-500">
                  <span>{`${ageString} • ${pet.city}`}</span>
                </div>
                <div className="absolute -top-4 right-2 z-10">
                  <LikeButton
                    petId={pet.id}
                    currentUserId={currentUserId}
                    isLikedByCurrentUser={isLikedByCurrentUser}
                  />
                </div>
              </div>
            </div>
          </Link>


          // <Link
          //   href={`/pets/${pet.id}`}
          //   key={pet.id}
          //   className="max-w-64 bg-white border border-gray-200 rounded-lg flex flex-col items-center justify-start hover:shadow-lg shadow transition-shadow duration-150 ease-in-out group"
          // >
          // <div className="relative w-full max-w-[224px] aspect-square overflow-hidden rounded-lg">
          //     {pet.petImages && pet.petImages.length > 0 ? (
          //       <Image
          //         src={pet.petImages[0].url}
          //         alt={`Photo of ${pet.name}`}
          //         fill
          //         sizes="(max-width: 480px) 80vw, (max-width: 768px) 40vw, (max-width: 1024px) 30vw, 224px"
          //         placeholder={`data:image/svg+xml;base64,${toBase64(
          //           shimmer(224, 224)
          //         )}`}
          //         className="rounded-md object-cover group-hover:scale-110 transition-transform duration-300 ease-in-out"
          //       />
          //     ) : (
          //       <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center">
          //         <PhotoIcon className="w-16 h-16 text-gray-400" />
          //       </div>
          //     )}
          //   </div>

          //   <div className="flex flex-col w-full px-5 pt-3 pb-3 relative">
          //     <div className="absolute -top-4 right-2 z-10">
          //       <LikeButton
          //         petId={pet.id}
          //         currentUserId={currentUserId}
          //         isLikedByCurrentUser={isLikedByCurrentUser}
          //       />
          //     </div>
          //     <span
          //       className="font-semibold w-full"
          //     >
          //       {pet.name}
          //     </span>
          //     <span className="text-sm text-gray-500">{ageString} • {pet.city}</span>
          //   </div>
          // </Link>



          // <Link
          //   href={`/pets/${pet.id}`}
          //   key={pet.id}
          //   className="max-w-64 bg-white border border-gray-200 p-4 shadow rounded-lg flex flex-col items-center justify-start hover:shadow-lg transition-shadow duration-150 ease-in-out group"
          // >
          //   <div className="relative w-full max-w-[224px] aspect-square mb-4 overflow-hidden rounded-md">
          //     {pet.petImages && pet.petImages.length > 0 ? (
          //       <Image
          //         src={pet.petImages[0].url}
          //         alt={`Photo of ${pet.name}`}
          //         fill
          //         sizes="(max-width: 480px) 80vw, (max-width: 768px) 40vw, (max-width: 1024px) 30vw, 224px"
          //         placeholder={`data:image/svg+xml;base64,${toBase64(
          //           shimmer(224, 224)
          //         )}`}
          //         className="rounded-md object-cover group-hover:scale-110 transition-transform duration-300 ease-in-out"
          //       />
          //     ) : (
          //       <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center">
          //         <PhotoIcon className="w-16 h-16 text-gray-400" />
          //       </div>
          //     )}
          //     <div className="absolute top-2 right-2 z-10">
          //       <LikeButton
          //         petId={pet.id}
          //         currentUserId={currentUserId}
          //         isLikedByCurrentUser={isLikedByCurrentUser}
          //       />
          //     </div>
          //   </div>

          //   <div>
          //     <p
          //       className="font-semibold text-base w-full text-center overflow-hidden truncate px-1"
          //       title={pet.name}
          //     >
          //       {pet.name}
          //     </p>
          //     <p className="text-sm text-gray-500 text-center w-full overflow-hidden truncate px-1">{`${pet.city}, ${pet.state}`}</p>
          //   </div>
          // </Link>
        );
      })}
    </div>
  );
};

export default PetGrid;
