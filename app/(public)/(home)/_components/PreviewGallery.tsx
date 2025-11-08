import Image from "next/image";

export function PreviewGallery() {
  return (
    <section className="absolute top-0 right-0 h-full w-1/2 hidden md:flex items-center justify-end z-10">
      <div className="w-full h-auto">
        <Image
          alt="Preview Gallery"
          className="w-full h-auto rounded-l-3xl"
          height={1600}
          sizes="50vw"
          src="/PreviewImage.png"
          width={2000}
        />
      </div>
    </section>
  );
}
