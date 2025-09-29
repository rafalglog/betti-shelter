import { auth } from "@/auth";
import { redirect } from "next/navigation";
// import DashboardTopBar from "../ui/dashboard/dashboard-top-nav";
// import SidebarContent from "../ui/dashboard/sidebar-content";
// import { navItems, quickActionItems } from "../ui/dashboard/nav-links.config";
import { getFilteredLinks } from "../lib/getFilteredLinks";
// import Breadcrumbs from "../ui/dashboard/breadcrumbs";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/nav/sidebar-links";
import { SiteHeader } from "@/components/site-header";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = async ({ children }: LayoutProps) => {
  const session = await auth();
  if (!session || !session.user) {
    redirect("/api/auth/signin");
  }

  // Get user name and image
  // const userImage = session?.user?.image ?? null;

  // const [filteredNavLinks, filteredQuickActionLinks] = await Promise.all([
  //   getFilteredLinks(navItems),
  //   getFilteredLinks(quickActionItems),
  // ]);

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar user={session.user} variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="max-w-7xl mx-auto flex w-full flex-col gap-4 py-4 px-4 lg:px-6 md:gap-6 md:py-6">
              {children}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Layout;
