import { Skeleton } from "../ui/skeleton";

const AnimalSectionCardsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2">
      {/* Skeleton for Primary Card */}
      <div className="flex flex-col rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <Skeleton className="h-7 w-40" />
              <Skeleton className="h-4 w-52" />
            </div>
            <Skeleton className="h-6 w-24" />
          </div>
        </div>
        <div className="p-6 pt-0">
          <div className="flex gap-4">
            <Skeleton className="h-28 w-28 flex-shrink-0 rounded-lg" />
            <div className="grid flex-1 grid-cols-2 gap-2">
              <Skeleton className="h-full w-full rounded-md" />
              <Skeleton className="h-full w-full rounded-md" />
              <Skeleton className="h-full w-full rounded-md" />
              <Skeleton className="h-full w-full rounded-md" />
            </div>
          </div>
        </div>
      </div>
      {/* Skeleton for Secondary Card */}
      <div className="flex flex-col rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex items-center justify-between p-6">
          <div className="space-y-1.5">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-9 w-28" />
        </div>
        <div className="space-y-5 p-6 pt-0">
          <div className="space-y-3">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-8 w-full" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-8 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimalSectionCardsSkeleton;