import { Authorize } from "@/components/auth/authorize";
import PageNotFoundOrAccessDenied from "@/components/PageNotFoundOrAccessDenied";
import UserCreateForm from "@/components/dashboard/users/user-create-form";
import { Permissions } from "@/app/lib/auth/permissions";

const Page = async () => {
  return (
    <Authorize
      permission={Permissions.MANAGE_ROLES}
      fallback={<PageNotFoundOrAccessDenied type="accessDenied" />}
    >
      <main>
        <UserCreateForm />
      </main>
    </Authorize>
  );
};

export default Page;
