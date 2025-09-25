import { Sex } from "@prisma/client"
import {
  Mars,
  Venus,
  HelpCircle as UnknownIcon,
  CircleDot,
  Circle as SmallCircle,
  CircleDashed,
  CircleEllipsis,
} from "lucide-react"

export const sexOptions = [
  {
    value: Sex.MALE,
    label: "Male",
    icon: Mars,
  },
  {
    value: Sex.FEMALE,
    label: "Female",
    icon: Venus,
  },
  {
    value: Sex.UNKNOWN,
    label: "Unknown",
    icon: UnknownIcon,
  },
]

export const sizeOptions = [
  {
    value: "SMALL",
    label: "Small",
    icon: SmallCircle,
  },
  {
    value: "MEDIUM",
    label: "Medium",
    icon: CircleDot,
  },
  {
    value: "LARGE",
    label: "Large",
    icon: CircleDashed,
  },
  {
    value: "EXTRA_LARGE",
    label: "Extra Large",
    icon: CircleEllipsis,
  },
]