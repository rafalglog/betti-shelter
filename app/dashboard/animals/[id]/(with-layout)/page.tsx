import { IDParamType } from "@/app/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ActivityFeedItem from "../../../../../components/dashboard/animals/activityFeed/activity-feed";
import { fetchAnimalActivityLogs } from "@/app/lib/data/animals/animal-activity.data";

interface Props {
  params: IDParamType;
}

const Page = async ({ params }: Props) => {
  const { id: animalId } = await params;

  const animalActivityFeed = await fetchAnimalActivityLogs(animalId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity</CardTitle>
        <CardDescription>
          This page displays the ten most recent activity logs for this animal,
          including who made the change and a summary of the action.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flow-root">
          <ul className="-mb-8">
            {animalActivityFeed.map((activity, index) => (
              <li key={activity.id}>
                <div className="relative pb-8">
                  {index !== animalActivityFeed.length - 1 && (
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
      </CardContent>
    </Card>
  );
};

export default Page;
