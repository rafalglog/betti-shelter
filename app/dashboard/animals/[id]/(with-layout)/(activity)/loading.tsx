import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  const skeletonItemCount = 5;

  return (
    <Card>
      <CardHeader>
        {/* Skeleton for CardTitle */}
        <Skeleton className="h-7 w-32" />
        {/* Skeleton for CardDescription */}
        <Skeleton className="h-4 w-full mt-2" />
        <Skeleton className="h-4 w-4/5" />
      </CardHeader>
      <CardContent>
        <div className="flow-root">
          <ul className="-mb-8">
            {Array.from({ length: skeletonItemCount }).map((_, index) => (
              <li key={index}>
                <div className="relative pb-8">
                  {/* Vertical line connecting the items */}
                  {index !== skeletonItemCount - 1 && (
                    <span
                      className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                      aria-hidden="true"
                    />
                  )}
                  {/* Skeleton for ActivityFeedItem */}
                  <div className="relative flex items-start space-x-4">
                    {/* Icon Skeleton */}
                    <Skeleton className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full" />

                    {/* Activity Details Skeleton */}
                    <div className="min-w-0 flex-grow space-y-2">
                      <div className="flex items-center space-x-2">
                        {/* Avatar Skeleton */}
                        <Skeleton className="h-6 w-6 rounded-full" />
                        {/* Text Line Skeleton */}
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                      {/* "Show details" button skeleton */}
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter>
        {/* Skeleton for SimplePagination */}
        <div className="flex items-center space-x-2">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-20" />
        </div>
      </CardFooter>
    </Card>
  );
};

export default Loading;