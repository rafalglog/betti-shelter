import PageNotFoundOrAccessDenied from "../../../components/PageNotFoundOrAccessDenied";
import { getTranslations } from "next-intl/server";

const Page = async () => {
  const t = await getTranslations();
  return (
    <PageNotFoundOrAccessDenied
      type="notFound"
      itemName={t("pets.item")}
      buttonGoTo={t("nav.pets")}
      redirectUrl="/pets"
    />
  );
};

export default Page;
