"use client";

import { Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { UsersPayload } from "@/app/lib/types";
import { Role } from "@prisma/client";
import { updateUserRole } from "@/app/lib/actions/user.actions";
import { adminResetUserPassword } from "@/app/lib/actions/password.actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";

interface DataTableRowActionsProps {
  row: Row<UsersPayload>;
}

const assignableRoles: Role[] = [Role.STAFF, Role.USER, Role.VOLUNTEER];

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const t = useTranslations("dashboard");
  const user = row.original;
  const [isPending, startTransition] = useTransition();
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [tempPassword, setTempPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetError, setResetError] = useState<string | null>(null);
  const [isResetPending, startResetTransition] = useTransition();

  const handleRoleChange = (newRole: Role) => {
    startTransition(async () => {
      const result = await updateUserRole(user.id, newRole);

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  };

  const handleResetPassword = () => {
    if (!tempPassword || tempPassword.length < 6) {
      setResetError(t("users.reset.errors.shortPassword"));
      return;
    }
    if (tempPassword !== confirmPassword) {
      setResetError(t("users.reset.errors.mismatch"));
      return;
    }

    setResetError(null);
    startResetTransition(async () => {
      const result = await adminResetUserPassword(
        user.id,
        tempPassword,
        confirmPassword
      );

      if (result.success) {
        toast.success(result.message);
        setIsResetOpen(false);
        setTempPassword("");
        setConfirmPassword("");
      } else {
        setResetError(result.message);
      }
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0"
            disabled={isPending}
          >
            <span className="sr-only">{t("table.openMenu")}</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuLabel>{t("users.actions.title")}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {assignableRoles.map((role) => (
            <DropdownMenuItem
              key={role}
              disabled={user.role === role || isPending}
              onSelect={() => handleRoleChange(role)}
              className="capitalize"
            >
              {t("users.actions.setRole", {
                role: t(`users.roleOptions.${role}`),
              })}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={(event) => {
              event.preventDefault();
              setIsResetOpen(true);
              setResetError(null);
            }}
          >
            {t("users.actions.resetPassword")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={isResetOpen} onOpenChange={setIsResetOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("users.reset.title")}</DialogTitle>
            <DialogDescription>
              {t("users.reset.description")}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-700">
                {t("users.reset.tempPasswordLabel")}
              </label>
              <Input
                type="password"
                value={tempPassword}
                onChange={(event) => setTempPassword(event.target.value)}
                placeholder={t("users.reset.tempPasswordPlaceholder")}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                {t("users.reset.confirmPasswordLabel")}
              </label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder={t("users.reset.confirmPasswordPlaceholder")}
              />
            </div>
            {resetError && <p className="text-sm text-red-600">{resetError}</p>}
          </div>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsResetOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button onClick={handleResetPassword} disabled={isResetPending}>
              {isResetPending
                ? t("users.reset.submitting")
                : t("users.reset.submitButton")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
