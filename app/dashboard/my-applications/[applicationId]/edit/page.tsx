import { Suspense } from "react";
import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MyApplicationForm } from "@/components/dashboard/my-adoption-applications/my-adoption-application-form";
import { fetchMyAppById } from "@/app/lib/data/my-applications.data";

interface Props {
  params: Promise<{ applicationId: string }>;
}

const Page = async ({ params }: Props) => {
  const { applicationId } = await params;

  const myApplication = await fetchMyAppById(applicationId);

  if (!myApplication) {
    notFound();
  }

  const animal = myApplication.animal;
  
  if (!animal) {
    console.error("Application found, but it has no associated animal.");
    notFound();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Adoption Application</CardTitle>
        <CardDescription>
          Make changes to your application for {animal.name}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<div>Loading adoption application edit form...</div>}>
          <MyApplicationForm application={myApplication} animal={animal} />
        </Suspense>
      </CardContent>
    </Card>
  );
};

export default Page;