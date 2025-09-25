import PageNotFoundOrAccessDenied from "../../../components/PageNotFoundOrAccessDenied";

const Page = () => {
  return (
    <PageNotFoundOrAccessDenied
      type="notFound"
      itemName="Animal"
      buttonGoTo="Animals"
      redirectUrl="/dashboard/animals"
    />
  );
};

export default Page;
