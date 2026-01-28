import {
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
} from "@/components/public-pages/social-media-icons";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function Footer() {
  const t = await getTranslations("footer");
  return (
    <footer className="mx-auto w-full max-w-7xl bg-white px-10 pt-10 pb-8 rounded-b-sm border-t border-gray-100">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-8 border-b border-gray-200 pb-8">
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            {t("navigation")}
          </h3>
          <ul className="mt-4 space-y-2">
            <li>
              <Link
                href="/about"
                className="text-sm text-slate-500 hover:text-slate-700"
              >
                {t("about")}
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="text-sm text-slate-500 hover:text-slate-700"
              >
                {t("contact")}
              </Link>
            </li>
            <li>
              <Link
                href="/pets"
                className="text-sm text-slate-500 hover:text-slate-700"
              >
                {t("findPet")}
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            {t("legal")}
          </h3>
          <ul className="mt-4 space-y-2">
            <li>
              <Link
                href="/privacy"
                className="text-sm text-slate-500 hover:text-slate-700"
              >
                {t("privacy")}
              </Link>
            </li>
            <li>
              <Link
                href="/terms"
                className="text-sm text-slate-500 hover:text-slate-700"
              >
                {t("terms")}
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            {t("connect")}
          </h3>
          <div className="flex gap-5 mt-4">
            <Link href="#" aria-label={t("facebookLabel")}>
              <FacebookIcon className="w-6 h-6 fill-slate-400 hover:fill-slate-600" />
            </Link>
            <Link href="#" aria-label={t("twitterLabel")}>
              <TwitterIcon className="w-6 h-6 fill-slate-400 hover:fill-slate-600" />
            </Link>
            <Link href="#" aria-label={t("instagramLabel")}>
              <InstagramIcon className="w-6 h-6 fill-slate-400 hover:fill-slate-600" />
            </Link>
          </div>
        </div>
      </div>
      <div className="pt-6 text-center text-sm text-slate-500">
        {t("copyright", { year: new Date().getFullYear() })}
      </div>
    </footer>
  );
}
