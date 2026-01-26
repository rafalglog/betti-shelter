import Link from "next/link";
import ResetPasswordForm from "@/components/public-pages/auth/reset-password-form";

interface Props {
  searchParams?: { token?: string };
}

const ResetPasswordPage = ({ searchParams }: Props) => {
  const token = searchParams?.token;

  return (
    <div className="flex flex-col items-center justify-center pt-8 pb-17 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        <div>
          <div className="flex justify-center">
            <span className="text-3xl font-semibold text-indigo-700">Pet Adopt</span>
          </div>
          <h2 className="mt-6 text-center text-2xl font-medium text-gray-800">
            Reset your password
          </h2>
        </div>

        <div className="bg-gray-50/50 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {token ? (
            <ResetPasswordForm token={token} />
          ) : (
            <p className="text-sm text-red-600">Reset token is missing.</p>
          )}
        </div>

        <div className="text-center text-sm">
          <Link href="/sign-in" className="font-medium text-indigo-600 hover:text-indigo-500">
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
