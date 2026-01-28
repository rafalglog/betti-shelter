"use client";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { getIcon } from "./icon-map";
import { NavItem } from "./nav-links.config";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

export function NavMain({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  const t = useTranslations();

  // Check if a path is active (matches exactly or is a sub-path)
  const isActive = (itemUrl: string) => {
    if (itemUrl === "/dashboard") {
      // Dashboard should only be active on exact match
      return pathname === "/dashboard";
    }
    // For other paths, check if current path starts with the item URL
    return pathname.startsWith(itemUrl);
  };
  
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{t("dashboard.nav.sections.platform")}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const Icon = getIcon(item.icon);
          const active = isActive(item.url);
          const label = item.labelKey ? t(item.labelKey) : item.title;
          
          // Handle items with sub-items (collapsible)
          if (item.items && item.items.length > 0) {
            return (
              <Collapsible
                key={item.id}
                asChild
                defaultOpen={item.isActive || active}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={label} isActive={active}>
                      <Icon className="size-4" />
                      <span>{label}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items.map((subItem) => {
                        const subActive = isActive(subItem.url);
                        const subLabel = subItem.labelKey ? t(subItem.labelKey) : subItem.title;
                        return (
                          <SidebarMenuSubItem key={subItem.id}>
                            <SidebarMenuSubButton asChild isActive={subActive}>
                              <Link href={subItem.url}>
                                <span>{subLabel}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        );
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            );
          }

          // Handle simple items without sub-items
          return (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton asChild tooltip={label} isActive={active}>
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
