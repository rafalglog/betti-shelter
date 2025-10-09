import { Card, CardContent, CardHeader } from "../ui/card";

const AnalyticsTablesSkeleton = () => (
  <div className="space-y-4">
    {/* Tabs Skeleton */}
    <div className="flex items-center space-x-4 border-b">
      <div className="h-10 w-20 animate-pulse rounded-t-md bg-muted" />
      <div className="h-10 w-20 animate-pulse rounded-t-md bg-muted/50" />
    </div>

    {/* Card and Table Skeleton */}
    <Card>
      <CardHeader>
        <div className="h-7 w-48 animate-pulse rounded-md bg-muted" />
        <div className="mt-2 h-4 w-full max-w-lg animate-pulse rounded-md bg-muted" />
      </CardHeader>
      <CardContent>
        {/* Toolbar Skeleton */}
        <div className="mb-4 flex items-center justify-between">
          <div className="h-10 w-64 animate-pulse rounded-md bg-muted" />
          <div className="h-10 w-32 animate-pulse rounded-md bg-muted" />
        </div>
        {/* Table Body Skeleton */}
        <div className="space-y-2 rounded-lg border p-4">
          <div className="h-8 w-full animate-pulse rounded bg-muted" />
          <div className="h-8 w-full animate-pulse rounded bg-muted" />
          <div className="h-8 w-full animate-pulse rounded bg-muted" />
          <div className="h-8 w-full animate-pulse rounded bg-muted" />
        </div>
      </CardContent>
    </Card>
  </div>
);

export default AnalyticsTablesSkeleton;