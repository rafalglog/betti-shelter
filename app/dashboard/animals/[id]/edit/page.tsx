import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { notFound } from "next/navigation";
import { fetchAnimalById, fetchColors, fetchPartners, fetchSpecies } from "@/app/lib/data/animals/animal.data";
import AnimalForm from "@/app/ui/dashboard/pets/animal-form";
interface Props {
  params: Promise<{ id: string }>;
}

const Page = async ({ params }: Props) => {
  const { id: animalId } = await params;

  const animal = await fetchAnimalById(animalId);
  const partners = await fetchPartners();
  const colors = await fetchColors();
  const speciesList = await fetchSpecies();

  if (!animal) {
    notFound();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Animal</CardTitle>
        <CardDescription>Edit the details for this Animal.</CardDescription>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<div>Loading animal edit form...</div>}>
          <AnimalForm speciesList={speciesList} partners={partners} colors={colors} animal={animal} />
        </Suspense>
      </CardContent>
    </Card>
  );
};

export default Page;
