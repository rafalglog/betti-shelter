import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import ChangePasswordForm from "@/components/dashboard/settings/change-password-form";
import LanguageSwitcher from "@/components/dashboard/settings/language-switcher";

interface Props {
  searchParams?: { force?: string };
}

const SettingsPage = async ({ searchParams }: Props) => {
  const session = await auth();
  if (!session?.user) {
    redirect("/sign-in");
  }

  const t = await getTranslations("settings");

  return (
    <main className="container mx-auto px-4 py-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">{t("description")}</p>
        </div>
        <ChangePasswordForm force={searchParams?.force === "1"} />
        <LanguageSwitcher
          title={t("languageTitle")}
          description={t("languageDescription")}
          label={t("languageLabel")}
          saveLabel={t("languageSave")}
        />
      </div>
    </main>
  );
};

export default SettingsPage;
