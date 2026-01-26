"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResetPasswordSchema } from "@/app/lib/zod-schemas/password.schemas";
import { resetPassword } from "@/app/lib/actions/password.actions";
import { INITIAL_FORM_STATE, PasswordFormState } from "@/app/lib/form-state-types";

type PasswordResetData = z.infer<typeof ResetPasswordSchema>;

const ResetPasswordForm = ({ token }: { token: string }) => {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState<PasswordFormState, PasswordResetData>(
    async (_prev, data) => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });
      return resetPassword(_prev, formData);
    },
    INITIAL_FORM_STATE
  );

  const form = useForm<PasswordResetData>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      token,
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (state.success) {
      form.reset({
        token,
        password: "",
        confirmPassword: "",
      });
      router.push("/sign-in?reset=1");
    }
  }, [state.success, form, token, router]);

  return (
    <form onSubmit={form.handleSubmit((data) => formAction(data))} className="space-y-4">
      <input type="hidden" value={token} {...form.register("token")} />

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          New password
        </label>
        <div className="mt-1">
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            {...form.register("password")}
          />
        </div>
        {(form.formState.errors.password || state.errors?.password) && (
          <p className="mt-1 text-sm text-red-600">
            {form.formState.errors.password?.message || state.errors?.password?.join(", ")}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
          Confirm password
        </label>
        <div className="mt-1">
          <input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            {...form.register("confirmPassword")}
          />
        </div>
        {(form.formState.errors.confirmPassword || state.errors?.confirmPassword) && (
          <p className="mt-1 text-sm text-red-600">
            {form.formState.errors.confirmPassword?.message ||
              state.errors?.confirmPassword?.join(", ")}
          </p>
        )}
      </div>

      {state.errors?.token && (
        <p className="text-sm text-red-600">{state.errors.token.join(", ")}</p>
      )}
      {state.message && (
        <p className="text-sm text-gray-600">{state.message}</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        {isPending ? "Updating..." : "Reset password"}
      </button>
    </form>
  );
};

export default ResetPasswordForm;
