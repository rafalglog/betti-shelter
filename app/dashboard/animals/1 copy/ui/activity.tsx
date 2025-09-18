import React from "react";
import ActivityFeedItem from "./ActivityFeedItem"; // Import the new item component
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export enum PetActivityType {
  FIELD_UPDATE = "FIELD_UPDATE",
  NOTE_ADDED = "NOTE_ADDED",
  PHOTO_UPLOADED = "PHOTO_UPLOADED",
  MEDICAL_RECORD_ADDED = "MEDICAL_RECORD_ADDED",
  ASSESSMENT_COMPLETED = "ASSESSMENT_COMPLETED",
  TASK_CREATED = "TASK_CREATED",
  TASK_STATUS_CHANGED = "TASK_STATUS_CHANGED",
  STATUS_CHANGE = "STATUS_CHANGE",
  INTAKE_PROCESSED = "INTAKE_PROCESSED",
  OUTCOME_PROCESSED = "OUTCOME_PROCESSED",
  CREATED = "CREATED",
}

export interface Person {
  id: string;
  name: string;
  initials: string;
  avatarUrl?: string;
}

export interface PetActivityLog {
  id: string;
  activityType: PetActivityType;
  changedBy: Person;
  changeSummary?: string | null;
  changedAt: string; // e.g., "1 day ago", "2 weeks ago"
}

// --- MOCK DATA to demonstrate the UI ---
// This would come from your API in a real application
const mockActivities: PetActivityLog[] = [
  {
    id: "1",
    activityType: PetActivityType.FIELD_UPDATE,
    changedBy: { id: "user1", name: "Jane Doe", initials: "JD" },
    changedAt: "1 day ago",
    changeSummary: `• Changed 'healthStatus' from "Awaiting Vet Exam" to "Healthy".
• Changed 'weightKg' from "5.2" to "6.1".
• Updated notes on leash reactivity.`,
  },
  {
    id: "2",
    activityType: PetActivityType.NOTE_ADDED,
    changedBy: { id: "user2", name: "John Smith", initials: "JS" },
    changedAt: "3 days ago",
  },
  {
    id: "3",
    activityType: PetActivityType.PHOTO_UPLOADED,
    changedBy: { id: "user1", name: "Jane Doe", initials: "JD" },
    changedAt: "3 days ago",
  },
  {
    id: "4",
    activityType: PetActivityType.INTAKE_PROCESSED,
    changedBy: { id: "user3", name: "Alan Turing", initials: "AT" },
    changedAt: "2 weeks ago",
  },
];

// Define the props for the component
interface ActivityFeedProps {
  activities?: PetActivityLog[];
}

export default function ActivityFeed({
  activities = mockActivities,
}: ActivityFeedProps) {
  if (!activities || activities.length === 0) {
    return (
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-sm font-sans">
        <h1 className="text-2xl font-bold text-gray-900 pb-4 border-b border-gray-200">
          Activity
        </h1>
        <p className="mt-6 text-gray-500">No activity to display.</p>
      </div>
    );
  }

  return (
    <Card>
      {/* <div className="bg-white p-6 sm:p-8 rounded-lg shadow-sm font-sans"> */}
      <CardHeader>
        <CardTitle>Activity</CardTitle>
        <CardDescription>Activity feed for this pet.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flow-root">
          <ul className="-mb-8">
            {activities.map((activity, index) => (
              <li key={activity.id}>
                <div className="relative pb-8">
                  {/* Vertical line connecting the items */}
                  {index !== activities.length - 1 && (
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
      {/* </div> */}
    </Card>
  );
}
