import Card from "@/app/ui/aboutUs/card";
import PublicPageHeader from "@/app/ui/aboutUs/page-header";
import PageLayout from "@/app/ui/aboutUs/page-layout";

const contactDetails = [
  { title: "Volunteer", email: "volunteer@example.com", phone: "+1 (555) 905-6789" },
  { title: "Donations", email: "donations@example.com", phone: "+1 (555) 905-7890" },
  { title: "Support", email: "support@example.com", phone: "+1 (555) 905-8901" },
  { title: "Feedback", email: "feedback@example.com", phone: "+1 (555) 905-9012" },
];

const Page = () => {
  return (
    <PageLayout>
      <PublicPageHeader
        title="Contact"
        description="Have questions or want to help? Reach out to us and be part of making a difference for animals in need."
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