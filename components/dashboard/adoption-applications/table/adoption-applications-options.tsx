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
    labelKey: "adoptionApplications.statusOptions.PENDING",
    icon: Hourglass,
  },
  {
    value: ApplicationStatus.REVIEWING,
    labelKey: "adoptionApplications.statusOptions.REVIEWING",
    icon: FileCheck2,
  },
  {
    value: ApplicationStatus.WAITLISTED,
    labelKey: "adoptionApplications.statusOptions.WAITLISTED",
    icon: List,
  },
  {
    value: ApplicationStatus.APPROVED,
    labelKey: "adoptionApplications.statusOptions.APPROVED",
    icon: UserCheck,
  },
  {
    value: ApplicationStatus.REJECTED,
    labelKey: "adoptionApplications.statusOptions.REJECTED",
    icon: UserX,
  },
  {
    value: ApplicationStatus.WITHDRAWN,
    labelKey: "adoptionApplications.statusOptions.WITHDRAWN",
    icon: XCircle,
  },
  {
    value: ApplicationStatus.ADOPTED,
    labelKey: "adoptionApplications.statusOptions.ADOPTED",
    icon: Heart,
  },
];
