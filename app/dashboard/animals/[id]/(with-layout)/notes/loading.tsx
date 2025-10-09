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
            <Skeleton className="h-7 w-40" />
            <Skeleton className="h-4 w-72" />
          </div>
          <Skeleton className="h-8 w-24" />
        </div>

        {/* Skeleton for Filter and Sort Controls */}
        <div className="mt-4 flex flex-row flex-wrap items-center gap-3">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-8 w-32" />
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Render 4 skeleton note cards */}
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-3">
              <Skeleton className="h-5 w-24 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <Skeleton className="h-3 w-1/2" />
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