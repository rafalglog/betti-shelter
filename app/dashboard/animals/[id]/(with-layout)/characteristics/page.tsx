import { fetchAnimalCharacteristics } from "@/app/lib/data/animals/animal-characteristics.data";
import { IDParamType } from "@/app/lib/types";
import AnimalCharacteristicsManager from "@/components/dashboard/animals/characteristics/characteristics";
import { Authorize } from "@/components/auth/authorize";
import PageNotFoundOrAccessDenied from "@/components/PageNotFoundOrAccessDenied";
import { Permissions } from "@/app/lib/auth/permissions";

interface Props {
  params: IDParamType;
}

const Page = async ({ params }: Props) => {
  return (
    <Authorize
      permission={Permissions.ANIMAL_CHARACTERISTICS_UPDATE}
      fallback={<PageNotFoundOrAccessDenied type="accessDenied" />}
    >
      <PageContent params={params} />
    </Authorize>
  );
};

const PageContent = async ({ params }: Props) => {
  const { id: animalId } = await params;
  const animalCharacteristics = await fetchAnimalCharacteristics(animalId);

  return (
    <AnimalCharacteristicsManager 
      animalCharacteristics={animalCharacteristics} 
      animalId={animalId} 
    />
  );
};

export default Page;