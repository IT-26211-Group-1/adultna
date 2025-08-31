import { Link } from "@heroui/link";
import NextLink from "next/link";
import Image from "next/image";

export const Footer = () => {
  return (
    <footer className="bg-ultra-violet text-white">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="flex flex-col items-start">
          <div className="flex items-center gap-2">
            <Image alt="Logo" height={350} src="/FooterLogo.png" width={350} />
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:gap-16 gap-8 text-sm">
          <div className="flex flex-col space-y-2">
            <Link
              as={NextLink}
              className="text-white hover:text-crayola-orange"
              href="/about"
              underline="hover"
            >
              About Us
            </Link>
            <Link
              as={NextLink}
              className="text-white hover:text-crayola-orange"
              href="/resources"
              underline="hover"
            >
              Resources
            </Link>
            <Link
              as={NextLink}
              className="text-white hover:text-crayola-orange"
              href="/faq"
              underline="hover"
            >
              FAQs
            </Link>
          </div>
          <div className="flex flex-col space-y-2">
            {/* Update to Actual links once created*/}
            <Link
              className="text-white hover:text-crayola-orange"
              href="https://ust.instructure.com"
              underline="always"
            >
              LinkedIn ↗
            </Link>
            <Link
              className="text-white hover:text-crayola-orange"
              href="https://ust.instructure.com"
              underline="always"
            >
              Instagram ↗
            </Link>
            <Link
              className="text-white hover:text-crayola-orange"
              href="https://ust.instructure.com"
              underline="always"
            >
              Facebook ↗
            </Link>
          </div>
        </div>
      </div>
      <div className="bg-periwinkle text-center py-3 text-xs text-ultra-violet">
        © AdultNa 2025
      </div>
    </footer>
  );
};
