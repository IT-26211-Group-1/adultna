"use client";

import { Link } from "@heroui/link";
import NextLink from "next/link";

import { OptimizedImage } from "@/components/ui/OptimizedImage";

export const Footer = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);

    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <footer className="bg-olivine text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-2 mb-4">
              <OptimizedImage
                alt="AdultNa Logo"
                height={250}
                sizes="250px"
                src="/Updated-AdultNa-Logo.png"
                width={250}
              />
            </div>
            <p className="text-white text-xs leading-relaxed max-w-xs">
              Your guide to adulting—made simple for fresh grads starting their
              journey.
            </p>
          </div>

          {/* Quick Links Column */}
          <div className="flex flex-col">
            <h3 className="text-white font-medium text-sm mb-4">Quick Links</h3>
            <div className="flex flex-col space-y-2">
              <Link
                as={NextLink}
                className="text-white hover:text-adult-green text-xs"
                href="/"
                underline="hover"
              >
                Home
              </Link>
              <Link
                as={NextLink}
                className="text-white hover:text-adult-green text-xs"
                href="/features"
                underline="hover"
              >
                Features
              </Link>
              <Link
                as={NextLink}
                className="text-white hover:text-adult-green text-xs"
                href="/about"
                underline="hover"
              >
                About Us
              </Link>
              <Link
                as={NextLink}
                className="text-white hover:text-adult-green text-xs"
                href="/faq"
                underline="hover"
              >
                FAQs
              </Link>
            </div>
          </div>

          {/* Our Features Column */}
          <div className="flex flex-col">
            <h3 className="text-white font-medium text-sm mb-4">
              Our Features
            </h3>
            <div className="flex flex-col space-y-2">
              <button
                className="text-white hover:text-adult-green text-xs text-left"
                onClick={() => scrollToSection("roadmap-section")}
              >
                Personalized Roadmap
              </button>
              <button
                className="text-white hover:text-adult-green text-xs text-left"
                onClick={() => scrollToSection("govguide-section")}
              >
                Government Guides
              </button>
              <button
                className="text-white hover:text-adult-green text-xs text-left"
                onClick={() => scrollToSection("job-section")}
              >
                Job Board
              </button>
              <button
                className="text-white hover:text-adult-green text-xs text-left"
                onClick={() => scrollToSection("resume-section")}
              >
                Resume Builder
              </button>
              <button
                className="text-white hover:text-adult-green text-xs text-left"
                onClick={() => scrollToSection("interview-section")}
              >
                Mock Interview Coach
              </button>
              <button
                className="text-white hover:text-adult-green text-xs text-left"
                onClick={() => scrollToSection("aigabay-section")}
              >
                AI Gabay
              </button>
              <button
                className="text-white hover:text-adult-green text-xs text-left"
                onClick={() => scrollToSection("filebox-section")}
              >
                Adulting Filebox
              </button>
            </div>
          </div>

          {/* Contact Us Column */}
          <div className="flex flex-col">
            <h3 className="text-white font-medium text-sm mb-4">Contact Us</h3>
            <div className="flex flex-col space-y-2 text-xs text-white">
              <div className="flex items-start gap-2">
                <svg
                  className="w-4 h-4 mt-0.5 text-white flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                  />
                </svg>
                <span>
                  12 Espana
                  <br />
                  Manila, Metro Manila 1000
                </span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-white flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                  />
                </svg>
                <span>adultna.org@gmail.com</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-white flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                  />
                </svg>
                <span>+63 (02) 123-4567</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-adult-green">
        <div className="max-w-7xl mx-auto px-6 py-3 flex flex-col md:flex-row justify-between items-center text-xs text-white">
          <span>© 2025 AdultNa. All rights reserved.</span>
          <div className="flex gap-4 mt-2 md:mt-0">
            <Link as={NextLink} className="text-white text-xs" href="/terms">
              Terms of Service
            </Link>
            <Link as={NextLink} className="text-white text-xs" href="/privacy">
              Privacy Policy
            </Link>
            <Link as={NextLink} className="text-white text-xs" href="/cookies">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
