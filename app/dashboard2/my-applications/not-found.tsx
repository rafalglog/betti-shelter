import PageNotFoundOrAccessDenied from "../../../components/PageNotFoundOrAccessDenied";

const Page = () => {
  return (
    <PageNotFoundOrAccessDenied
      type="notFound"
      itemName="Application"
      buttonGoTo="My Applications"
      redirectUrl="/dashboard/my-applications"
    />
  );
};

export default Page;
