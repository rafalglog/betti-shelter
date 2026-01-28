"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button'; // Import the Button component
import { useTranslations } from "next-intl";

// The props for the component
interface PageNotFoundOrAccessDeniedProps {
  type: 'notFound' | 'accessDenied' | 'genericError';
  actionButton?: React.ReactNode;
  itemName?: string;
  redirectUrl?: string;
  buttonGoTo?: string;
}

const PageNotFoundOrAccessDenied = ({
  type,
  actionButton,
  itemName,
  redirectUrl,
  buttonGoTo,
}: PageNotFoundOrAccessDeniedProps) => {
  const t = useTranslations("errors");
  const errorCodeMap = {
    notFound: "404",
    accessDenied: "403",
    genericError: "500",
  } as const;
  const errorCode = errorCodeMap[type] ?? "404";
  const titleMap = {
    notFound: t("notFoundTitle"),
    accessDenied: t("accessDeniedTitle"),
    genericError: t("genericErrorTitle"),
  } as const;
  const descriptionMap = {
    notFound: t("notFoundDescription"),
    accessDenied: t("accessDeniedDescription"),
    genericError: t("genericErrorDescription"),
  } as const;
  const iconMap = {
    notFound: (
      <Image
        src="/icons/giraffe.svg"
        alt={t("giraffeAlt")}
        width={80}
        height={80}
        className="mb-5 sm:mb-6 size-20 sm:size-50"
        aria-hidden="true"
      />
    ),
    accessDenied: (
      <Image
        src="/icons/cobra.svg"
        alt={t("cobraAlt")}
        width={80}
        height={80}
        className="mb-5 sm:mb-6 size-20 sm:size-50"
        aria-hidden="true"
      />
    ),
    genericError: (
      <Image
        src="/icons/racoon.svg"
        alt={t("racoonAlt")}
        width={80}
        height={80}
        className="mb-5 sm:mb-6 size-20 sm:size-50"
        aria-hidden="true"
      />
    ),
  } as const;

  const description = descriptionMap[type] ?? descriptionMap.notFound;
  const title = type === "notFound" && itemName ? t("itemNotFound", { item: itemName }) : (titleMap[type] ?? titleMap.notFound);
  const icon = iconMap[type] ?? iconMap.notFound;

  // Updated to use the shadcn/ui Button component
  const defaultActionButton = (
    <Button asChild className="mt-8">
      <Link href={redirectUrl || '/'}>
        {buttonGoTo ? t("backTo", { destination: buttonGoTo }) : t("goHome")}
      </Link>
    </Button>
  );

  return (
    <div className="flex flex-col items-center justify-center text-center px-4 py-12 sm:py-16 md:py-20">
      {icon}
      <p className="text-sm sm:text-base font-semibold text-indigo-600 uppercase tracking-wide">
        {errorCode}
      </p>
      <h1 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
        {title}
      </h1>
      <p className="mt-3 text-base text-gray-600 max-w-md sm:max-w-lg">
        {description}
      </p>

      {actionButton !== null && (actionButton === undefined ? defaultActionButton : actionButton)}
    </div>
  );
};

export default PageNotFoundOrAccessDenied;
