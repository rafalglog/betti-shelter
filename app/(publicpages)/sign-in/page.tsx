import { redirect } from "next/navigation"
import { AuthError } from "next-auth"
import { auth, providerMap, signIn } from "@/auth"
import { ProviderIcon } from "@/components/auth/provider-icon"
import { SearchParamsType } from "@/app/lib/types"
import clsx from "clsx"
import { getTranslations } from "next-intl/server"

const SIGNIN_ERROR_URL = "/error"

interface Props {
  searchParams: SearchParamsType;
}

const SignInPage = async ({ searchParams }: Props) => {
  const session = await auth();
  if (session) {
    return redirect("/")
  }
  const t = await getTranslations();

  const { callbackUrl, reset } = await searchParams;

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
            {t("auth.signInTitle")}
          </h2>
        </div>

        {reset === "1" && (
          <div className="mb-4 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {t("auth.resetSuccess")}
          </div>
        )}

        <div className="bg-gray-50/50 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Email & Password Form */}
          <form
            className="space-y-6"
            action={async (formData) => {
              "use server"
              try {
                await signIn("credentials", formData)
              } catch (error) {
                if (error instanceof AuthError) {
                  return redirect(`${SIGNIN_ERROR_URL}?error=${error.type}`)
                }
                throw error
              }
            }}
          >
            {/* hidden input to pass the callbackUrl */}
            <input type="hidden" name="redirectTo" value={callbackUrl ?? "/"} />

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                {t("auth.emailLabel")}
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                {t("auth.passwordLabel")}
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  {t("auth.rememberMe")}
                </label>
              </div>

              <div className="text-sm">
                <a href="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">
                  {t("auth.forgotPassword")}
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                {t("auth.signInButton")}
              </button>
            </div>
          </form>

          {/* Separator */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">
                  {t("auth.orContinueWith")}
                </span>
              </div>
            </div>
          </div>

          {/* Social Providers */}
          <div className={clsx("mt-6 grid gap-3", providerMap.length > 2 ? "grid-cols-2" : "grid-cols-1")}>
            {Object.values(providerMap).map((provider) => {
              return (
                <form
                  key={provider.id}
                  action={async () => {
                    "use server"
                    try {
                      await signIn(provider.id, {
                        redirectTo: callbackUrl ?? "/",
                      })
                    } catch (error) {
                      if (error instanceof AuthError) {
                        return redirect(`${SIGNIN_ERROR_URL}?error=${error.type}`)
                      }
                      throw error
                    }
                  }}
                >
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-200 rounded-md shadow bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">
                      {t("auth.signInWithProvider", { provider: provider.name })}
                    </span>
                    <ProviderIcon 
                      providerId={provider.id} 
                      providerName={provider.name}
                      className="w-5 h-5"
                    />
                    <span className="ml-2">{provider.name}</span>
                  </button>
                </form>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignInPage;
