import PageNotFoundOrAccessDenied from "../../../components/PageNotFoundOrAccessDenied";

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
