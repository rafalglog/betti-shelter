import { fetchPublicPagePetById } from "@/app/lib/data/public.data";
import { IDParamType } from "@/app/lib/types";
import {
  calculateAgeString,
  formatDateToLongString,
} from "@/app/lib/utils/date-utils";
import PetGallery from "@/components/public-pages/pets/pet-gallery";
import { auth } from "@/auth";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPinIcon } from "@heroicons/react/24/outline";
import { getTranslations } from "next-intl/server";

interface Props {
  params: IDParamType;
}

const Page = async ({ params }: Props) => {
  const { id: animalId } = await params;
  const t = await getTranslations("petDetail");
  const session = await auth();
  const currentUserPersonId = session?.user?.personId;

  const animal = await fetchPublicPagePetById(animalId);
  if (!animal) {
    notFound();
  }

  // Calculate age string
  const ageString = calculateAgeString({
    birthDate: animal.birthDate,
    simple: true,
  });

  // Format birth date for display using the utility function
  const formattedBirthDate = formatDateToLongString(animal.birthDate);

  const currentUserHasActiveApplication =
    currentUserPersonId &&
    animal.adoptionApplications?.some(
      (app) => app.userId === currentUserPersonId
    );

  const isLikedByCurrentUser = animal.likes && animal.likes.length > 0;

  // Prepare array data for display
  const breedString =
    animal.breeds?.map((b) => b.name).join(", ") || t("mixedBreed");
  const colorString = animal.colors?.map((c) => c.name).join(", ") || "";


  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6 lg:gap-y-0">
      <PetGallery
        images={animal.animalImages}
        currentUserPersonId={currentUserPersonId}
        animalId={animal.id}
        isLikedByCurrentUser={isLikedByCurrentUser}
      />

      <div className="flex flex-col space-y-5">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800">
            {animal.name}
          </h1>
          <p className="text-sm text-gray-500 mt-1 flex items-center">
            <MapPinIcon className="size-5 inline mr-1 text-red-400" />
            {animal.city}, {animal.state}
          </p>
        </div>

        <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-200">
          <PetCardDetail label={t("species")} value={animal.species.name} />
          <PetCardDetail label={t("breed")} value={breedString} />
          <PetCardDetail label={t("color")} value={colorString} />
          <PetCardDetail label={t("sex")} value={animal.sex} />
          <PetCardDetail label={t("size")} value={animal.size} />
          <PetCardDetail
            label={t("spayedNeutered")}
            value={animal.isSpayedNeutered ? t("yes") : t("no")}
          />
          <PetCardDetail label={t("age")} value={ageString} />
          <PetCardDetail label={t("dob")} value={formattedBirthDate} />
          <PetCardDetail label={t("weight")} value={animal.weightKg} unit="kg" />
          <PetCardDetail label={t("height")} value={animal.heightCm} unit="cm" />
        </div>
        
        {animal.description && (
          <div className="pt-4 border-t border-gray-200">
            <h3 className="font-medium text-gray-700 text-lg mb-2">
              {t("about", { name: animal.name })}
            </h3>
            <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">
              {animal.description}
            </p>
          </div>
        )}
        
        {animal.characteristics && animal.characteristics.length > 0 && (
          <div className="pt-4 border-t border-gray-200">
            <h3 className="font-medium text-gray-700 text-lg mb-3">
              {t("personality")}
            </h3>
            <div className="flex flex-wrap gap-3">
              {animal.characteristics.map((char) => (
                <span
                  key={char.name}
                  className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full"
                >
                  {char.name}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="pt-2">
          {animal.listingStatus === "PENDING_ADOPTION" ? (
            <div className="block w-full sm:w-auto text-center bg-yellow-500 text-white px-8 py-3 rounded-md font-semibold text-lg shadow-sm cursor-not-allowed">
              {t("pendingAdoption")}
            </div>
          ) : currentUserHasActiveApplication ? (
            <Link
              href="/dashboard/my-applications"
              className="block w-full sm:w-auto text-center bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-md font-semibold text-lg transition-colors duration-150 ease-in-out shadow-sm hover:shadow-md"
            >
              {t("viewApplication")}
            </Link>
          ) : (
            <Link
              href={`${animalId}/adopt`}
              className="block w-full sm:w-auto text-center bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md font-semibold text-lg transition-colors duration-150 ease-in-out shadow-sm hover:shadow-md"
            >
              {t("adopt")}
            </Link>
          )}
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
