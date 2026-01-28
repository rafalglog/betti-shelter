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
import { getTranslations } from "next-intl/server";

interface Props {
  params: Promise<{ applicationId: string }>;
}

const Page = async ({ params }: Props) => {
  const t = await getTranslations("dashboard");
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
        <CardTitle>{t("pages.myApplications.editTitle")}</CardTitle>
        <CardDescription>
          {t("pages.myApplications.editDescription", { name: animal.name })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<div>{t("common.loadingAdoptionApplicationEdit")}</div>}>
          <MyApplicationForm application={myApplication} animal={animal} />
        </Suspense>
      </CardContent>
    </Card>
  );
};

export default Page;
