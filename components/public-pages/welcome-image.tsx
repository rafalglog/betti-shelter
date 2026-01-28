import Image from "next/image";
import welcomePicture from "@/public/homeimage15.webp";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

const WelcomeImage = async () => {
  const t = await getTranslations();
  return (
    <div className="relative overflow-hidden bg-gray-200 h-96 flex flex-col items-center rounded-sm">
      <Image
        src={welcomePicture}
        alt={t("home.imageAlt")}
        fill
        style={{ objectFit: "cover" }}
        placeholder="blur"
      />

      <div className="text-center my-auto z-10">
        <div className="text-3xl text-white font-medium mb-3">
          {t("home.welcomeTitle")}
        </div>
        <Link
          href="/pets"
          className="bg-tranparent hover:bg-white text-white hover:text-gray-800 font-semibold py-2 px-4 border border-white rounded-sm transition-colors"
        >
          <span>{t("home.welcomeCta")}</span>
        </Link>
      </div>
    </div>
  );
};

export default WelcomeImage;
