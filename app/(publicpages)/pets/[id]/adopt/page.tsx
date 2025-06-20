import { getPetForApplication } from "@/app/lib/data/myApplications.data";
import { IDParamType, PetForApplicationPayload } from "@/app/lib/types";
import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import MyAdoptionAppSkeleton from "@/app/ui/dashboard/myApplication/myAdoptionApp-skeleton";
import CreateMyAdoptionAppForm from "@/app/ui/dashboard/myApplication/create-MyAdoptionApp-form";

async function AdoptionApplicationContent({ petId }: { petId: string }) {
  // Get pet data for the application 
  const petToAdopt: PetForApplicationPayload | null =
    await getPetForApplication(petId);

  // If no pet is found, show a 404 page 
  if (!petToAdopt) {
    notFound();
  }

  // Check if the current user already has an application for this pet 
  const currentUserHasActiveApplication =
    petToAdopt.adoptionApplications &&
    petToAdopt.adoptionApplications.length > 0;

  // If an application exists, redirect to the dashboard 
  if (currentUserHasActiveApplication) {
    redirect(`/dashboard/my-applications`);
  }

  // Once data is ready and checks have passed, render the client component with the data
  return <CreateMyAdoptionAppForm petId={petId} petToAdopt={petToAdopt} />;
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
        <AdoptionApplicationContent petId={id} />
      </Suspense>
    </main>
  );
};
export default Page;