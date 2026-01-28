"use client"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { getIcon } from "./icon-map";
import { NavDocument } from "./nav-links.config";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

export function NavDocuments({ items }: { items: NavDocument[] }) {
  const pathname = usePathname();
  const t = useTranslations();

  const isActive = (itemUrl: string) => {
    return pathname === itemUrl || pathname.startsWith(itemUrl + "/");
  };

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>{t("dashboard.nav.sections.documents")}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const Icon = getIcon(item.icon);
          const active = isActive(item.url);
          const label = item.labelKey ? t(item.labelKey) : item.name;
          return (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton asChild isActive={active}>
                <Link href={item.url}>
                  <Icon className="size-4" />
                  <span>{label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
