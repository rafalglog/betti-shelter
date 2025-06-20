import PageNotFoundOrAccessDenied from "../../ui/PageNotFoundOrAccessDenied";

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
