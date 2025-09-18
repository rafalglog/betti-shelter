import Link from "next/link";
import WelcomeImage from "../ui/publicpages/welcome-image";
import { fetchLatestPublicAnimals } from "../lib/data/animals/public.data";
import Image from "next/image";
import { shimmer, toBase64 } from "../lib/utils/image-loading-placeholder";
import { calculateAgeString } from "../lib/utils/date-utils";
import { Suspense } from "react";
import { PhotoIcon } from "@heroicons/react/16/solid";
import LikeButton from "../ui/publicpages/like-button";
import { auth } from "@/auth";

const categories = ["Dog", "Cat", "Bird", "Reptile"];

const Page = () => {
  return (
    <>
      <WelcomeImage />

      <section aria-labelledby="featured-pets-heading" className="my-12">
        <h2
          id="featured-pets-heading"
          className="text-2xl font-semibold text-gray-700 text-center mb-8"
        >
          Friends Awaiting a Home
        </h2>

        <Suspense fallback={<div>Loading...</div>}>
          <LatestPetsContent />
        </Suspense>

        <div className="text-center mt-20">
          <Link
            href="/pets?page=1"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            View All Our Animals
          </Link>
        </div>
      </section>

      <section aria-labelledby="categories-heading" className="my-12">
        <h2
          id="categories-heading"
          className="text-2xl font-semibold text-gray-700 text-center mb-8"
        >
          Browse by Category
        </h2>
        <div className="flex flex-wrap justify-center mt-2 gap-4 mb-5">
          {categories.map((category) => (
            <Link
              href={`pets?page=1&category=${category}`}
              key={category}
              className="flex items-center justify-center w-40 h-20 sm:w-48 sm:h-24 rounded-lg shadow-md bg-slate-500 hover:bg-slate-600 transition-colors duration-200"
            >
              <h3 className="font-medium text-lg text-gray-100">{category}</h3>
            </Link>
          ))}
        </div>
      </section>

      <section
        aria-labelledby="how-to-help-heading"
        className="my-12 px-4 rounded-lg"
      >
        <h2
          id="how-to-help-heading"
          className="text-2xl font-semibold text-gray-800 mb-8 text-center"
        >
          How You Can Help
        </h2>
        <div className="grid md:grid-cols-3 gap-8 text-center max-w-4xl mx-auto">
          {/* Donate */}
          <div className="p-6 bg-gray-50 rounded-lg border border-gray-200/90">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Donate</h3>
            <p className="text-gray-600 mb-4">
              Your generosity helps us provide essential care, medical
              treatment, and find loving homes for animals.
            </p>
            <Link
              href="/donate"
              className="inline-block bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 px-5 rounded-md shadow transition-colors"
            >
              Give Today
            </Link>
          </div>
          {/* Volunteer */}
          <div className="p-6 bg-gray-50 rounded-lg border border-gray-200/90">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Volunteer
            </h3>
            <p className="text-gray-600 mb-4">
              Lend your time and skills to make a difference in the lives of our
              animals. Every hour helps!
            </p>
            <Link
              href="/volunteer"
              className="inline-block bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 px-5 rounded-md shadow transition-colors"
            >
              Join Our Team
            </Link>
          </div>
          {/* Foster */}
          <div className="p-6 bg-gray-50 rounded-lg border border-gray-200/90">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Foster</h3>
            <p className="text-gray-600 mb-4">
              Open your home temporarily to an animal in need, providing them
              with a nurturing environment.
            </p>
            <Link
              href="/foster"
              className="inline-block bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 px-5 rounded-md shadow transition-colors"
            >
              Learn to Foster
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

const LatestPetsContent = async () => {
  const latestAnimals = await fetchLatestPublicAnimals();

  const session = await auth();
  const currentUserId = session?.user?.id;

  return (
    <div className="mt-6 grid gap-4 gap-y-14 grid-cols-[repeat(auto-fit,minmax(theme('spacing.40'),1fr))]">
      {latestAnimals.map((animal) => {
        const isLikedByCurrentUser = !!(currentUserId && animal.likes?.length > 0);
        const ageString = calculateAgeString({
          birthDate: animal.birthDate,
          simple: true,
        });
        return (
          <Link
            href={`/pets/${animal.id}`}
            key={animal.id}
            className="relative max-w-[224px] bg-white block hover:shadow-lg transition-shadow duration-150 ease-in-out group rounded-lg"
          >
            <div className="relative w-full aspect-square overflow-hidden rounded-lg">
              {animal.animalImages?.length > 0 ? (
                <Image
                  src={animal.animalImages[0].url}
                  alt={`Photo of ${animal.name}`}
                  fill
                  sizes="(max-width: 480px) 80vw, (max-width: 768px) 40vw, (max-width: 1024px) 30vw, 224px"
                  placeholder={`data:image/svg+xml;base64,${toBase64(
                    shimmer(224, 224)
                  )}`}
                  className="rounded-md object-cover group-hover:scale-110 transition-transform duration-300 ease-in-out"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center">
                  <PhotoIcon className="w-16 h-16 text-gray-400" />
                </div>
              )}
            </div>

            <div className="absolute bottom-[-26px] left-2 right-2">
              <div className="text-sm flex flex-col px-4 py-2 bg-white shadow-lg rounded-lg relative">
                <span className="font-semibold w-full">{animal.name}</span>
                <div className="text-xs text-gray-500">
                  <span>{`${ageString} • ${animal.city}`}</span>
                </div>
                <div className="absolute -top-4 right-2 z-10">
                  <LikeButton
                    animalId={animal.id}
                    currentUserId={currentUserId}
                    isLikedByCurrentUser={isLikedByCurrentUser}
                  />
                </div>
              </div>
            </div>
          </Link>
          // <Link
          //   href={`/pets/${pet.id}`}
          //   key={pet.id}
          //   className="group block bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
          // >
          //   {/* Consider using Next/Image for optimized images */}
          //   {/* eslint-disable-next-line @next/next/no-img-element */}
          //   <Image
          //     src={`${pet.animalImages[0].url}`}
          //     width={300}
          //     height={200}
          //     placeholder={`data:image/svg+xml;base64,${toBase64(
          //       shimmer(300, 200)
          //     )}`}
          //     alt={`Photo of ${pet.name}`}
          //     className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
          //   />
          //   <div className="p-4">
          //     <h3 className="text-xl font-semibold text-slate-800">
          //       {pet.name}
          //     </h3>
          //     <p className="text-sm text-gray-600 mb-1">{pet.breed}</p>
          //     <p className="text-sm text-gray-600 mb-1">{ageString}</p>
          //     <span className="text-orange-600 group-hover:text-orange-700 font-medium text-sm">
          //       Learn more &rarr;
          //     </span>
          //   </div>
          // </Link>
        );
      })}
    </div>
  );
};

export default Page;
