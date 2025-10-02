// import { fetchPetCardData } from "@/app/lib/data/animals/animal.data";

// // Card component that displays the total number of pets, adopted pets, pending pets, and published pets
// const CardWrapper = async () => {
//   const { totalPets, adoptedPetsCount, pendingPetsCount, publishedPetsCount } =
//     await fetchPetCardData();

//   return (
//     <div className="grid gap-6 grid-cols-2 sm:grid-cols-4">
//       <Card title="Total Pets" value={totalPets} />
//       <Card title="Adopted" value={adoptedPetsCount} />
//       <Card title="Pending" value={pendingPetsCount} />
//       <Card title="Published" value={publishedPetsCount} />
//     </div>
//   );
// }

// interface CardProps {
//   title: string;
//   value: number | string;
// }

// const Card = ({ title, value }: CardProps) => {
//   return (
//     <div className="rounded-xl p-2 shadow-xs text-gray-800 border border-gray-200 bg-gray-100/20">
//       <div className="flex pl-3 pt-2">
//         <h3 className="text-sm font-medium text-gray-700 tracking-wide">{title}</h3>
//       </div>
//       <p
//         className="truncate py-5 lg:py-8 text-center text-4xl"
//       >
//         {value}
//       </p>
//     </div>
//   );
// }

// export default CardWrapper;
