import { HeartIcon } from "@heroicons/react/24/outline";

// const shimmer =
//   "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent";

export const TableSkeleton = () => {
  return (
    <div className="shimmer-animation">
      <div className="mt-6 border border-gray-200 rounded-md shadow-xs overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                <div className="h-5 w-16 bg-gray-200 rounded-sm" />
              </th>
              <th scope="col" className="px-6 py-3">
                <div className="h-5 w-16 bg-gray-200 rounded-sm" />
              </th>
              <th scope="col" className="px-6 py-3">
                <div className="h-5 w-16 bg-gray-200 rounded-sm" />
              </th>
              <th scope="col" className="px-6 py-3">
                <div className="h-5 w-16 bg-gray-200 rounded-sm" />
              </th>
              <th scope="col" className="px-6 py-3">
                <div className="h-5 w-16 bg-gray-200 rounded-sm" />
              </th>
              <th scope="col" className="px-6 py-3s">
                <div className="h-5 w-10 bg-gray-200 rounded-sm" />
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <TableRowSkeleton />
            <TableRowSkeleton />
            <TableRowSkeleton />
            <TableRowSkeleton />
            <TableRowSkeleton />
            <TableRowSkeleton />
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const TableRowSkeleton = () => {
  return (
    <tr className="hover:bg-gray-100/50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-3">
          <div className="shrink-0">
            <div className="w-8 h-8 bg-gray-200 rounded-full" />
          </div>
          <div className="h-5 w-24 rounded bg-gray-200" />
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-5 w-20 rounded bg-gray-200" />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-5 w-12 rounded bg-gray-200" />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-5 w-24 rounded bg-gray-200" />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-5 w-16 rounded bg-gray-200" />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center justify-center gap-x-2">
          <div className="h-8 w-8 rounded bg-gray-200" />
        </div>
      </td>
    </tr>
  );
};

const LatestPetsSkeletonCard = () => {
  return (
    <div className="shimmer-animation max-w-64 bg-white border border-gray-200 p-4 shadow-md rounded-lg flex flex-col items-center justify-start">
      {/* Image Placeholder */}
      <div className="w-full max-w-[224px] aspect-square mb-4 overflow-hidden rounded-md bg-gray-200" />

      {/* Text Placeholders */}
      <div className="w-full flex flex-col items-center space-y-2">
        {/* Name Placeholder */}
        <div className="h-6 w-3/4 bg-gray-200 rounded-md"></div>
        {/* Age Placeholder */}
        <div className="h-4 w-1/2 bg-gray-200 rounded-md"></div>
        {/* Location Placeholder */}
        <div className="h-4 w-2/3 bg-gray-200 rounded-md"></div>
      </div>
    </div>
  );
};
export const LatestPetsSkeleton = () => {
  return (
    <div className="flex w-full flex-col md:col-span-4">
      <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(160px,1fr))]">
        <LatestPetsSkeletonCard />
        <LatestPetsSkeletonCard />
        <LatestPetsSkeletonCard />
        <LatestPetsSkeletonCard />
      </div>
    </div>
  );
};

// dashboard: skeleton for the cards
export const CardSkeleton = () => {
  return (
    <div className="shimmer-animation rounded-xl p-2 shadow-xs bg-gray-100/20 border border-gray-200">
      <div className="flex pl-3 pt-2">
        {/* Title placeholder */}
        <div className="h-4 w-20 rounded-md bg-gray-200" />
      </div>
      <div className="flex justify-center items-center py-5 lg:py-8">
        {/* Value placeholder */}
        <div className="h-12 w-16 rounded-md bg-gray-200" />
      </div>
    </div>
  );
};
export const CardsSkeleton = () => {
  return (
    <div className="grid gap-6 grid-cols-2 sm:grid-cols-4">
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </div>
  );
};

export const PaginationSkeleton = () => {
  return (
    <>
      <div className="border border-gray-300 h-10 w-10 bg-gray-100 rounded-sm" />
      <div className="border border-gray-300 h-10 w-10 bg-gray-100 rounded-sm ml-3 mr-3" />
      <div className="border border-gray-300 h-10 w-10 bg-gray-100 rounded-sm" />
    </>
  );
};

export const PublicPetsCardSkeleton = () => {
  return (
    <div className="mt-6 flex gap-3 flex-wrap">
      <PetCardSkeleton />
      <PetCardSkeleton />
      <PetCardSkeleton />
      <PetCardSkeleton />
      <PetCardSkeleton />
      <PetCardSkeleton />
    </div>
  );
};

export const PetCardSkeleton = () => {
  return (
    <div className="shimmer-animation relative bg-gray-100 border border-gray-200 p-4 shadow-md rounded-md w-40 flex flex-col items-center justify-center">
      <HeartIcon className="absolute top-2 right-2 h-6 w-6 text-red-300" />
      <div>
        <div className="w-full">
          <div className="h-28 w-28 bg-gray-200 rounded-md" />
          <div className="h-5 w-24 rounded-sm bg-gray-200 mt-1" />
          <div className="h-5 w-24 rounded-sm bg-gray-200 mt-1" />
        </div>
      </div>
    </div>
  );
};
