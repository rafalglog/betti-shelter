import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-1.5">
            {/* Skeleton for CardTitle */}
            <Skeleton className="h-7 w-48" />
            {/* Skeleton for CardDescription */}
            <Skeleton className="h-4 w-80" />
          </div>
          {/* Skeleton for Edit Button */}
          <Skeleton className="h-9 w-20" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Render 3 skeleton category blocks */}
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="border rounded-lg p-4 bg-white">
              {/* Skeleton for category title */}
              <div className="flex items-center gap-2 mb-3">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-5 w-28" />
              </div>
              {/* Skeleton for badges */}
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-6 w-24 rounded-md" />
                <Skeleton className="h-6 w-32 rounded-md" />
                <Skeleton className="h-6 w-28 rounded-md" />
                {index === 1 && <Skeleton className="h-6 w-40 rounded-md" />}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Loading;