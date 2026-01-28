"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";

type FilterOption = {
  value: string;
  label: string;
};

interface Props {
  colors: string[];
  breeds: string[];
  sizes: FilterOption[];
  selectedColor?: string;
  selectedBreed?: string;
  selectedSize?: string;
}

const PetFilters = ({
  colors,
  breeds,
  sizes,
  selectedColor,
  selectedBreed,
  selectedSize,
}: Props) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const t = useTranslations("pets");
  const allValue = "All";

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");

    if (value === allValue) {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="min-w-[180px]">
        <Select
          onValueChange={(value) => updateParam("color", value)}
          defaultValue={selectedColor || allValue}
        >
          <SelectTrigger aria-label={t("color")}>
            <SelectValue placeholder={t("color")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={allValue}>{t("allColors")}</SelectItem>
            {colors.map((color) => (
              <SelectItem key={color} value={color}>
                {color}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="min-w-[180px]">
        <Select
          onValueChange={(value) => updateParam("breed", value)}
          defaultValue={selectedBreed || allValue}
        >
          <SelectTrigger aria-label={t("breed")}>
            <SelectValue placeholder={t("breed")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={allValue}>{t("allBreeds")}</SelectItem>
            {breeds.map((breed) => (
              <SelectItem key={breed} value={breed}>
                {breed}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="min-w-[180px]">
        <Select
          onValueChange={(value) => updateParam("size", value)}
          defaultValue={selectedSize || allValue}
        >
          <SelectTrigger aria-label={t("size")}>
            <SelectValue placeholder={t("size")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={allValue}>{t("allSizes")}</SelectItem>
            {sizes.map((size) => (
              <SelectItem key={size.value} value={size.value}>
                {size.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default PetFilters;
