import { FilteredAnimalsPayload } from "@/app/lib/types";
import { ColumnDef } from "../../reusable-table";
import Image from "next/image";
import { CameraIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { AnimalListingStatus } from "@prisma/client";
import { calculateAgeString } from "@/app/lib/utils/date-utils";
import { EditButton } from "../edit-button";

export const petTableColumns: ColumnDef<FilteredAnimalsPayload>[] = [
  {
    header: "Name",
    cell: (pet) => (
      <div className="flex items-center space-x-3">
        <div className="shrink-0">
          {pet.animalImages && pet.animalImages[0]?.url ? (
            <Image
              src={pet.animalImages[0].url}
              className="h-8 w-8 rounded-full object-cover"
              width={32}
              height={32}
              alt={`${pet.name || "Pet"}'s picture`}
            />
          ) : (
            <div className="size-8 bg-gray-200 rounded-full flex items-center justify-center">
              <CameraIcon className="size-5 text-gray-500" />
            </div>
          )}
        </div>
        <div className="truncate text-sm font-medium text-gray-900">
          {pet.name}
        </div>
      </div>
    ),
  },
  {
    header: "Status",
    cell: (pet) => (
      <span className={clsx(
        "inline-flex rounded-full px-2 text-xs font-semibold capitalize leading-5",
        {
          [AnimalListingStatus.PUBLISHED]: "bg-green-100 text-green-800",
          [AnimalListingStatus.PENDING_ADOPTION]: "bg-yellow-100 text-yellow-800",
          [AnimalListingStatus.DRAFT]: "bg-blue-100 text-blue-800",
          [AnimalListingStatus.ARCHIVED]: "bg-gray-100 text-gray-800",
          // [AnimalListingStatus.ADOPTED]: "bg-purple-100 text-purple-800",
        }[pet.listingStatus] ?? "bg-gray-100 text-gray-800"
      )}>
        {pet.listingStatus.toString().toLowerCase().replace("_", " ")}
      </span>
    ),
  },
  {
    header: "Age",
    cell: (pet) => (
      <div className="truncate text-sm text-gray-700">
        {calculateAgeString({birthDate: pet.birthDate})}
      </div>
    ),
  },
  {
    header: "Location",
    cell: (pet) => (
      <div className="truncate text-sm text-gray-700">{`${pet.city}, ${pet.state}`}</div>
    ),
  },
  {
    header: "Species",
    cell: (pet) => (
      <div className="text-sm text-gray-700">{pet.species.name}</div>
    ),
  },
  {
    header: "Actions",
    cell: (pet) => (
      <div className="flex items-center justify-center gap-x-2">
        <EditButton link={`/dashboard/pets/${pet.id}/edit`} />
      </div>
    ),
    textAlign: "center",
  },
];