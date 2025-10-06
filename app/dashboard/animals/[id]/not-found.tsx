import PageNotFoundOrAccessDenied from "@/components/PageNotFoundOrAccessDenied";

const Page = () => {
  return (
    <PageNotFoundOrAccessDenied
      type="notFound"
      itemName="Item"
      buttonGoTo="Dashboard"
      redirectUrl="/dashboard"
    />
  );
};

export default Page;
