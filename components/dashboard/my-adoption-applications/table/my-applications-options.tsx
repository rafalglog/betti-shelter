import { ApplicationStatus } from "@prisma/client";
import {
  Hourglass,
  FileCheck2,
  List,
  UserCheck,
  UserX,
  XCircle,
  Heart,
} from "lucide-react";

export const ApplicationStatuses = [
  {
    value: ApplicationStatus.PENDING,
    labelKey: "myApplications.statusOptions.PENDING",
    icon: Hourglass,
  },
  {
    value: ApplicationStatus.REVIEWING,
    labelKey: "myApplications.statusOptions.REVIEWING",
    icon: FileCheck2,
  },
  {
    value: ApplicationStatus.WAITLISTED,
    labelKey: "myApplications.statusOptions.WAITLISTED",
    icon: List,
  },
  {
    value: ApplicationStatus.APPROVED,
    labelKey: "myApplications.statusOptions.APPROVED",
    icon: UserCheck,
  },
  {
    value: ApplicationStatus.REJECTED,
    labelKey: "myApplications.statusOptions.REJECTED",
    icon: UserX,
  },
  {
    value: ApplicationStatus.WITHDRAWN,
    labelKey: "myApplications.statusOptions.WITHDRAWN",
    icon: XCircle,
  },
  {
    value: ApplicationStatus.ADOPTED,
    labelKey: "myApplications.statusOptions.ADOPTED",
    icon: Heart,
  },
];
