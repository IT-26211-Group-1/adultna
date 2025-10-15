import { FAQAccordion } from "./FAQAccordion";
import { FAQText } from "./FAQText";
export default function FAQ() {
    return (
  <section className="relative w-full min-h-[400px] bg-white py-2 sm:py-16 lg:py-20 flex flex-col justify-center overflow-x-hidden">
      <div className="w-full max-w-6xl mx-auto flex flex-col items-center px-4">
        <FAQText />
      </div>
      {/** Full-bleed separator wave with accordion underneath **/}
      <div className="relative w-full">
        {/* Wave SVG */}
        <div className="w-full z-10 relative">
          <div className="w-[100vw]">
            <svg
              className="w-full block bg-olivine/80"
              preserveAspectRatio="none"
              viewBox="0 0 1440 190"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                className="fill-white filter drop-shadow-[0_20px_16px_rgba(0,0,0,0.15)]"
                d="M0,160L34.3,154.7C68.6,149,137,139,206,138.7C274.3,139,343,149,411,144C480,139,549,117,617,101.3C685.7,85,754,75,823,90.7C891.4,107,960,149,1029,144C1097.1,139,1166,85,1234,58.7C1302.9,32,1371,32,1406,32L1440,32L1440,0L1405.7,0C1371.4,0,1303,0,1234,0C1165.7,0,1097,0,1029,0C960,0,891,0,823,0,754.3,0,686,0,617,0C548.6,0,480,0,411,0C342.9,0,274,0,206,0C137.1,0,69,0,34,0L0,0Z"
              />
            </svg>
          </div>
        </div>
        {/* Purple background section starts immediately */}
        <div className="w-full z-0 bg-olivine/80 relative">
          <div className="w-full min-h-[600px] max-w-6xl mx-auto px-10 sm:px-6 py-8 sm:py-12">
            <FAQAccordion />
          </div>
          {/* Gradient fade at bottom */}
          <div
            className="absolute left-0 w-full h-20 pointer-events-none"
            style={{
              background: "linear-gradient(to bottom, rgba(172,189,111,0.8) 40%, rgba(255,255,255,0.7) 100%)",
            }}
          />
        </div>
      </div>
    </section>
  );
}