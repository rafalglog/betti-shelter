"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import SignUpForm from "@/components/public-pages/auth/sign-up-form";

const SignUpPage = () => {
  const t = useTranslations();

  return (
    <div className="flex flex-col items-center justify-center pt-8 pb-17 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <div className="flex justify-center">
            <span className="text-3xl font-semibold text-indigo-700">
              {t("auth.brand")}
            </span>
          </div>
          <h2 className="mt-6 text-center text-2xl font-medium text-gray-800">
            {t("auth.signUpTitle")}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {t("auth.signUpSubtitle")}
          </p>
        </div>

        <div className="bg-gray-50/50 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <SignUpForm />
        </div>

        <div className="text-center text-sm text-gray-600">
          <span>{t("auth.alreadyHaveAccount")}</span>{" "}
          <Link href="/sign-in" className="font-medium text-indigo-600 hover:text-indigo-500">
            {t("auth.backToSignIn")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
