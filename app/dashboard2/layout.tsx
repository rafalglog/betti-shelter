// import { auth } from "@/auth";
// import { redirect } from "next/navigation";
// import DashboardTopBar from "../ui/dashboard/dashboard-top-nav";
// import SidebarContent from "../ui/dashboard/sidebar-content";
// import { navItems, quickActionItems } from "../../components/dashboard/nav/nav-links.config";
// import { getFilteredLinks } from "../lib/getFilteredLinks";
// import Breadcrumbs from "../ui/dashboard/breadcrumbs";

// interface LayoutProps {
//   children: React.ReactNode;
// }

// const Layout = async ({ children }: LayoutProps) => {
//   const session = await auth();
//   if (!session || !session.user) {
//     redirect("/api/auth/signin");
//   }

//   // Get user name and image
//   const userImage = session?.user?.image ?? null;

//   const [filteredNavLinks, filteredQuickActionLinks] = await Promise.all([
//     getFilteredLinks(navItems),
//     getFilteredLinks(quickActionItems),
//   ]);

//   return (
//     <div className="min-h-screen">
//       <div id="modal-root"></div>

//       {/* left side bar */}
//       <div className="hidden border-r z-50 flex-col bg-white w-72 lg:z-50 lg:inset-y-0 lg:fixed lg:flex">
//         <SidebarContent
//           links={filteredNavLinks}
//           quickActions={filteredQuickActionLinks}
//         />
//       </div>

//       <DashboardTopBar
//         userImage={userImage}
//         links={filteredNavLinks}
//         quickActions={filteredQuickActionLinks}
//       />

//       {/* main content */}
//       <main className="pb-10 pt-21 lg:pl-72">
//         <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
//           <Breadcrumbs />
//           {children}
//         </div>
//       </main>
//     </div>
//   );
// };

// export default Layout;
