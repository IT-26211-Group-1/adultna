"use client";

type OptimizedImageProps = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
};

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = "",
  priority = false,
  fill = false,
  sizes = "100vw",
}: OptimizedImageProps) {
  const basePath = src.replace(/\.(png|jpg|jpeg)$/i, "");
  const ext = src.match(/\.(png|jpg|jpeg)$/i)?.[0] || ".png";

  const widths = [640, 750, 828, 1080, 1200, 1920, 2048, 3840];
  const avifSrcSet = widths
    .map((w) => `${basePath}-${w}w.avif ${w}w`)
    .join(", ");
  const webpSrcSet = widths
    .map((w) => `${basePath}-${w}w.webp ${w}w`)
    .join(", ");
  const fallbackSrcSet = widths
    .map((w) => `${basePath}-${w}w${ext} ${w}w`)
    .join(", ");

  if (fill) {
    return (
      <picture className={className}>
        <source sizes={sizes} srcSet={avifSrcSet} type="image/avif" />
        <source sizes={sizes} srcSet={webpSrcSet} type="image/webp" />
        <img
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover"
          loading={priority ? "eager" : "lazy"}
          src={src}
          srcSet={fallbackSrcSet}
        />
      </picture>
    );
  }

  return (
    <picture>
      <source sizes={sizes} srcSet={avifSrcSet} type="image/avif" />
      <source sizes={sizes} srcSet={webpSrcSet} type="image/webp" />
      <img
        alt={alt}
        className={className}
        height={height}
        loading={priority ? "eager" : "lazy"}
        sizes={sizes}
        src={src}
        srcSet={fallbackSrcSet}
        width={width}
      />
    </picture>
  );
}
