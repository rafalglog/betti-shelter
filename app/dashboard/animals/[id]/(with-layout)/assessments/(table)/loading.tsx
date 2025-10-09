import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <Card>
      <CardHeader>
        {/* Skeleton for Header Title/Desc and Action Button */}
        <div className="flex justify-between items-start">
          <div className="space-y-1.5">
            <Skeleton className="h-7 w-56" />
            <Skeleton className="h-4 w-80" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>

        {/* Skeleton for Filter and Sort Controls */}
        <div className="mt-4 flex flex-row flex-wrap items-center gap-3">
          <Skeleton className="h-8 w-28" />
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-8 w-32" />
        </div>
      </CardHeader>

      <CardContent>
        <div className="w-full space-y-1">
          {/* Render 4 skeleton assessment items */}
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex flex-col border-b py-4">
              <div className="flex w-full items-center justify-between">
                {/* Left side of the trigger */}
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>

                {/* Right side for actions */}
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      
      <CardFooter>
        {/* Skeleton for Pagination */}
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