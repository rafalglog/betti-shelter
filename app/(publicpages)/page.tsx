import Link from "next/link";
import WelcomeImage from "../ui/publicpages/welcome-image";

const categories = ["Dog", "Cat", "Bird", "Reptile"];

const Page = () => {
  return (
    <>
      <WelcomeImage />

      <h1 className="text-gray-700 text-center p-5 text-xl font-semibold">
        Categories
      </h1>

      <div className="flex justify-center mt-2 gap-x-3 mb-5">
        {categories.map((category) => (
          <Link
            href={`pets?page=1&category=${category}`}
            key={category}
            className="flex items-center justify-center w-40 h-16 sm:h-24 rounded-md shadow-md bg-slate-400"
          >
            <h1 className="font-medium text-gray-100">{category}</h1>
          </Link>
        ))}
      </div>
    </>
  );
}

export default Page;