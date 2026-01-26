import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";

const locales = ["en", "pl", "de"] as const;
const defaultLocale = "en";

const normalizeLocale = (value: string) => value.toLowerCase().split("-")[0];

const detectLocale = async () => {
  const cookieStore = await cookies();
  const headerStore = await headers();
  const cookieLocale = cookieStore.get("NEXT_LOCALE")?.value;
  if (cookieLocale && locales.includes(cookieLocale as (typeof locales)[number])) {
    return cookieLocale;
  }

  const acceptLanguage = headerStore.get("accept-language") ?? "";
  const candidates = acceptLanguage
    .split(",")
    .map((part) => part.trim().split(";")[0])
    .map(normalizeLocale);

  for (const candidate of candidates) {
    if (locales.includes(candidate as (typeof locales)[number])) {
      return candidate;
    }
  }

  return defaultLocale;
};

export default getRequestConfig(async () => {
  const locale = await detectLocale();
  const messages = (await import(`../messages/${locale}.json`)).default;

  return {
    locale,
    messages,
  };
});
