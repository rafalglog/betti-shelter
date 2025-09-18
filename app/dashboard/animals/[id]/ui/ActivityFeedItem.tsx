"use client";

import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  FileText,
  Camera,
  ClipboardList,
  LogIn,
  LogOut,
  Pencil,
  HeartPulse,
  PackagePlus,
  ArrowRightLeft,
  LucideProps,
} from "lucide-react";

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

// A map to connect your enum to icons and descriptive text
// This makes it easy to add new activity types in the future
const activityConfig: Record<
  PetActivityType,
  {
    icon: React.ComponentType<LucideProps>;
    text: string;
  }
> = {
  [PetActivityType.FIELD_UPDATE]: { icon: Pencil, text: "updated pet details" },
  [PetActivityType.NOTE_ADDED]: { icon: FileText, text: "added a new note" },
  [PetActivityType.PHOTO_UPLOADED]: {
    icon: Camera,
    text: "uploaded a new photo",
  },
  [PetActivityType.INTAKE_PROCESSED]: {
    icon: LogIn,
    text: "was processed for intake",
  },
  [PetActivityType.OUTCOME_PROCESSED]: {
    icon: LogOut,
    text: "was processed for outcome",
  },
  [PetActivityType.MEDICAL_RECORD_ADDED]: {
    icon: HeartPulse,
    text: "had a medical record added",
  },
  [PetActivityType.CREATED]: {
    icon: PackagePlus,
    text: "was created in the system",
  },
  [PetActivityType.STATUS_CHANGE]: {
    icon: ArrowRightLeft,
    text: "had a status change",
  },
  // Add other types as needed
  [PetActivityType.ASSESSMENT_COMPLETED]: {
    icon: ClipboardList,
    text: "had an assessment completed",
  },
  [PetActivityType.TASK_CREATED]: {
    icon: ClipboardList,
    text: "had a task created",
  },
  [PetActivityType.TASK_STATUS_CHANGED]: {
    icon: ClipboardList,
    text: "had a task status updated",
  },
};

// A map to determine avatar background colors based on user initials
const avatarColorMap: { [key: string]: string } = {
  JD: "bg-orange-100 text-orange-600",
  JS: "bg-blue-100 text-blue-600",
  AT: "bg-green-100 text-green-600",
  // Add more as needed
};

interface ActivityFeedItemProps {
  activity: PetActivityLog;
}

export default function ActivityFeedItem({ activity }: ActivityFeedItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Get the display configuration for the current activity type
  const config = activityConfig[activity.activityType] || {
    icon: Pencil,
    text: "performed an unknown action",
  };
  const Icon = config.icon;

  // Determine if this item can be expanded (i.e., it's a field update with details)
  const canExpand =
    activity.activityType === PetActivityType.FIELD_UPDATE &&
    activity.changeSummary;

  return (
    <div className="relative flex items-start space-x-4">
      {/* Icon */}
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 ring-4 ring-white">
        <Icon className="h-5 w-5 text-gray-500" />
      </div>

      {/* Activity Details */}
      <div className="min-w-0 flex-grow">
        <div className="flex flex-wrap items-center text-sm text-gray-600">
          <Avatar className="mr-2 h-6 w-6 flex-shrink-0">
            {activity.changedBy.avatarUrl && (
              <AvatarImage
                src={activity.changedBy.avatarUrl}
                alt={activity.changedBy.name}
              />
            )}
            <AvatarFallback
              className={`${
                avatarColorMap[activity.changedBy.initials] ||
                "bg-gray-200 text-gray-600"
              } text-xs font-semibold`}
            >
              {activity.changedBy.initials}
            </AvatarFallback>
          </Avatar>

          <p className="truncate">
            <span className="font-semibold text-gray-900">
              {activity.changedBy.name}
            </span>{" "}
            {config.text}
          </p>

          <span className="ml-2 text-gray-400 whitespace-nowrap">
            &bull; {activity.changedAt}
          </span>
        </div>

        {/* This is the collapsible/expandable section */}
        <div className="mt-2">
          {canExpand && (
            <>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                {isExpanded ? "Hide details" : "Show details"}
              </button>
              {isExpanded && (
                <div className="details-box mt-2 p-3 bg-slate-50 border rounded-md">
                  {/* Using <pre> preserves the whitespace and line breaks from your summary */}
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
                    {activity.changeSummary}
                  </pre>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
