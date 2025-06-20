import { PencilIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

interface Props {
  link: string;
}

export const EditButton = ({ link }: Props) => {
  return (
    <Link
      href={link}
      className="rounded-md border p-2 hover:bg-gray-100"
      aria-label="Edit pet"
      passHref
    >
      <PencilIcon className="w-5 h-5" />
    </Link>
  );
};