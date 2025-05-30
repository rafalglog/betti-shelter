import SideNav from "@/app/ui/dashboard/sidenav";
import { auth } from "@/auth";
import { Role } from "@prisma/client";

// Layout for the admin and staff members dashboard
const AdminDashboard = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen flex-col lg:flex-row lg:overflow-hidden">
      <div className="w-full flex-none lg:w-64">
        <SideNav />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto lg:p-12">{children}</div>
    </div>
  );
};

// Access Denied component
const AcessDenied = () => {
  return (
    <div className="h-screen flex items-center justify-center">
      <div>Access Denied</div>
    </div>
  );
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const userRole = session?.user?.role;

  if (userRole === Role.STAFF || userRole === Role.ADMIN) {
    return <AdminDashboard> {children} </AdminDashboard>;
  } else {
    return <AcessDenied />;
  }
}
