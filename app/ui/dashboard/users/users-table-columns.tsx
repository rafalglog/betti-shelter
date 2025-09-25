// import Image from "next/image";
// import { FilteredUsersPayload } from "@/app/lib/types";
// import { ColumnDef } from "@/app/ui/reusable-table";
// import { PhotoIcon } from "@heroicons/react/16/solid";
// import clsx from "clsx";
// import { Role } from "@prisma/client";
// import { EditButton } from "@/app/ui/dashboard/edit-button";
// import { formatDateOrNA } from "@/app/lib/utils/date-utils";

// export const userTableColumns: ColumnDef<FilteredUsersPayload>[] = [
//   {
//     header: "Email",
//     cell: (user) => (
//       <div className="flex items-center space-x-3">
//         <div className="shrink-0">
//           {user.image ? (
//             <Image
//               src={user.image}
//               className="h-8 w-8 rounded-full object-cover"
//               width={32}
//               height={32}
//               alt={`${user.email}'s profile picture`}
//             />
//           ) : (
//             <PhotoIcon className="h-8 w-8 text-gray-400" />
//           )}
//         </div>
//         <div className="truncate text-sm font-medium text-gray-900">
//           {user.email}
//         </div>
//       </div>
//     ),
//   },
//   {
//     header: "Role",
//     cell: (user) => (
//       <span
//         className={clsx(
//           "inline-flex rounded-full px-2 text-xs font-semibold capitalize leading-5",
//           {
//             [Role.USER]: "bg-green-100 text-green-800",
//             [Role.STAFF]: "bg-blue-100 text-blue-800",
//             [Role.ADMIN]: "bg-purple-100 text-purple-800",
//             [Role.VOLUNTEER]: "bg-yellow-100 text-yellow-800",
//           }[user.role] ?? "bg-gray-100 text-gray-800"
//         )}
//       >
//         {user.role.toString().toLowerCase()}
//       </span>
//     ),
//   },
//   {
//     header: "Date Created",
//     cell: (user) => (
//       <div className="text-sm text-gray-700">{formatDateOrNA(user.createdAt.toString())}</div>
//     ),
//   },
//   {
//     header: "Actions",
//     cell: (user) => (
//       <div className="flex items-center justify-center gap-x-2">
//         <EditButton link={`/dashboard/users/${user.id}/edit`} />
//       </div>
//     ),
//     textAlign: 'center',
//   },
// ];