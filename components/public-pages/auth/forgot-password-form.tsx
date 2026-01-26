"use client";

import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RequestPasswordResetSchema } from "@/app/lib/zod-schemas/password.schemas";
import { requestPasswordReset } from "@/app/lib/actions/password.actions";
import { INITIAL_FORM_STATE, PasswordFormState } from "@/app/lib/form-state-types";

type PasswordResetRequestData = z.infer<typeof RequestPasswordResetSchema>;

const defaultValues: PasswordResetRequestData = {
  email: "",
};

const ForgotPasswordForm = () => {
  const [state, formAction, isPending] = useActionState<PasswordFormState, PasswordResetRequestData>(
    async (_prev, data) => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });
      return requestPasswordReset(_prev, formData);
    },
    INITIAL_FORM_STATE
  );

  const form = useForm<PasswordResetRequestData>({
    resolver: zodResolver(RequestPasswordResetSchema),
    defaultValues,
  });

  useEffect(() => {
    if (state.success) {
      form.reset(defaultValues);
    }
  }, [state.success, form]);

  return (
    <form
      onSubmit={form.handleSubmit((data) => {
        startTransition(() => {
          formAction(data);
        });
      })}
      className="space-y-4"
    >
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email address
        </label>
        <div className="mt-1">
          <input
            id="email"
            type="email"
            autoComplete="email"
            className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            {...form.register("email")}
          />
        </div>
        {(form.formState.errors.email || state.errors?.email) && (
          <p className="mt-1 text-sm text-red-600">
            {form.formState.errors.email?.message || state.errors?.email?.join(", ")}
          </p>
        )}
      </div>

      {state.message && (
        <p className="text-sm text-gray-600">{state.message}</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        {isPending ? "Sending..." : "Send reset link"}
      </button>
    </form>
  );
};

export default ForgotPasswordForm;
