import { PreviewText } from "@/app/(public)/(home)/_components/PreviewText";
import { PreviewGallery } from "@/app/(public)/(home)/_components/PreviewGallery";

export function Preview() {
  return (
    <section className="w-full min-h-[600px] flex items-center justify-center px-4 md:px-22 py-16 bg-transparent relative">
      <div className="flex flex-col md:flex-row w-full max-w-8xl gap-1 items-center justify-center">
        <div className="flex-1 flex items-center justify-center md:justify-end">
          <PreviewText />
        </div>
        <div className="flex-1 flex items-center justify-center md:justify-start">
          <PreviewGallery />
        </div>
      </div>
    </section>
  );
}
