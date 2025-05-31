import Image from "next/image";
import welcomePicture from "@/public/homeimage15.webp";
import Link from "next/link";

const WelcomeImage = () => {
  return (
    <div className="relative overflow-hidden bg-gray-200 h-96 flex flex-col items-center rounded-sm">
      <Image
        src={welcomePicture}
        alt="home image"
        fill
        style={{ objectFit: "cover" }}
        placeholder="blur"
      />

      <div className="text-center my-auto z-10">
        <div className="text-3xl text-white font-medium mb-3">
          Find your perfect pet today
        </div>
        <Link
          href="/pets"
          className="bg-tranparent hover:bg-white text-white hover:text-black font-semibold py-2 px-4 border border-white rounded-sm transition-colors"
        >
          <span>See Pets</span>
        </Link>
      </div>
    </div>
  );
};

export default WelcomeImage;
