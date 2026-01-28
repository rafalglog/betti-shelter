import Link from "next/link";
import ForgotPasswordForm from "@/components/public-pages/auth/forgot-password-form";
import { getTranslations } from "next-intl/server";

const ForgotPasswordPage = async () => {
  const t = await getTranslations("auth");
  return (
    <div className="flex flex-col items-center justify-center pt-8 pb-17 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        <div>
          <div className="flex justify-center">
            <span className="text-3xl font-semibold text-indigo-700">
              {t("brand")}
            </span>
          </div>
          <h2 className="mt-6 text-center text-2xl font-medium text-gray-800">
            {t("forgotTitle")}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {t("forgotSubtitle")}
          </p>
        </div>

        <div className="bg-gray-50/50 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <ForgotPasswordForm />
        </div>

        <div className="text-center text-sm">
          <Link href="/sign-in" className="font-medium text-indigo-600 hover:text-indigo-500">
            {t("backToSignIn")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
