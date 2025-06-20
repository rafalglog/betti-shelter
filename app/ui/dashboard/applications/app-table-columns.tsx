import { FilteredApplicationsPayload } from "@/app/lib/types";
import { ColumnDef } from "@/app/ui/reusable-table";
import { ApplicationStatus } from "@prisma/client";
import { EditButton } from "@/app/ui/dashboard/edit-button";
import Image from "next/image";
import { StarIcon, UserIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import { formatDateOrNA } from "@/app/lib/utils/date-utils";

export const applicationTableColumns: ColumnDef<FilteredApplicationsPayload>[] =
  [
    {
      header: "Applicant Name",
      cell: (app) => (
        <div className="flex items-center space-x-3">
        <div className="shrink-0">
          {app.user.image ? (
            <Image
              src={app.user.image}
              className="h-8 w-8 rounded-full object-cover"
              width={32}
              height={32}
              alt={`${app.applicantName}'s profile picture`}
            />
          ) : (
            <div className="size-8 bg-gray-200 rounded-full flex items-center justify-center">
              <UserIcon className="size-5 text-gray-500" />
            </div>
          )}
        </div>
        <div className="truncate text-sm font-medium text-gray-900">
          {app.applicantName}
        </div>
      </div>
      ),
    },
    {
      header: "Pet Applied For",
      cell: (app) => (
        <div className="truncate text-sm text-gray-700">{app.pet.name}</div>
      ),
    },
    {
      header: "Species",
      cell: (app) => (
        <div className="truncate text-sm text-gray-700">
          {app.pet.species.name}
        </div>
      ),
    },
    {
      header: "Status",
      cell: (app) => {
        const getStatusInfo = () => {
          if (app.status === ApplicationStatus.APPROVED) {
            return app.isPrimary
              ? { text: "approved", classes: "bg-green-100 text-green-800" }
              : { text: "Waitlisted", classes: "bg-blue-100 text-blue-800" };
          }

          const classMap: Partial<Record<ApplicationStatus, string>> = {
            [ApplicationStatus.PENDING]: "bg-yellow-100 text-yellow-800",
            [ApplicationStatus.REJECTED]: "bg-red-100 text-red-800",
          };

          return {
            text: app.status.replace(/_/g, " ").toLowerCase(),
            classes: classMap[app.status] ?? "bg-gray-100 text-gray-800",
          };
        };

        const { text, classes } = getStatusInfo();
        return (
          <span
            className={clsx(
              "inline-flex rounded-full px-2 text-xs font-semibold leading-5",
              classes
            )}
          >
            {text}
          </span>
        );
      },
    },
    {
      header: "is Primary",
      cell: (app) => (
        <div className="truncate text-sm text-gray-700">
          {app.isPrimary ? (
            <div className="flex items-center gap-x-1">
              <StarIcon className="h-5 w-5 text-yellow-500" />
              Yes
            </div>
          ) : (
            "No"
          )}
        </div>
      ),
    },
    {
      header: "Date Submitted",
      cell: (app) => (
        <div className="text-sm text-gray-700">
          {formatDateOrNA(app.submittedAt.toString())}
        </div>
      ),
    },
    {
      header: "Actions",
      cell: (app) => (
        <div className="flex items-center justify-center gap-x-2">
          <EditButton link={`/dashboard/applications/${app.id}/edit`} />
        </div>
      ),
      textAlign: "center",
    },
  ];
