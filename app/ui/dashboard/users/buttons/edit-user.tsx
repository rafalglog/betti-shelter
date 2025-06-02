import { PencilIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { UserIdProps } from "@/app/lib/types";

export const EditUser = ({ id }: UserIdProps) => {
  return (
    <Link
      href={`/dashboard/users/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}