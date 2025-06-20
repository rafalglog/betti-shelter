"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

interface SearchProps {
  placeholder: string;
}

const Search = ({ placeholder }: SearchProps) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // use-debounce to delay the execution of the function after the user stops typing
  const handleSearch = useDebouncedCallback((term) => {
    // get url params
    const params = new URLSearchParams(searchParams);

    // when the user types a new search query, reset the page number to 1.
    params.set("page", "1");

    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }

    // update the url
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className="relative">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        id="search"
        name="search"
        type="search"
        className="block w-90 rounded-md border-0 py-1.5 pl-10 text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        placeholder={placeholder}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        defaultValue={searchParams.get("query")?.toString()}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
    </div>
  );
}

export default Search;