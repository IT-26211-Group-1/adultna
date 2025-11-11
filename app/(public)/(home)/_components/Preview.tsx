import { PreviewText } from "@/app/(public)/(home)/_components/PreviewText";
import { PreviewGallery } from "@/app/(public)/(home)/_components/PreviewGallery";

export function Preview() {
  return (
    <section className="w-full min-h-screen lg:min-h-[600px] flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-16 xl:px-22 pt-8 sm:pt-12 md:pt-16 pb-4 sm:pb-8 lg:pb-16 bg-transparent relative">
      <div className="flex flex-col lg:flex-row w-full max-w-7xl gap-8 lg:gap-12 items-center justify-start">
        {/* Text content - takes up left side on large screens, full width on mobile/tablet */}
        <div className="w-full lg:w-1/2 flex items-center justify-center lg:justify-start order-2 lg:order-1">
          <PreviewText />
        </div>

        {/* Image content - shows in mobile/tablet/small laptop layout, hidden on large screens */}
        <div className="w-full lg:hidden flex items-center justify-end order-1">
          <PreviewGallery />
        </div>
      </div>

      {/* Large desktop image positioned at very right */}
      <div className="hidden lg:block">
        <PreviewGallery />
      </div>
    </section>
  );
}
