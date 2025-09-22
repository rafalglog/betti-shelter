import { fetchAnimalCharacteristics } from "@/app/lib/data/animals/animal-characteristics.data";
import { IDParamType } from "@/app/lib/types";
import AnimalCharacteristicsManager from "@/components/dashboard/characteristics/characteristics";

interface Props {
  params: IDParamType;
}

const Page = async ({ params }: Props) => {
  const { id: animalId } = await params;

  const animalCharacteristics = await fetchAnimalCharacteristics(animalId)

  return (
    <AnimalCharacteristicsManager animalCharacteristics={animalCharacteristics} animalId={animalId} />
  )
}

export default Page;