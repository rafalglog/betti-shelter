import { fetchUserById } from "@/app/lib/data/users/user.data";
import { notFound } from "next/navigation";
import EditUserForm from "@/app/ui/dashboard/users/edit-user-form";
import { IDParamType } from "@/app/lib/types";
import { Permissions } from "@/app/lib/auth/permissions";
import { Authorize } from "@/components/auth/authorize";
import PageNotFoundOrAccessDenied from "@/components/PageNotFoundOrAccessDenied";

interface Props {
  params: IDParamType;
}

const Page = async ({ params }: Props) => {
  return (
    <Authorize
      permission={Permissions.ANIMAL_READ_DETAIL}
      fallback={<PageNotFoundOrAccessDenied type="accessDenied" />}
    >
      <PageContent params={params} />
    </Authorize>
  );
};

const PageContent = async ({ params }: Props) => {
  const { id: userId } = await params;

  const user = await fetchUserById(userId);
  if (!user) {
    notFound();
  }

  return (
    <main>
      <EditUserForm user={user} />
    </main>
  );
};

export default Page;
