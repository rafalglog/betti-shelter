"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SimplePagination } from "../../../simple-pagination";
import { AnimalActivityLogPayload } from "@/app/lib/data/animals/animal-activity.data";
import ActivityFeedItem from "./activity-feed-item";
import { useTranslations } from "next-intl";

interface Props {
  activityLogs: AnimalActivityLogPayload[];
  totalPages: number;
}

const ActivityFeed = ({ activityLogs = [], totalPages }: Props) => {
  const t = useTranslations("dashboard");
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("activity.title")}</CardTitle>
        <CardDescription>
          {t("activity.description")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {activityLogs.length > 0 ? (
          <div className="flow-root">
            <ul className="-mb-8">
              {activityLogs.map((activity, index) => (
                <li key={activity.id}>
                  <div className="relative pb-8">
                    {index !== activityLogs.length - 1 && (
                      <span
                        className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                        aria-hidden="true"
                      />
                    )}
                    <ActivityFeedItem activity={activity} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="text-center text-gray-500 py-12 border-2 border-dashed rounded-lg">
            <p className="font-semibold text-lg">{t("activity.emptyTitle")}</p>
            <p className="text-sm mt-1">
              {t("activity.emptyDescription")}
            </p>
          </div>
        )}
      </CardContent>
      {totalPages > 1 && (
        <CardFooter>
          <SimplePagination totalPages={totalPages} />
        </CardFooter>
      )}
    </Card>
  );
};

export default ActivityFeed;
