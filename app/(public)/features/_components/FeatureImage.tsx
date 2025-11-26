"use client";

import Image from "next/image";

type FeatureImageProps = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
};

export function FeatureImage({
  src,
  alt,
  className = "",
  priority = false,
}: FeatureImageProps) {
  return (
    <div className={`relative w-full h-full ${className}`}>
      <Image
        fill
        alt={alt}
        className="object-contain scale-125"
        loading={priority ? undefined : "lazy"}
        priority={priority}
        src={src}
      />
    </div>
  );
}
