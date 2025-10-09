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
    <div className="space-y-6">
      {/* Skeleton for the Current Images Card */}
      <Card>
        <CardHeader>
          <Skeleton className="h-7 w-3/5" />
          <Skeleton className="h-4 w-4/5 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Render 8 skeleton image placeholders */}
            {Array.from({ length: 8 }).map((_, index) => (
              <Skeleton key={index} className="aspect-square rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Skeleton for the Upload New Images Card */}
      <Card>
        <CardHeader>
          <Skeleton className="h-7 w-1/2" />
          <Skeleton className="h-4 w-full mt-2" />
          <Skeleton className="h-4 w-2/3" />
        </CardHeader>
        <CardContent>
          {/* A large skeleton to represent the Uppy Uploader dashboard */}
          <Skeleton className="h-96 w-full rounded-lg" />
        </CardContent>
      </Card>
    </div>
  );
};

export default Loading;