"use client";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import * as React from "react";
import { NavItem } from "./nav-links.config";
import { getIcon } from "./icon-map";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

export function NavSecondary({
  items,
  ...props
}: {
  items: NavItem[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const pathname = usePathname();
  const t = useTranslations();

  const isActive = (itemUrl: string) => {
    return pathname === itemUrl || pathname.startsWith(itemUrl + "/");
  };

  return (
    <SidebarGroup {...props}>
      <SidebarMenu>
        {items.map((item) => {
          const Icon = getIcon(item.icon);
          const active = isActive(item.url);
          const label = item.labelKey ? t(item.labelKey) : item.title;
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
