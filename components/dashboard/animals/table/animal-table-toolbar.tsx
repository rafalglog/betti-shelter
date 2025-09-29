"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { Table } from "@tanstack/react-table";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DataTableViewOptions } from "../../../table-common/data-table-view-options";
import { sexOptions } from "./animal-options";
import { animalListingStatusOptions } from "@/app/lib/utils/enum-formatter";
import { AnimalsPayload } from "@/app/lib/types";
import { ServerSideFacetedFilter } from "@/components/table-common/server-side-faceted-filter";

interface AnimalsDataTableToolbarProps {
  table: Table<AnimalsPayload>;
}

const AnimalsDataTableToolbar = ({ table }: AnimalsDataTableToolbarProps) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const handleSearch = useDebouncedCallback((term) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    router.replace(`${pathname}?${params.toString()}`);
  }, 300);

  const isFiltered =
    searchParams.has("query") ||
    searchParams.has("listingStatus") ||
    searchParams.has("sex");

  return (
    <div className="@container/toolbar flex items-center justify-between">
      <div className="grid grid-cols-1 items-center gap-y-2 @[736px]/toolbar:grid-cols-[200px_1fr] @[736px]/toolbar:gap-x-4">
        <div>
          <Input
            id="animal-search"
            placeholder="Filter Animals..."
            onChange={(e) => {
              handleSearch(e.target.value);
            }}
            defaultValue={searchParams.get("query")?.toString()}
            className="h-8 w-[200px] @[736px]/toolbar:w-full"
          />
        </div>
        <div className="space-x-2 @[736px]/toolbar:justify-self-start items-center flex">
          <ServerSideFacetedFilter
            title="Status"
            paramKey="listingStatus"
            options={animalListingStatusOptions}
          />
          <ServerSideFacetedFilter
            title="Sex"
            paramKey="sex"
            options={sexOptions}
          />
          {isFiltered && (
            <Button
              variant="ghost"
              onClick={() => router.push(pathname)}
              className="h-8 px-2 lg:px-3"
            >
              Reset
              <X className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="flex self-start gap-2">
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
};

export default AnimalsDataTableToolbar;
