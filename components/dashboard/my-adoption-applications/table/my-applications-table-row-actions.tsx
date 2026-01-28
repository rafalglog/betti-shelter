"use client";

import { Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MyApplicationPayload } from "@/app/lib/types";
import Link from "next/link";
import { toast } from "sonner";
import {
  reactivateMyApplication,
  withdrawMyApplication,
} from "@/app/lib/actions/my-application.action";
import { ApplicationStatus } from "@prisma/client";
import { useTranslations } from "next-intl";

interface DataTableRowActionsProps {
  row: Row<MyApplicationPayload>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const t = useTranslations("dashboard");
  const myApplication = row.original;
  const [isPending, startTransition] = useTransition();

  const onWithdraw = () => {
    startTransition(async () => {
      const result = await withdrawMyApplication(myApplication.id);
      if (result.success) {
        toast.success(t("myApplications.toast.withdrawSuccess"));
      } else {
        toast.error(result.message || t("myApplications.toast.withdrawError"));
      }
    });
  };

  const onReactivate = () => {
    startTransition(async () => {
      const result = await reactivateMyApplication(myApplication.id);
      if (result.success) {
        toast.success(t("myApplications.toast.reactivateSuccess"));
      } else {
        toast.error(
          result.message || t("myApplications.toast.reactivateError")
        );
      }
    });
  };

  // Check if the application can be edited
  const isEditable = myApplication.status === ApplicationStatus.PENDING;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">{t("table.openMenu")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        {/* Only show Edit link if the application is in PENDING status */}
        {isEditable && (
          <>
            <Link href={`/dashboard/my-applications/${myApplication.id}/edit`}>
              <DropdownMenuItem>{t("table.edit")}</DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
          </>
        )}

        {/* Conditionally render Withdraw or Reactivate */}
        {myApplication.status === ApplicationStatus.WITHDRAWN ? (
          <DropdownMenuItem onClick={onReactivate} disabled={isPending}>
            {t("myApplications.actions.reactivate")}
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            variant="destructive"
            onClick={onWithdraw}
            disabled={isPending}
          >
            {t("myApplications.actions.withdraw")}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
