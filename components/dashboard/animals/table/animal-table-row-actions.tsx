"use client";

import { Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { AnimalsPayload } from "@/app/lib/types";
import { useTranslations } from "next-intl";

interface DataTableRowActionsProps {
  row: Row<AnimalsPayload>;
}

export function AnimalTableRowActions({ row }: DataTableRowActionsProps) {
  const animal = row.original;
  const t = useTranslations("dashboard.table");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <MoreHorizontal />
          <span className="sr-only">{t("openMenu")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <Link href={`/dashboard/animals/${animal.id}`}>
          <DropdownMenuItem>{t("profile")}</DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <Link href={`/dashboard/animals/${animal.id}/edit`}>
          <DropdownMenuItem>{t("edit")}</DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
