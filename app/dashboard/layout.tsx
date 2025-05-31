import { auth } from "@/auth";
import { Role } from "@prisma/client";
import AccessDenied from "../ui/access-denied";
import AdminDashboard from "../ui/dashboard/admin-dashboard";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = async ({ children }: LayoutProps) => {
  const session = await auth();
  
  if (!session || !session.user) {
    return <AccessDenied />;
  }

  const userRole = session.user.role;

  if (userRole === Role.STAFF || userRole === Role.ADMIN) {
    return <AdminDashboard> {children} </AdminDashboard>;
  } else {
    return <AccessDenied />;
  }
};

export default Layout;
