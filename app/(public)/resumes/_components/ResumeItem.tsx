"use client";

import NextLink from "next/link";



export default function ResumeItem() {
  
  return <div className="group border rounded-lg border-transparent">
    <NextLink 
    href="/editor?resumeId=" // Replace with actual resume ID from db 
    className="inline-block w-full text-center">
      <p className="font-semibold line-clamp-1">
        {/* Add ng resume.title */}
      </p>

    </NextLink>
    </div>;
}