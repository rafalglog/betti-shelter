import { fetchPublicPagePetById } from "@/app/lib/data/pets/public.data";
import { IDParamType } from "@/app/lib/types";
import {
  calculateAgeString,
  formatDateToLongString,
} from "@/app/lib/utils/date-utils";
import PetGallery from "@/app/ui/publicpages/pet-gallery";
import { auth } from "@/auth";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPinIcon } from "@heroicons/react/24/outline";

interface Props {
  params: IDParamType;
}

const Page = async ({ params }: Props) => {
  const { id: petId } = await params;

  const session = await auth();
  const currentUserId = session?.user?.id;

  const pet = await fetchPublicPagePetById(petId);
  if (!pet) {
    notFound();
  }

  // Calculate age string
  const ageString = calculateAgeString({
    birthDate: pet.birthDate,
    simple: true,
  });

  // Format birth date for display using the utility function
  const formattedBirthDate = formatDateToLongString(pet.birthDate);

  const currentUserHasActiveApplication =
    currentUserId &&
    pet.adoptionApplications?.some((app) => app.userId === currentUserId);

  const isLikedByCurrentUser = pet.likes && pet.likes.length > 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6 lg:gap-y-0">
      <PetGallery
        images={pet.petImages}
        currentUserId={currentUserId}
        petId={pet.id}
        isLikedByCurrentUser={isLikedByCurrentUser}
      />

      {/* pet details */}
      <div className="flex flex-col space-y-5">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800">{pet.name}</h1>
          <p className="text-sm text-gray-500 mt-1 flex items-center">
            <MapPinIcon className="size-5 inline mr-1 text-red-400" />
            {pet.city}, {pet.state}
          </p>
        </div>

        <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-200">
          <PetCardDetail label="Species" value={pet.species.name} />
          <PetCardDetail label="Age" value={ageString} />
          <PetCardDetail label="Date of Birth" value={formattedBirthDate} />
          <PetCardDetail label="Weight" value={pet.weightKg} unit="kg" />
          <PetCardDetail label="Height" value={pet.heightCm} unit="cm" />
        </div>

        {pet.description && (
          <div className="pt-4 border-t border-gray-200">
            <h3 className="font-medium text-gray-700 text-lg mb-2">
              About {pet.name}
            </h3>
            <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">
              {pet.description}
            </p>
          </div>
        )}

        <div className="pt-2">
          {
            pet.listingStatus === "PENDING_ADOPTION" ? (
              <div className="block w-full sm:w-auto text-center bg-yellow-500 text-white px-8 py-3 rounded-md font-semibold text-lg shadow-sm cursor-not-allowed">
                Pending Adoption
              </div>
            ) :
            currentUserHasActiveApplication ? (
              <Link
                href="/dashboard/my-applications"
                className="block w-full sm:w-auto text-center bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-md font-semibold text-lg transition-colors duration-150 ease-in-out shadow-sm hover:shadow-md"
              >
                View Your Application
              </Link>
            ) : (
              <Link
                href={`${petId}/adopt`}
                className="block w-full sm:w-auto text-center bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md font-semibold text-lg transition-colors duration-150 ease-in-out shadow-sm hover:shadow-md"
              >
                Adopt
              </Link>
            )
          }
        </div>
      </div>
    </div>
  );
};

const PetCardDetail = ({ label, value, unit }: PetDetailProps) => {
  // If value is null, undefined, or an empty string, don't render the detail.
  // We allow 0 as a valid value (e.g., 0 years old for a very young pet).
  if (value === null || typeof value === "undefined" || value === "") {
    return null;
  }
  return (
    <div className="bg-gray-50 p-4 rounded border border-gray-200/60 text-center min-w-36 max-w-48 flex-grow">
      <div className="font-semibold text-gray-700">{label}</div>
      <div>
        {value} {unit && ` ${unit}`}
      </div>
    </div>
  );
};

interface PetDetailProps {
  label: string;
  value: string | number | null | undefined;
  unit?: string;
}

export default Page;
