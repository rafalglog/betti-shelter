import PageNotFoundOrAccessDenied from "../../../components/PageNotFoundOrAccessDenied";

const Page = () => {
  return (
    <PageNotFoundOrAccessDenied
      type="notFound"
      itemName="Pet"
      buttonGoTo="Pets"
      redirectUrl="/dashboard/pets"
    />
  );
};

export default Page;
