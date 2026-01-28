import { Suspense } from "react";
import Search from "../../../components/search";
import { PublicPetsCardSkeleton } from "../../../components/skeletons";
import {
  fetchBreeds,
  fetchColors,
  fetchSpecies,
} from "@/app/lib/data/public.data";
import PetGrid from "@/components/public-pages/pets/pet-grid";
import CategoryList from "@/components/public-pages/pets/category-list";
import { SearchParamsType } from "@/app/lib/types";
import PetFilters from "@/components/public-pages/pets/pet-filters";
import { AnimalSize } from "@prisma/client";
import { getTranslations } from "next-intl/server";

interface Props {
  searchParams: SearchParamsType;
}

const Page = async ({ searchParams }: Props) => {
  const t = await getTranslations("pets");
  const {
    page = "1",
    category = "",
    query = "",
    color = "",
    breed = "",
    size = "",
  } = await searchParams;
  const speciesName = category;
  const currentPage = Number(page);
  const sizeFilter = Object.values(AnimalSize).includes(size as AnimalSize)
    ? (size as AnimalSize)
    : undefined;

  // get the list of species
  const [speciesList, colorList, breedList] = await Promise.all([
    fetchSpecies(),
    fetchColors(),
    fetchBreeds(),
  ]);
  const sizeOptions = Object.values(AnimalSize).map((value) => ({
    value,
    label: t(`sizes.${value}`),
  }));

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <div className="text-3xl font-medium">{t("title")}</div>
        <div className="text-sm text-gray-500">
          {t("subtitle")}
        </div>
      </div>

      <div className="flex flex-row flex-wrap items-center justify-between gap-x-2 gap-y-2">
        <div className="w-96">
          <Search
            placeholder={t("searchPlaceholder")}
            label={t("searchLabel")}
          />
        </div>

        {/* category option */}
        <CategoryList species={speciesList} speciesName={speciesName} />
      </div>
      <PetFilters
        colors={colorList}
        breeds={breedList}
        sizes={sizeOptions}
        selectedColor={color || undefined}
        selectedBreed={breed || undefined}
        selectedSize={sizeFilter}
      />

      {/* pets card */}
      <Suspense
        key={`${query}-${currentPage}-${speciesName}-${color}-${breed}-${size}`}
        fallback={<PublicPetsCardSkeleton />}
      >
        <PetGrid
          query={query}
          currentPage={currentPage}
          speciesName={speciesName}
          colorName={color || undefined}
          breedName={breed || undefined}
          size={sizeFilter}
        />
      </Suspense>
    </div>
  );
};

export default Page;
