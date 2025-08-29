import { Link } from "@heroui/link";
import { Divider } from "@heroui/divider";
import NextLink from "next/link";
import Image from "next/image";

export const Footer = () => {
  return (
    <footer className="bg-ultra-violet text-white">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        
        <div className="flex flex-col items-start">
          <div className="flex items-center gap-2">
            <Image 
            src="/FooterLogo.png" 
            width={350} 
            height={350}
            // className="h-24 w-auto md:h-32" 
            alt="Logo" />
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:gap-16 gap-8 text-sm">
          <div className="flex flex-col space-y-2">
            <Link
              as={NextLink}
              href="/about"
              underline="hover"
              className="text-white hover:text-crayola-orange"
            >
              About Us
            </Link>
            <Link
              as={NextLink}
              href="/resources"
              underline="hover"
              className="text-white hover:text-crayola-orange"
            >
              Resources
            </Link>
            <Link
              as={NextLink}
              href="/faq"
              underline="hover"
              className="text-white hover:text-crayola-orange"
            >
              FAQs
            </Link>

          </div>
          <div className="flex flex-col space-y-2">
            {/* Update to Actual links once created*/}
            <Link href="https://ust.instructure.com" underline="always" className="text-white hover:text-crayola-orange">
              LinkedIn ↗
            </Link>
            <Link href="https://ust.instructure.com" underline="always" className="text-white hover:text-crayola-orange">
              Instagram ↗
            </Link>
            <Link href="https://ust.instructure.com" underline="always" className="text-white hover:text-crayola-orange">
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
