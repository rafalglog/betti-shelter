import EditPetForm from "@/app/ui/dashboard/pets/edit-pet-form";
import { fetchAnimalById } from "@/app/lib/data/animals/animal.data";
import { fetchSpecies } from "@/app/lib/data/animals/public.data";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { shimmer, toBase64 } from "@/app/lib/utils/image-loading-placeholder";
import { IDParamType } from "@/app/lib/types";
import { DeletePetImage } from "@/app/ui/dashboard/pets/buttons/delete-pet-image";
import { Permissions } from "@/app/lib/auth/permissions";
import { hasPermission } from "@/app/lib/auth/hasPermission";
import { Authorize } from "@/components/auth/authorize";
import PageNotFoundOrAccessDenied from "@/components/PageNotFoundOrAccessDenied";

interface Props {
  params: IDParamType;
}

const Page = async ({ params }: Props) => {
  return (
    <Authorize
      permission={Permissions.ANIMAL_READ_DETAIL}
      fallback={<PageNotFoundOrAccessDenied type="accessDenied" />}
    >
      <PageContent params={params} />
    </Authorize>
  );
};

const PageContent = async ({ params }: Props) => {
  const { id: animalId } = await params;

  const pet = await fetchAnimalById(animalId);
  if (!pet) {
    notFound();
  }

  const speciesList = await fetchSpecies();
  const canManagePet = await hasPermission(Permissions.ANIMAL_UPDATE);

  return (
    <main>
      {/* uploaded images */}
      <div>
        <span className="block text-sm font-medium leading-6 text-gray-900">
          Uploaded images
        </span>
        <div className="flex flex-row gap-x-2 overflow-auto">
          {pet.animalImages.map((image, index) => (
            <div key={image.id} className="relative shrink-0">
              <Link href={image.url} target="_blank">
                <Image
                  key={image.id}
                  className="shrink-0 rounded-sm aspect-square min-w-[12%] cursor-pointer object-cover"
                  src={image.url}
                  height={100}
                  width={100}
                  placeholder={`data:image/svg+xml;base64,${toBase64(
                    shimmer(100, 100)
                  )}`}
                  alt={`image ${index}`}
                />
              </Link>
              <DeletePetImage id={image.id} />
            </div>
          ))}
        </div>
      </div>

      <EditPetForm
        pet={pet}
        speciesList={speciesList}
        canManagePet={canManagePet}
      />
    </main>
  );
};

export default Page;
