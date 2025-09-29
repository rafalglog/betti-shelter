import { Suspense } from "react";
import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { fetchApplicationById } from "@/app/lib/data/user-application.data";
import { StaffApplicationUpdateForm } from "@/components/dashboard/adoption-applications/adoption-staff-edit-application-form";

interface Props {
  params: Promise<{ applicationId: string }>;
  
}

const Page = async ({ params }: Props) => {
  const { applicationId } = await params;

  const userApplication = await fetchApplicationById(applicationId);

  if (!userApplication) {
    notFound();
  }

  const animal = userApplication.animal;
  
  if (!animal) {
    console.error("Application found, but it has no associated animal.");
    notFound();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit User Adoption Application</CardTitle>
        <CardDescription>

        </CardDescription>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<div>Loading user application edit form...</div>}>
          <StaffApplicationUpdateForm application={userApplication} animal={animal} />
        </Suspense>
      </CardContent>
    </Card>
  );
};

export default Page;