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
import { AnimalActivityType } from "@prisma/client";
import { AnimalActivityLogPayload } from "@/app/lib/data/animals/animal-activity.data";
import { formatTimeAgo } from "@/app/lib/utils/date-utils";
import { useTranslations } from "next-intl";

const getInitials = (name: string) => {
  if (!name) return "?";
  const names = name.split(" ");
  const initials = names.map((n) => n[0]).join("");
  return initials.substring(0, 2).toUpperCase();
};

const activityConfig: Record<
  AnimalActivityType,
  {
    icon: React.ComponentType<LucideProps>;
    textKey: string;
  }
> = {
  [AnimalActivityType.FIELD_UPDATE]: {
    icon: Pencil,
    textKey: "activity.actions.fieldUpdate",
  },
  [AnimalActivityType.NOTE_ADDED]: { icon: FileText, textKey: "activity.actions.noteAdded" },
  [AnimalActivityType.PHOTO_UPLOADED]: {
    icon: Camera,
    textKey: "activity.actions.photoUploaded",
  },
  [AnimalActivityType.INTAKE_PROCESSED]: {
    icon: LogIn,
    textKey: "activity.actions.intakeProcessed",
  },
  [AnimalActivityType.OUTCOME_PROCESSED]: {
    icon: LogOut,
    textKey: "activity.actions.outcomeProcessed",
  },
  [AnimalActivityType.MEDICAL_RECORD_ADDED]: {
    icon: HeartPulse,
    textKey: "activity.actions.medicalRecordAdded",
  },
  [AnimalActivityType.CREATED]: {
    icon: PackagePlus,
    textKey: "activity.actions.created",
  },
  [AnimalActivityType.STATUS_CHANGE]: {
    icon: ArrowRightLeft,
    textKey: "activity.actions.statusChange",
  },
  [AnimalActivityType.ASSESSMENT_COMPLETED]: {
    icon: ClipboardList,
    textKey: "activity.actions.assessmentCompleted",
  },
  [AnimalActivityType.TASK_CREATED]: {
    icon: ClipboardList,
    textKey: "activity.actions.taskCreated",
  },
  [AnimalActivityType.TASK_STATUS_CHANGED]: {
    icon: ClipboardList,
    textKey: "activity.actions.taskStatusChanged",
  },
};

const colorClasses = [
  "bg-orange-100 text-orange-600",
  "bg-blue-100 text-blue-600",
  "bg-green-100 text-green-600",
  "bg-purple-100 text-purple-600",
  "bg-pink-100 text-pink-600",
  "bg-teal-100 text-teal-600",
];

const getAvatarColor = (initials: string) => {
  if (!initials || initials === "?") return "bg-gray-200 text-gray-600";
  const charCodeSum = initials.charCodeAt(0) + (initials.charCodeAt(1) || 0);
  return colorClasses[charCodeSum % colorClasses.length];
};

interface ActivityFeedItemProps {
  activity: AnimalActivityLogPayload;
}

export default function ActivityFeedItem({ activity }: ActivityFeedItemProps) {
  const t = useTranslations("dashboard");
  const [isExpanded, setIsExpanded] = useState(false);

  const config = activityConfig[activity.activityType] || {
    icon: Pencil,
    textKey: "activity.actions.unknown",
  };
  const Icon = config.icon;
  const actionText = t(config.textKey);

  const canExpand = !!activity.changeSummary;

  const initials = getInitials(activity.changedBy.name);
  const avatarColor = getAvatarColor(initials);
  const avatarUrl = activity.changedBy.user?.image;

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
            {avatarUrl && (
              <AvatarImage src={avatarUrl} alt={activity.changedBy.name} />
            )}
            <AvatarFallback className={`${avatarColor} text-xs font-semibold`}>
              {initials}
            </AvatarFallback>
          </Avatar>

          <p className="truncate">
            <span className="font-semibold text-gray-900">
              {activity.changedBy.name}
            </span>{" "}
            {actionText}
          </p>

          <span className="ml-2 text-gray-400 whitespace-nowrap">
            &bull; {formatTimeAgo(activity.changedAt)}
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
                {isExpanded ? t("activity.hideDetails") : t("activity.showDetails")}
              </button>
              {isExpanded && (
                <div className="details-box mt-2 p-3 bg-slate-50 border rounded-md">
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
