import Card from "@/components/public-pages/aboutUs/card";
import PageHeader from "@/components/public-pages/aboutUs/page-header";
import PageLayout from "@/components/public-pages/aboutUs/page-layout";
import { getTranslations } from "next-intl/server";

const Page = async () => {
  const t = await getTranslations();
  const locations = t.raw("about.locations") as Array<{
    location: string;
    address: string;
    state: string;
  }>;
  return (
    <PageLayout>
      <PageHeader
        title={t("about.title")}
        description={t("about.description")}
      />
      
      <div className="my-8 border-t border-gray-200"></div>

      <PageHeader title={t("about.locationsTitle")} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {locations.map((loc, index) => (
          <Card key={index} title={loc.location}>
            <p className="text-gray-500">{loc.address}</p>
            <p className="text-gray-500">{loc.state}</p>
          </Card>
        ))}
      </div>
    </PageLayout>
  );
};

export default Page;
