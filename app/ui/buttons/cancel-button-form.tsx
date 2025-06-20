import React from 'react';
import Link from 'next/link';

interface Props {
  href: string;
  isPending: boolean;
}

const CancelButton = ({ href, isPending }: Props) => {
  return (
    <Link
      href={isPending ? "#" : href}
      className={`text-sm font-semibold leading-6 text-gray-900 ${isPending ? 'cursor-not-allowed opacity-50' : ''}`}
      onClick={(e) => isPending && e.preventDefault()}
    >
      Cancel
    </Link>
  );
};

export default CancelButton;