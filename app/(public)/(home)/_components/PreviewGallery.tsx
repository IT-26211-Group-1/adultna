import Image from "next/image";

export function PreviewGallery() {
  return (
    <section className="flex-1 flex items-center justify-center mt-10 md:mt-0 px-4">
      <div className="w-full max-w-4xl">
        <Image
          alt="Preview Gallery"
          className="w-full h-auto rounded-md"
          height={800}
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 80vw, 1200px"
          src="/Preview Element.png"
          width={1200}
        />
      </div>
    </section>
  );
}
