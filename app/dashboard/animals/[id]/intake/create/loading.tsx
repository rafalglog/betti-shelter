import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <main className="container mx-auto">
      {/* Skeleton for the "Back to Profile" button */}
      <Skeleton className="h-10 w-52 mb-4" />

      {/* Skeleton for the Re-Intake Form Card */}
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          {/* Title Skeleton */}
          <Skeleton className="h-8 w-3/5" />
          {/* Description Skeletons */}
          <Skeleton className="h-4 w-full mt-2" />
          <Skeleton className="h-4 w-4/5" />
        </CardHeader>

        <CardContent className="space-y-10">
          {/* Health Status Section Skeleton */}
          <div className="space-y-6">
            <Skeleton className="h-6 w-1/3 border-b pb-2" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </div>

          {/* Intake Fields Section Skeleton */}
          <div className="space-y-6">
            <Skeleton className="h-6 w-1/3 border-b pb-2" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Simulating 4 form fields */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end space-x-4">
          {/* Button Skeletons */}
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-11 w-40" />
        </CardFooter>
      </Card>
    </main>
  );
};

export default Loading;