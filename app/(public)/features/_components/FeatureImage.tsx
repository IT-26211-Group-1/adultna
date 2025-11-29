"use client";

import { OptimizedImage } from "@/components/ui/OptimizedImage";

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
      <OptimizedImage
        fill
        alt={alt}
        className="object-contain scale-125"
        priority={priority}
        sizes="(max-width: 768px) 100vw, 50vw"
        src={src}
      />
    </div>
  );
}
