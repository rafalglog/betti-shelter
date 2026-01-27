"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");

    if (value === "All") {
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
          defaultValue={selectedColor || "All"}
        >
          <SelectTrigger aria-label="Color filter">
            <SelectValue placeholder="Color" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All colors</SelectItem>
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
          defaultValue={selectedBreed || "All"}
        >
          <SelectTrigger aria-label="Breed filter">
            <SelectValue placeholder="Breed" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All breeds</SelectItem>
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
          defaultValue={selectedSize || "All"}
        >
          <SelectTrigger aria-label="Size filter">
            <SelectValue placeholder="Size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All sizes</SelectItem>
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
