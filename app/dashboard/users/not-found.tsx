import PageNotFoundOrAccessDenied from "../../ui/PageNotFoundOrAccessDenied";

const Page = () => {
  return (
    <PageNotFoundOrAccessDenied
      type="notFound"
      itemName="User"
      buttonGoTo="Users"
      redirectUrl="/dashboard/users"
    />
  );
};

export default Page;
