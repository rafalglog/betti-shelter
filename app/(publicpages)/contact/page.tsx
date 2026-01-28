import Card from "@/components/public-pages/aboutUs/card";
import PublicPageHeader from "@/components/public-pages/aboutUs/page-header";
import PageLayout from "@/components/public-pages/aboutUs/page-layout";
import { getTranslations } from "next-intl/server";

const Page = async () => {
  const t = await getTranslations();
  const contactDetails = t.raw("contact.details") as Array<{
    title: string;
    email: string;
    phone: string;
  }>;
  return (
    <PageLayout>
      <PublicPageHeader
        title={t("contact.title")}
        description={t("contact.description")}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {contactDetails.map((contact, index) => (
          <Card key={index} title={contact.title}>
            <a
              href={`mailto:${contact.email}`}
              className="font-medium text-indigo-600 hover:text-indigo-800 transition-colors duration-300 block"
            >
              {contact.email}
            </a>
            <p className="text-gray-500 mt-1">{contact.phone}</p>
          </Card>
        ))}
      </div>
    </PageLayout>
  );
};

export default Page;
