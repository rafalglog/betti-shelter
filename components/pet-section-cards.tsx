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
import { AnimalByIDPayload, IDParamType } from "@/app/lib/types";
import { fetchAnimalById } from "@/app/lib/data/animals/animal.data";

const petRightInfo = [
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

  const animal: AnimalByIDPayload | null = await fetchAnimalById(id);
  if (!animal) {
    return "Animal not found";
  }

  return (
    <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:bg-card *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-2">
      <Card className="@container/card">
        <CardHeader>
          <CardTitle className="font-semibold tabular-nums">Fido</CardTitle>
          <CardDescription>Pet information</CardDescription>
          <CardAction>
            <Badge variant="outline" className="capitalize">
              {animal.listingStatus.toLowerCase()}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 text-sm">
            <div className="flex flex-col items-center">
              <div className="size-20 rounded-full bg-gray-800" />
            </div>
            <div>
              <div>
                <span className="text-gray-600">Species: </span>
                <span>{animal.breeds[0].species.name}</span>
              </div>
              <div>
                <span className="text-gray-600">Breed: </span>
                <span>{animal.breeds.map((breed) => breed.name).join(", ")}</span>
              </div>
              <div>
                <span className="text-gray-600">Sex: </span>
                <span>{animal.sex}</span>
              </div>
              <div>
                <span className="text-gray-600">Size: </span>
                <span>{animal.size}</span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col items-end gap-1.5 text-sm">
          <Button className="h-8">Details</Button>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardTitle className="font-semibold tabular-nums">
            Information
          </CardTitle>
          <CardDescription>Pet information</CardDescription>
          <CardAction>
            <Button className="h-8">Edit</Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2">
            {/* <div>
              {petLeftInfo.map((item) => (
                <div key={item.value}>
                  <span className="text-gray-600">{item.label}: </span>
                  <span>{item.value}</span>
                </div>
              ))}
            </div> */}

            <div>
              {petRightInfo.map((item) => (
                <div key={item.value}>
                  <span className="text-gray-600">{item.label}: </span>
                  <span>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnimalSectionCards;
