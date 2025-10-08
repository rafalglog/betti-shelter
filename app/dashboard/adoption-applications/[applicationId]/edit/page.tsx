import { Suspense } from "react";
import { notFound } from "next/navigation";
import { fetchApplicationById } from "@/app/lib/data/user-application.data";
import { StaffApplicationUpdateForm } from "@/components/dashboard/adoption-applications/adoption-staff-edit-application-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

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
    notFound();
  }

  return (
    <main className="container mx-auto">
      <Button asChild variant="ghost" className="mb-4">
        <Link href="/dashboard/adoption-applications">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Applications
        </Link>
      </Button>

      <Suspense fallback={<div>Loading application...</div>}>
        <StaffApplicationUpdateForm application={userApplication} animal={animal} />
      </Suspense>
    </main>
  );
};

export default Page;