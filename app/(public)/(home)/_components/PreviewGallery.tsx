import Image from "next/image";

export function PreviewGallery() {
  return (
    <>
      {/* Mobile/Tablet/Small Laptop Image - Stacked Layout */}
      <div className="lg:hidden">
        <Image
          priority
          alt="Preview Gallery"
          className="h-auto rounded-l-xl"
          height={600}
          sizes="(max-width: 640px) 60vw, (max-width: 1024px) 50vw, 400px"
          src="/PreviewImage.png"
          width={800}
        />
      </div>

      {/* Large Desktop/Laptop Image - Positioned at very right */}
      <div className="hidden lg:block absolute top-0 right-0 h-full w-1/2 z-10">
        <div className="h-full flex items-center justify-end">
          <Image
            priority
            alt="Preview Gallery"
            className="w-full h-auto rounded-l-3xl"
            height={1600}
            sizes="50vw"
            src="/PreviewImage.png"
            width={2000}
          />
        </div>
      </div>
    </>
  );
}
