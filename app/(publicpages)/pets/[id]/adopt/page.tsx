import { getAnimalForApplication } from "@/app/lib/data/myApplications.data";
import { IDParamType, AnimalForApplicationPayload } from "@/app/lib/types";
import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import MyAdoptionAppSkeleton from "@/components/dashboard/my-applications/myAdoptionApp-skeleton";
import { MyApplicationForm } from "@/components/dashboard/my-applications/myApplication-form";

async function AdoptionApplicationContent({ animalId }: { animalId: string }) {
  // Get animal data for the application 
  const animalToAdopt: AnimalForApplicationPayload | null =
    await getAnimalForApplication(animalId);

  // If no animal is found, show a 404 page 
  if (!animalToAdopt) {
    notFound();
  }

  // Check if the current user already has an application for this animal
  const currentUserHasActiveApplication =
    animalToAdopt.adoptionApplications &&
    animalToAdopt.adoptionApplications.length > 0;

  // If an application exists, redirect to the dashboard 
  if (currentUserHasActiveApplication) {
    redirect(`/dashboard/my-applications`);
  }

  // Once data is ready and checks have passed, render the client component with the data
  return <MyApplicationForm animal={animalToAdopt} />;
}

interface Props {
  params: IDParamType;
}

const Page = async ({ params }: Props) => {
  const { id } = await params; // 

  // Get user session information 
  const session = await auth();
  if (!session || !session.user) {
    redirect("/api/auth/signin"); // 
  }

  return (
    <main className="max-w-3xl mx-auto pb-10 pt-5">
      <h1 className="text-3xl font-opensans font-medium text-gray-800 mb-6 text-center">
        Adoption Application
      </h1>
      <Suspense fallback={<MyAdoptionAppSkeleton />}>
        <AdoptionApplicationContent animalId={id} />
      </Suspense>
    </main>
  );
};
export default Page;