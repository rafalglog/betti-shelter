"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Species } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";

interface Props {
  species: Species[];
  speciesName: string;
}

const CategoryList = ({ species, speciesName }: Props) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const t = useTranslations("pets");
  const allValue = "All";

  // List of options for the dropdown
  const optionList = [allValue, ...species.map((s) => s.name)];

  function handleCategoryChange(value: string) {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");

    if (value === allValue) {
      params.delete("category");
    } else {
      params.set("category", value);
    }
    // update the url
    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <Select
      onValueChange={handleCategoryChange}
      // Set the default value. If `speciesName` is not in the URL, it defaults to "All".
      defaultValue={speciesName || allValue}
    >
      <SelectTrigger className="w-52">
        {/* SelectValue will display the selected value, or the placeholder if none is selected */}
        <SelectValue placeholder={t("categoryPlaceholder")} />
      </SelectTrigger>
      <SelectContent>
        {optionList.map((value) => (
          <SelectItem key={value} value={value}>
            {value === allValue ? t("all") : value}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CategoryList;
