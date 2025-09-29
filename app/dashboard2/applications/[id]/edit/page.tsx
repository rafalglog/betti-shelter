import { notFound } from "next/navigation";
import { IDParamType } from "@/app/lib/types";
import EditApplicationForm from "@/app/ui/dashboard/applications/edit-application-form";
import { fetchApplicationById } from "@/app/lib/data/user-application.data";
import { Permissions } from "@/app/lib/auth/permissions";
import { hasPermission } from "@/app/lib/auth/hasPermission";
import { Authorize } from "@/components/auth/authorize";
import PageNotFoundOrAccessDenied from "@/components/PageNotFoundOrAccessDenied";
import Link from "next/link";

interface Props {
  params: IDParamType;
}

const Page = async ({ params }: Props) => {
  return (
    <Authorize
      permission={Permissions.APPLICATIONS_READ_LISTING}
      fallback={<PageNotFoundOrAccessDenied type="accessDenied" />}
    >
      <PageContent params={params} />
    </Authorize>
  );
};

const PageContent = async ({ params }: Props) => {
  const { id: applicationId } = await params;

  const application = await fetchApplicationById(applicationId);
  if (!application) {
    notFound();
  }

  const canManageApplication = await hasPermission(
    Permissions.APPLICATIONS_MANAGE_STATUS
  );

  return (
    <main>
      <div className="p-4 my-8 bg-blue-50 border-l-3 border-blue-300 flex items-start">
        <p className="text-blue-800">
          <strong>Staff Note:</strong> This application is for adopting the <Link href={`/pets/${application.petId}`} className="font-semibold text-amber-900">{application.pet.name}</Link>. Please review the user's details and ensure all requirements for adoption are met before proceeding.
        </p>
      </div>

      <EditApplicationForm
        application={application}
        canManage={canManageApplication}
      />
    </main>
  );
};

export default Page;
