import { Role } from "@prisma/client";
import {
  User,
  Users,
  Handshake,
} from "lucide-react";

export const UserRoles = [
  {
    value: Role.USER,
    labelKey: "users.roleOptions.USER",
    icon: User,
  },
  {
    value: Role.STAFF,
    labelKey: "users.roleOptions.STAFF",
    icon: Users,
  },
  {
    value: Role.VOLUNTEER,
    labelKey: "users.roleOptions.VOLUNTEER",
    icon: Handshake,
  }
];
