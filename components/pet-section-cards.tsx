import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import { AnimalByIDPayload, AnimalWithDetailsPayload, IDParamType } from "@/app/lib/types";
import { fetchAnimalById } from "@/app/lib/data/animals/animal.data";
import Link from "next/link";

const petInfo = [
  {
    label: "Size",
    value: "Large",
  },
  {
    label: "Age",
    value: "15",
  },
  {
    label: "Microchip",
    value: "Male",
  },
  {
    label: "Breed",
    value: "Labrador",
  },
];

interface Props {
  params: IDParamType;
}

const AnimalSectionCards = async ({ params }: Props) => {
  const { id } = await params;

  const animal: AnimalWithDetailsPayload | null = await fetchAnimalById(id);
  if (!animal) {
    return "Animal not found";
  }

  return (
    <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:bg-card *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-2">
      {/* Animal Details Card */}
      <Card className="@container/card">
        <CardHeader>
          {/* Use the animal's actual name */}
          <CardTitle className="font-semibold">{animal.name}</CardTitle>
          <CardDescription>
            {animal.breeds.map((breed) => breed.name).join(", ")}
          </CardDescription>
          <CardAction>
            <Badge variant="outline" className="capitalize">
              {animal.listingStatus.toLowerCase()}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardContent>
          {/* Placeholder for future image implementation */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex size-20 items-center justify-center rounded-full bg-muted text-muted-foreground">
              Photo
            </div>
            <div>
              <div>
                <span className="font-semibold text-gray-600">Species: </span>
                <span>{animal.species.name}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-600">Primary Color: </span>
                {/* Display the first color, if available */}
                <span>{animal.colors[0]?.name || "N/A"}</span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col items-end gap-1.5 text-sm">
          <Button asChild className="h-8">
            <Link href={`/dashboard/outcomes/create?animalId=${animal.id}`}>Create Outcome</Link>
          </Button>
        </CardFooter>
      </Card>

      {/* Additional Information Card */}
      <Card className="@container/card">
        <CardHeader>
          <CardTitle className="font-semibold">Information</CardTitle>
          <CardDescription>Additional pet details</CardDescription>
          <CardAction>
            {/* Link to the edit page */}
            <Button asChild className="h-8">
              <Link href={`/dashboard/animals/${animal.id}/edit`}>Edit</Link>
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          {/* Map over the dynamic petInfo array */}
          <div className="grid grid-cols-2 text-sm">
            {petInfo.map((item) => (
              <div key={item.label} className="mb-2">
                <span className="font-semibold text-gray-600">{item.label}: </span>
                <span className="capitalize">{item.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnimalSectionCards;
