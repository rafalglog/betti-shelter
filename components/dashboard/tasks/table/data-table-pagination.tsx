"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Table } from "@tanstack/react-table"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DataTablePaginationProps<TData> {
  table: Table<TData>
  totalPages: number
}

export function DataTablePagination<TData>({
  table,
  totalPages,
}: DataTablePaginationProps<TData>) {
  const router = useRouter();

  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Get the current page and page size from the URL, with defaults.
  const currentPage = Number(searchParams.get("page")) || 1
  const pageSize = Number(searchParams.get("pageSize")) || 10

  // Create a URL for a specific page and page size.
  // const createPageURL = (page?: number, size?: number) => {
  //   const params = new URLSearchParams(searchParams)
  //   params.set("page", String(page ?? currentPage))
  //   params.set("pageSize", String(size ?? pageSize))
  //   return `${pathname}?${params.toString()}`
  // }
    const handleNavigation = (page?: number, size?: number) => {
    const params = new URLSearchParams(searchParams);
    // If a new page is provided, set it. Otherwise, keep the current page.
    params.set("page", String(page ?? currentPage));
    // If a new size is provided, set it. Otherwise, keep the current size.
    params.set("pageSize", String(size ?? pageSize));
    router.push(`${pathname}?${params.toString()}`);
  };

  // Determine if navigation buttons should be disabled
  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex-1 text-sm text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          {/* <Select
            value={`${pageSize}`}
            onValueChange={(value) => {
              window.location.href = createPageURL(1, Number(value))
            }}
          > */}
          <Select
            value={`${pageSize}`}
            onValueChange={(value) => {
              // When changing page size, always go back to page 1
              handleNavigation(1, Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => handleNavigation(1)}
            disabled={!canGoPrevious}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => handleNavigation(currentPage - 1)}
            disabled={!canGoPrevious}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => handleNavigation(currentPage + 1)}
            disabled={!canGoNext}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => handleNavigation(totalPages)}
            disabled={!canGoNext}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
        {/* <div className="flex items-center space-x-2">
          <Link href={createPageURL(1)} passHref>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              disabled={currentPage <= 1}
            >
              <span className="sr-only">Go to first page</span>
              <ChevronsLeft />
            </Button>
          </Link>
          <Link href={createPageURL(currentPage - 1)} passHref>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              disabled={currentPage <= 1}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeft />
            </Button>
          </Link>
          <Link href={createPageURL(currentPage + 1)} passHref>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              disabled={currentPage >= totalPages}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRight />
            </Button>
          </Link>
          <Link href={createPageURL(totalPages)} passHref>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              disabled={currentPage >= totalPages}
            >
              <span className="sr-only">Go to last page</span>
              <ChevronsRight />
            </Button>
          </Link>
        </div> */}
      </div>
    </div>
  )
}