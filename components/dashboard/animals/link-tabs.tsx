'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

// Define the type for a single link object
interface TabLink {
  href: string;
  label: string;
}

// Define the props for the LinkTabs component
interface LinkTabsProps {
  links: TabLink[];
  className?: string;
}

export function LinkTabs({ links, className }: LinkTabsProps) {
  const pathname = usePathname();

  return (
    <div
      className={cn(
        'bg-muted inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]',
        className,
      )}
    >
      {links.map((link) => {
        // With the parent component now providing the full, correct dynamic href,
        // a simple and robust equality check is all we need.
        const isActive = pathname === link.href;

        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'text-foreground dark:text-muted-foreground',
              'inline-flex items-center justify-center whitespace-nowrap',
              'rounded-md border border-transparent px-2 py-1 text-sm font-medium',
              'transition-[color,box-shadow]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              {
                'bg-background text-foreground dark:text-foreground shadow-sm':
                  isActive,
              },
            )}
            aria-current={isActive ? 'page' : undefined}
          >
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}