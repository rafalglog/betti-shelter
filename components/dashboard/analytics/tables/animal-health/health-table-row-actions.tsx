"use client";

import { Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AnimalsRequiringAttentionPayload } from "@/app/lib/data/analytics.data";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface DataTableRowActionsProps {
  row: Row<AnimalsRequiringAttentionPayload>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const t = useTranslations("dashboard.table");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">{t("openMenu")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <Link href={`/dashboard/animals/${row.original.id}`}>
          <DropdownMenuItem>{t("profile")}</DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
