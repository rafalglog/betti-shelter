import {
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
} from "@/app/ui/social-media-icons";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mx-auto w-full max-w-304">
      <div className="border-t border-gray-300 py-6 flex justify-between items-center mt-10">
        <div className="text-sm text-slate-500">© 2025 Pet Adopt</div>
        <div className="flex gap-5">
          <Link href="#">
            <FacebookIcon className="w-5 h-5 fill-slate-400"/>
          </Link>
          <Link href="#">
            <TwitterIcon className="w-5 h-5 fill-slate-400"/>
          </Link>
          <Link href="#">
            <InstagramIcon className="w-5 h-5 fill-slate-400"/>
          </Link>
        </div>
      </div>
    </footer>
  );
}
