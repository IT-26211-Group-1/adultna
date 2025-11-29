import React from "react";
import { AvatarProps } from "@/types/table";

import { OptimizedImage } from "@/components/ui/OptimizedImage";

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  size = "md",
  fallback,
  className = "",
}) => {
  const sizeClasses = {
    sm: "h-6 w-6 text-xs",
    md: "h-8 w-8 text-sm",
    lg: "h-10 w-10 text-base",
    xl: "h-12 w-12 text-lg",
  };

  const baseClasses = `inline-flex items-center justify-center rounded-full bg-gray-500 text-white font-medium ${sizeClasses[size]} ${className}`;

  const generateFallback = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const displayFallback = fallback || generateFallback(alt);

  if (src) {
    return (
      <OptimizedImage
        alt={alt}
        className={`${baseClasses} object-cover`}
        height={50}
        sizes="50px"
        src={src}
        width={50}
      />
    );
  }

  return <div className={baseClasses}>{displayFallback}</div>;
};

export default Avatar;
