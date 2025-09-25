import {
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
} from "@/components/public-pages/social-media-icons";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mx-auto w-full max-w-7xl bg-white px-10 pt-10 pb-8 rounded-b-sm border-t border-gray-100">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-8 border-b border-gray-200 pb-8">
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            Navigation
          </h3>
          <ul className="mt-4 space-y-2">
            <li>
              <Link
                href="/about"
                className="text-sm text-slate-500 hover:text-slate-700"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="text-sm text-slate-500 hover:text-slate-700"
              >
                Contact
              </Link>
            </li>
            <li>
              <Link
                href="/pets"
                className="text-sm text-slate-500 hover:text-slate-700"
              >
                Find a Pet
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            Legal
          </h3>
          <ul className="mt-4 space-y-2">
            <li>
              <Link
                href="#"
                className="text-sm text-slate-500 hover:text-slate-700"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-sm text-slate-500 hover:text-slate-700"
              >
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            Connect
          </h3>
          <div className="flex gap-5 mt-4">
            <Link href="#" aria-label="Facebook">
              <FacebookIcon className="w-6 h-6 fill-slate-400 hover:fill-slate-600" />
            </Link>
            <Link href="#" aria-label="Twitter">
              <TwitterIcon className="w-6 h-6 fill-slate-400 hover:fill-slate-600" />
            </Link>
            <Link href="#" aria-label="Instagram">
              <InstagramIcon className="w-6 h-6 fill-slate-400 hover:fill-slate-600" />
            </Link>
          </div>
        </div>
      </div>
      <div className="pt-6 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} Pet Adopt. All Rights Reserved.
      </div>
    </footer>
  );
}
