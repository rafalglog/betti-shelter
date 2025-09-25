import PageNotFoundOrAccessDenied from "../../../components/PageNotFoundOrAccessDenied";

const Page = () => {
  return (
    <PageNotFoundOrAccessDenied
      type="notFound"
      itemName="Application"
      buttonGoTo="Applications"
      redirectUrl="/dashboard/applications"
    />
  );
};

export default Page;
