import Image from "next/image";

export function PreviewGallery() {
  return (
    <section className="flex-1 flex items-center justify-center mt-10 md:mt-0">
      <Image
        alt="Preview Gallery"
        className="w-[900px] h-auto max-w-6xl"
        height={100}
        src="/Preview Element.png"
        width={100}
      />
    </section>
  );
}
