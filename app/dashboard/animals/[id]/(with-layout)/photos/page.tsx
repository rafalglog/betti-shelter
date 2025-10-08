import { IDParamType } from "@/app/lib/types";
import UppyUploader from "@/components/dashboard/animals/photos/uppy-uploader";
import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { fetchAnimalForPhotosPage } from "@/app/lib/data/animals/animal.data";
import { Authorize } from "@/components/auth/authorize";
import PageNotFoundOrAccessDenied from "@/components/PageNotFoundOrAccessDenied";
import { Permissions } from "@/app/lib/auth/permissions";
import AnimalImageGallery from "@/components/dashboard/animals/photos/animal-image-gallery";

interface Props {
  params: IDParamType;
}

const Page = async ({ params }: Props) => {
  return (
    <Authorize
      permission={Permissions.ANIMAL_UPDATE}
      fallback={<PageNotFoundOrAccessDenied type="accessDenied" />}
    >
      <PageContent params={params} />
    </Authorize>
  );
};

const PageContent = async ({ params }: Props) => {
  const { id: animalId } = await params;
  const animal = await fetchAnimalForPhotosPage(animalId);

  if (!animal) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-semibold">
            Current Images for {animal.name}
          </CardTitle>
          <CardDescription>
            Manage the existing photos for this animal&apos;s profile. Hover over an image to delete it.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AnimalImageGallery images={animal.animalImages} animalId={animal.id} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-semibold">
            Upload New Images
          </CardTitle>
          <CardDescription>
            Add new photos to this animal&apos;s profile. Drag and drop images
            below or click to browse.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UppyUploader animalId={animalId} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;