import PageNotFoundOrAccessDenied from "@/components/PageNotFoundOrAccessDenied";
import { getTranslations } from "next-intl/server";

const Page = async () => {
  const t = await getTranslations("dashboard");
  return (
    <PageNotFoundOrAccessDenied
      type="notFound"
      itemName={t("common.item")}
      buttonGoTo={t("routes.dashboard")}
      redirectUrl="/dashboard"
    />
  );
};

export default Page;
