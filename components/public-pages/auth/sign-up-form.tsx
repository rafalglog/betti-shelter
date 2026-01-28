"use client";

import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema } from "@/app/lib/zod-schemas/auth.schemas";
import { registerUser } from "@/app/lib/actions/auth.actions";
import { INITIAL_FORM_STATE, RegisterFormState } from "@/app/lib/form-state-types";
import { useTranslations } from "next-intl";

type RegisterData = z.infer<typeof RegisterSchema>;

const defaultValues: RegisterData = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const SignUpForm = () => {
  const t = useTranslations("auth");
  const [state, formAction, isPending] = useActionState<RegisterFormState, RegisterData>(
    async (_prev, data) => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });
      return registerUser(_prev, formData);
    },
    INITIAL_FORM_STATE
  );

  const form = useForm<RegisterData>({
    resolver: zodResolver(RegisterSchema),
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
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          {t("nameLabel")}
        </label>
        <div className="mt-1">
          <input
            id="name"
            type="text"
            autoComplete="name"
            className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            {...form.register("name")}
          />
        </div>
        {(form.formState.errors.name || state.errors?.name) && (
          <p className="mt-1 text-sm text-red-600">
            {form.formState.errors.name?.message || state.errors?.name?.join(", ")}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          {t("emailLabel")}
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

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          {t("passwordLabel")}
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
          {t("confirmPasswordLabel")}
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
            {form.formState.errors.confirmPassword?.message || state.errors?.confirmPassword?.join(", ")}
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
        {isPending ? t("creating") : t("createAccountButton")}
      </button>
    </form>
  );
};

export default SignUpForm;
