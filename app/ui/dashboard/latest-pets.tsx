import Image from "next/image";
import { fetchLatestPets } from "@/app/lib/data/pets/pet.data";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { shimmer, toBase64 } from "@/app/lib/utils/image-loading-placeholder";
import { calculateAgeString } from "@/app/lib/utils/date-utils";
import Link from "next/link";

const LatestPets = async () => {
  const latestPets = await fetchLatestPets();

  return (
    <div className="flex w-full flex-col md:col-span-4">
      <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(160px,1fr))]">
        {latestPets.map((pet) => {
          return (
            <Link
              href={`/dashboard/pets/${pet.id}/edit`}
              key={pet.id}
              className="max-w-64 bg-white border border-gray-200 p-4 shadow rounded-lg flex flex-col items-center justify-start hover:shadow-lg transition-shadow duration-150 ease-in-out group"
            >
              <div className="relative w-full max-w-[224px] aspect-square mb-4 overflow-hidden rounded-md">
                {pet.petImages && pet.petImages.length > 0 ? (
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

              <p
                className="font-semibold text-base w-full text-center overflow-hidden truncate px-1"
                title={pet.name}
              >
                {pet.name}
              </p>
              <p
                className="text-sm text-gray-500 text-center w-full overflow-hidden truncate px-1"
                title={calculateAgeString({ birthDate: pet.birthDate})}
              >
                {calculateAgeString({ birthDate: pet.birthDate})}
              </p>
              <p className="text-sm text-gray-500 text-center w-full overflow-hidden truncate px-1">{`${pet.city}, ${pet.state}`}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default LatestPets;
