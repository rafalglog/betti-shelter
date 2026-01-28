import Link from "next/link";
import { SearchParamsType } from "@/app/lib/types";
import { getTranslations } from "next-intl/server";

interface Props {
  searchParams: SearchParamsType;
}

const ErrorPage = async ({ searchParams }: Props) => {
  const t = await getTranslations();
  const { error } = await searchParams;
  const errorMessages: Record<string, string> = {
    CredentialsSignin: t("authErrors.messages.CredentialsSignin"),
    EmailNotVerified: t("authErrors.messages.EmailNotVerified"),
    OAuthAccountNotLinked: t("authErrors.messages.OAuthAccountNotLinked"),
    AccessDenied: t("authErrors.messages.AccessDenied"),
    Verification: t("authErrors.messages.Verification"),
    Configuration: t("authErrors.messages.Configuration"),
  };
  const message =
    (error ? errorMessages[error] : null) ??
    t("authErrors.defaultMessage");

  return (
    <div className="flex flex-col items-center justify-center pt-8 pb-17 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6 text-center">
        <div>
          <div className="flex justify-center">
            <span className="text-3xl font-semibold text-indigo-700">
              {t("auth.brand")}
            </span>
          </div>
          <h1 className="mt-6 text-2xl font-semibold text-gray-900">
            {t("authErrors.signInTitle")}
          </h1>
          <p className="mt-2 text-sm text-gray-600">{message}</p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-600">
            {t("authErrors.tryAgain")}
          </p>
          <div className="mt-4">
            <Link
              href="/sign-in"
              className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {t("authErrors.backToSignIn")}
            </Link>
          </div>
        </div>

        {error ? (
          <p className="text-xs text-gray-400">
            {t("authErrors.errorCode", { error })}
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default ErrorPage;
