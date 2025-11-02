"use client";

import Image from "next/image";

type FeatureImageProps = {
  src: string;
  alt: string;
  className?: string;
};

export function FeatureImage({ src, alt, className = "" }: FeatureImageProps) {
  return (
    <div className={`relative w-full h-full ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-contain scale-125"
        priority
      />
    </div>
  );
}