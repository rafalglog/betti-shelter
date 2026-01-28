"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import Link from "next/link";
import { UserCreateSchema } from "@/app/lib/zod-schemas/user.schemas";
import { INITIAL_FORM_STATE, UserFormState } from "@/app/lib/form-state-types";
import { createUser } from "@/app/lib/actions/user.actions";
import { Role } from "@prisma/client";
import { UserRoles } from "@/components/dashboard/users/table/users-options";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslations } from "next-intl";

type UserFormData = z.infer<typeof UserCreateSchema>;

const defaultValues: UserFormData = {
  name: "",
  email: "",
  role: Role.USER,
  password: "",
};

const UserCreateForm = () => {
  const t = useTranslations("dashboard");
  const [state, formAction, isPending] = useActionState<UserFormState, FormData>(
    createUser,
    INITIAL_FORM_STATE
  );

  const form = useForm<UserFormData>({
    resolver: zodResolver(UserCreateSchema),
    defaultValues,
  });

  useEffect(() => {
    if (state.message) {
      toast.error(state.message);
    }

    if (state.errors) {
      for (const [key, value] of Object.entries(state.errors)) {
        form.setError(key as keyof UserFormData, {
          type: "server",
          message: value?.join(", "),
        });
      }
    }
  }, [state, form]);

  const handleFormSubmit = (data: UserFormData) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        formData.append(key, String(value));
      }
    });

    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
        <Card className="w-full max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>{t("users.form.title")}</CardTitle>
            <CardDescription>
              {t("users.form.description")}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("users.form.nameLabel")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("users.form.namePlaceholder")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("users.form.emailLabel")}</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder={t("users.form.emailPlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("users.form.roleLabel")}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      name={field.name}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("users.form.rolePlaceholder")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {UserRoles.map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            {t(role.labelKey)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("users.form.passwordLabel")}</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder={t("users.form.passwordPlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>

          <CardFooter className="flex items-center justify-end gap-3">
            <Button variant="outline" asChild>
              <Link href="/dashboard/users">{t("common.cancel")}</Link>
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? t("common.creating") : t("users.form.createButton")}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default UserCreateForm;
