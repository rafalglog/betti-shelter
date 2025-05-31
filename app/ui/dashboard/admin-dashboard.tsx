import SideNav from "./sidenav";

interface AdminDashboardProps {
  children: React.ReactNode;
}

// Layout for the admin and staff members dashboard
const AdminDashboard = ({ children }: AdminDashboardProps) => {
  return (
    <div className="flex h-screen flex-col lg:flex-row lg:overflow-hidden">
      <div className="w-full flex-none lg:w-64">
        <SideNav />
      </div>
      <div className="grow p-6 md:overflow-y-auto lg:p-12">{children}</div>
    </div>
  );
};

export default AdminDashboard;
