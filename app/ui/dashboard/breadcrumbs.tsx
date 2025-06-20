'use client'
 
import { usePathname } from 'next/navigation'
import { ChevronRightIcon, HomeIcon } from "@heroicons/react/16/solid"
import { clsx } from "clsx"
import Link from "next/link"

// Function to check if a segment looks like a dynamic ID/slug
const isDynamicSegment = (segment: string): boolean => {
  // Check for common ID patterns
  const patterns = [
    /^[a-z0-9]{25,}$/i,      // CUID/UUID-like (25+ alphanumeric chars)
    /^[0-9]+$/,              // Pure numbers
    /^[a-f0-9-]{36}$/i,      // UUID format
    /^[a-z0-9]{20,}$/i,      // Other long alphanumeric IDs
  ]
  
  return patterns.some(pattern => pattern.test(segment))
}

// Function to convert URL segments to readable labels
const formatLabel = (segment: string): string => {
  if (!segment) return ''
  
  // Replace hyphens and underscores with spaces, then capitalize each word
  return segment
    .replace(/[-_]/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Simplified breadcrumbs
export default function Breadcrumbs() {
  const pathname = usePathname()
  const allSegments = pathname.split('/').filter(segment => segment !== '')
  
  // Filter out dynamic segments (IDs/slugs) but keep track of original positions
  const segmentsWithIndex = allSegments.map((segment, originalIndex) => ({
    segment,
    originalIndex,
    isDynamic: isDynamicSegment(segment)
  }))
  
  const visibleSegments = segmentsWithIndex.filter(item => !item.isDynamic)
  
  // Don't show breadcrumbs on home page
  if (visibleSegments.length === 0) return null

  return (
    <nav aria-label="Breadcrumb" className="mb-6 block">
      <ol className="flex text-sm font-medium gap-x-1">
        {/* Home icon */}
        <li className="flex text-gray-400 gap-x-1 items-center">
          <Link href="/">
            <HomeIcon className="w-4 h-4" />
          </Link>
          <ChevronRightIcon className="w-4 h-4" />
        </li>
        
        {/* Dynamic segments */}
        {visibleSegments.map((item, displayIndex) => {
          // Build the href using original segments up to this item's original position
          const href = '/' + allSegments.slice(0, item.originalIndex + 1).join('/')
          const isLast = displayIndex === visibleSegments.length - 1
          
          return (
            <li
              key={href}
              aria-current={isLast ? true : undefined}
              className={clsx("flex gap-x-1 text-gray-400 last:text-gray-700")}
            >
              <Link href={href}>
                {formatLabel(item.segment)}
              </Link>
              {!isLast && (
                <ChevronRightIcon className="w-4 h-4 my-auto" />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}