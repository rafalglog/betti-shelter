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
    label: "Pending",
    icon: Hourglass,
  },
  {
    value: ApplicationStatus.REVIEWING,
    label: "Reviewing",
    icon: FileCheck2,
  },
  {
    value: ApplicationStatus.WAITLISTED,
    label: "Waitlisted",
    icon: List,
  },
  {
    value: ApplicationStatus.APPROVED,
    label: "Approved",
    icon: UserCheck,
  },
  {
    value: ApplicationStatus.REJECTED,
    label: "Rejected",
    icon: UserX,
  },
  {
    value: ApplicationStatus.WITHDRAWN,
    label: "Withdrawn",
    icon: XCircle,
  },
  {
    value: ApplicationStatus.ADOPTED,
    label: "Adopted",
    icon: Heart,
  },
];
