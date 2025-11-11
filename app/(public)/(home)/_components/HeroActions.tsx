"use client";

import { Button } from "@heroui/react";
import Link from "next/link";

export function HeroActions() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mt-2 justify-start w-full">
      <Link href="/auth/login">
        <Button className="text-white bg-adult-green hover:bg-adult-green/90 hover:text-white px-8 py-6 rounded-xl font-large text-md transition-colors">
          Get Started with Us
        </Button>
      </Link>
      <Link href="/features">
        <Button className="text-adult-green/90 bg-transparent border-1 border-adult-green/90 hover:underline hover:adult-green/90 px-8 py-6 rounded-xl font-large text-md transition-colors">
          Find out More
          <svg
            className="w-5 h-5 inline-block ml-1"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              clipRule="evenodd"
              d="M8.25 3.75H19.5a.75.75 0 0 1 .75.75v11.25a.75.75 0 0 1-1.5 0V6.31L5.03 20.03a.75.75 0 0 1-1.06-1.06L17.69 5.25H8.25a.75.75 0 0 1 0-1.5Z"
              fillRule="evenodd"
            />
          </svg>
        </Button>
      </Link>
    </div>
  );
}
