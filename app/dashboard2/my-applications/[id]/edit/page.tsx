import { notFound } from "next/navigation";
import { IDParamType } from "@/app/lib/types";
import { fetchMyAppById } from "@/app/lib/data/myApplications.data";
import EditMyAdoptionAppForm from "@/app/ui/dashboard/myApplication/edit-MyAdoptionApp-form";
import { Permissions } from "@/app/lib/auth/permissions";
import { Authorize } from "@/components/auth/authorize";
import PageNotFoundOrAccessDenied from "@/components/PageNotFoundOrAccessDenied";
import { Suspense } from "react";
import MyAdoptionAppSkeleton from "@/components/dashboard/my-applications/myAdoptionApp-skeleton";

interface Props {
  params: IDParamType;
}

const Page = async ({ params }: Props) => {
  return (
    <Authorize
      permission={Permissions.MY_APPLICATIONS_UPDATE}
      fallback={<PageNotFoundOrAccessDenied type="accessDenied" />}
    >
      <Suspense fallback={<MyAdoptionAppSkeleton />}>
        <PageContent params={params} />
      </Suspense>
    </Authorize>
  );
};

const PageContent = async ({ params }: Props) => {
  const { id: myApplicationId } = await params;

  const myApplication = await fetchMyAppById(myApplicationId);
  if (!myApplication) {
    notFound();
  }

  return (
    <main>
      <EditMyAdoptionAppForm
        myApplicationId={myApplicationId}
        myApplication={myApplication}
      />
    </main>
  );
};

export default Page;
