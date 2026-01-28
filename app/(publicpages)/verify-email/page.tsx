import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { verifyEmailToken } from "@/app/lib/actions/auth.actions";
import { SearchParamsType } from "@/app/lib/types";

interface Props {
  searchParams: SearchParamsType;
}

const VerifyEmailPage = async ({ searchParams }: Props) => {
  const t = await getTranslations();
  const { token } = await searchParams;
  const status = await verifyEmailToken(typeof token === "string" ? token : "");

  return (
    <div className="flex flex-col items-center justify-center pt-8 pb-17 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 text-center">
        <div>
          <div className="flex justify-center">
            <span className="text-3xl font-semibold text-indigo-700">
              {t("auth.brand")}
            </span>
          </div>
          <h1 className="mt-6 text-2xl font-semibold text-gray-900">
            {t("auth.verifyTitle")}
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            {status.message}
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="space-y-3 text-sm text-gray-600">
            <p>
              {status.success
                ? t("auth.verifySuccess")
                : t("auth.verifyHelp")}
            </p>
          </div>
          <div className="mt-4 flex justify-center">
            <Link
              href="/sign-in"
              className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {t("auth.backToSignIn")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
