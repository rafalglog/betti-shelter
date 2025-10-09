import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <Card>
      <CardHeader>
        {/* Skeleton for Page Title and Description */}
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-full max-w-lg" />
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Skeleton for Template Switcher */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full" />
          </div>

          <Skeleton className="h-px w-full" />

          {/* Skeleton for Dynamic Fields (repeating block) */}
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-6 gap-x-6 gap-y-2"
            >
              {/* Field Input */}
              <div className="space-y-2 md:col-span-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
              {/* Field Notes */}
              <div className="space-y-2 md:col-span-4">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          ))}

          {/* Skeleton for Overall Outcome and Summary */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-x-6 gap-y-4">
            <div className="space-y-2 md:col-span-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2 col-span-full">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>

          {/* Skeleton for Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-36" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Loading;