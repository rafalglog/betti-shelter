import { Skeleton } from "@/components/ui/skeleton";
import { MapPinIcon } from "@heroicons/react/24/outline";

export default function PetDetailPageLoading() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6 lg:gap-y-0">
      {/* Left Side: Pet Gallery Skeleton */}
      <div className="flex flex-col lg:mr-8 gap-y-2">
        {/* Large image */}
        <Skeleton className="w-full h-80 rounded-sm" />

        {/* Thumbnail images */}
        <div className="flex flex-row gap-x-2">
          <Skeleton className="min-w-[24%] h-24 rounded-sm" />
          <Skeleton className="min-w-[24%] h-24 rounded-sm" />
          <Skeleton className="min-w-[24%] h-24 rounded-sm" />
          <Skeleton className="min-w-[24%] h-24 rounded-sm" />
        </div>
      </div>

      {/* Right Side: Pet Details Skeleton */}
      <div className="flex flex-col space-y-5">
        <div>
          <Skeleton className="h-9 w-48 mb-2" />
          <div className="flex items-center">
             <MapPinIcon className="size-5 inline mr-1 text-gray-300" />
            <Skeleton className="h-5 w-32" />
          </div>
        </div>

        <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-200">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-gray-50 p-4 rounded border border-gray-200/60 text-center min-w-36 max-w-48 flex-grow">
              <Skeleton className="h-5 w-20 mb-2 mx-auto" />
              <Skeleton className="h-5 w-12 mx-auto" />
            </div>
          ))}
        </div>
        
        <div className="pt-4 border-t border-gray-200">
            <Skeleton className="h-7 w-40 mb-3" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
        </div>
        
        <div className="pt-4 border-t border-gray-200">
            <Skeleton className="h-7 w-52 mb-3" />
            <div className="flex flex-wrap gap-3">
              <Skeleton className="h-8 w-24 rounded-full" />
              <Skeleton className="h-8 w-28 rounded-full" />
              <Skeleton className="h-8 w-20 rounded-full" />
            </div>
        </div>

        <div className="pt-2">
           <Skeleton className="h-12 w-full sm:w-36 rounded-md" />
        </div>
      </div>
    </div>
  );
}