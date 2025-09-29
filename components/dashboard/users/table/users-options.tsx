import { Role } from "@prisma/client";
import {
  User,
  Users,
  Handshake,
} from "lucide-react";

export const UserRoles = [
  {
    value: Role.USER,
    label: "User",
    icon: User,
  },
  {
    value: Role.STAFF,
    label: "Staff",
    icon: Users,
  },
  {
    value: Role.VOLUNTEER,
    label: "Volunteer",
    icon: Handshake,
  }
];