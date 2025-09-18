import { TaskCategory, TaskPriority, TaskStatus } from "@prisma/client"
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  CheckCircle,
  Circle,
  CircleOff,
  HelpCircle,
  Timer,
  PauseCircle,
  Trash2,
  SkipForward,
  ClipboardList,
  PawPrint,
  Briefcase,
  BrushCleaning,
  Utensils,
} from "lucide-react"

export const categories = [
  {
    value: TaskCategory.MEDICAL,
    label: "Medical",
    icon: ClipboardList,
  },
  {
    value: TaskCategory.BEHAVIORAL,
    label: "Behavioral",
    icon: PawPrint,
  },
  {
    value: TaskCategory.ADMINISTRATIVE,
    label: "Administrative",
    icon: Briefcase,
  },
  {
    value: TaskCategory.CLEANING,
    label: "Cleaning",
    icon: BrushCleaning,
  },
  {
    value: TaskCategory.FEEDING,
    label: "Feeding",
    icon: Utensils,
  },
]

export const statuses = [
  {
    value: TaskStatus.TODO,
    label: "Todo",
    icon: Circle,
  },
  {
    value: TaskStatus.IN_PROGRESS,
    label: "In Progress",
    icon: Timer,
  },
  {
    value: TaskStatus.DONE,
    label: "Done",
    icon: CheckCircle,
  },
  {
    value: TaskStatus.SKIPPED,
    label: "Skipped",
    icon: SkipForward,
  },
  {
    value: TaskStatus.CANCELED,
    label: "Canceled",
    icon: CircleOff,
  },
  {
    value: TaskStatus.ON_HOLD,
    label: "On Hold",
    icon: PauseCircle,
  },
  {
    value: TaskStatus.DELETED,
    label: "Deleted",
    icon: Trash2,
  },
]

export const priorities = [
  {
    value: TaskPriority.LOW,
    label: "Low",
    icon: ArrowDown,
  },
  {
    value: TaskPriority.MEDIUM,
    label: "Medium",
    icon: ArrowRight,
  },
  {
    value: TaskPriority.HIGH,
    label: "High",
    icon: ArrowUp,
  },
]
