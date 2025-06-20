import { Suspense } from "react";
import { CardsSkeleton, LatestPetsSkeleton } from "@/app/ui/skeletons";
import CardWrapper from "@/app/ui/dashboard/dashboard-info-cards";
import LatestPets from "@/app/ui/dashboard/latest-pets";
import PageHeader from "@/app/ui/dashboard/page-header";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { hasPermission } from "@/app/lib/auth/hasPermission";
import { Permissions } from "@/app/lib/auth/permissions";

const Page = async () => {
  const session = await auth();
  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  // Check if the user has permission to see the main dashboard content.
  const canViewDashboard = await hasPermission(Permissions.PET_READ_ANALYTICS);
  
  if (!canViewDashboard) {
    redirect("/dashboard/my-applications");
  }

  return (
    <div>
      <PageHeader title="Dashboard" />

      {/* Information Cards */}
      <Suspense fallback={<CardsSkeleton />}>
        <CardWrapper />
      </Suspense>

      <div>
        <div className="flex my-5 w-full items-center justify-between">
          <h3 className="font-opensans text-xl font-semibold">Latest Pets</h3>
        </div>
        <Suspense fallback={<LatestPetsSkeleton />}>
          <LatestPets />
        </Suspense>
      </div>
    </div>
  );
};

export default Page;