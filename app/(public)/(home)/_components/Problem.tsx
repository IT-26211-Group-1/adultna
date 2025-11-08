import { ProblemText } from "./ProblemText";
import { ProblemSubject } from "./ProblemSubject";

export function Problem() {
  return (
    <section className="relative z-0 w-full min-h-screen md:min-h-[1200px] py-10 sm:py-16 lg:py-24 flex flex-col justify-center">
    
      <div className="absolute inset-0">
        <svg
          className="w-full h-full"
          preserveAspectRatio="none"
          viewBox="0 0 1440 800"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Wave for desktop */}
            <clipPath id="waveClipDesktop">
              <path d="M0,120L34.3,110.7C68.6,101,137,83,206,96C274.3,109,343,153,411,144C480,135,549,73,617,64C685.7,55,754,99,823,120C891.4,141,960,139,1029,128C1097.1,117,1166,99,1234,85.3C1302.9,71,1371,61,1406,56L1440,51L1440,320L0,320L0,120Z M0,320L1440,320L1440,480L0,480L0,320Z M0,480L1440,480L1440,680L1392,693.3C1344,707,1248,733,1152,722.7C1056,712,960,664,864,645.3C768,627,672,637,576,656C480,675,384,704,288,722.7C192,741,96,749,48,753.3L0,758L0,480Z" />
            </clipPath>
            {/* Wave for tablets */}
            <clipPath id="waveClipTablet">
              <path d="M0,0L0,100L240,80L480,90L720,75L960,85L1200,70L1440,80L1440,0L0,0Z M0,80L240,60L480,70L720,55L960,65L1200,50L1440,60L1440,520L1200,530L960,505L720,525L480,500L240,520L0,510L0,80Z M0,510L240,530L480,510L720,535L960,515L1200,540L1440,520L1440,800L0,800L0,510Z" />
            </clipPath>
            {/* Mobile wave for full screen */}
            <clipPath id="waveClipMobile">
              <path d="M0,0L0,140L360,130L720,135L1080,125L1440,130L1440,0L0,0Z M0,130L360,120L720,125L1080,115L1440,120L1440,680L1080,685L720,680L360,690L0,685L0,130Z M0,685L360,695L720,690L1080,700L1440,695L1440,800L0,800L0,685Z" />
            </clipPath>
          </defs>
          <rect
            className="text-olivine hidden lg:block"
            clipPath="url(#waveClipDesktop)"
            fill="currentColor"
            height="100%"
            width="100%"
          />
          <rect
            className="text-olivine hidden md:block lg:hidden"
            clipPath="url(#waveClipTablet)"
            fill="currentColor"
            height="100%"
            width="100%"
          />
          <rect
            className="text-olivine block md:hidden"
            clipPath="url(#waveClipMobile)"
            fill="currentColor"
            height="100%"
            width="100%"
          />
        </svg>
      </div>

      {/* Top wave shadow */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none">
        {/* Desktop shadow */}
        <svg
          className="w-full hidden lg:block"
          preserveAspectRatio="none"
          viewBox="0 0 1440 320"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,160L34.3,154.7C68.6,149,137,139,206,138.7C274.3,139,343,149,411,144C480,139,549,117,617,101.3C685.7,85,754,75,823,90.7C891.4,107,960,149,1029,144C1097.1,139,1166,85,1234,58.7C1302.9,32,1371,32,1406,32L1440,32L1440,0L1405.7,0C1371.4,0,1303,0,1234,0C1165.7,0,1097,0,1029,0C960,0,891,0,823,0C754.3,0,686,0,617,0C548.6,0,480,0,411,0C342.9,0,274,0,206,0C137.1,0,69,0,34,0L0,0Z"
            fill="transparent"
            fillOpacity={1}
            style={{ filter: "drop-shadow(0 20px 16px rgba(0,0,0,0.15))" }}
          />
        </svg>
        {/* Tablet shadow */}
        <svg
          className="w-full hidden md:block lg:hidden"
          preserveAspectRatio="none"
          viewBox="0 0 1440 120"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,80L240,60L480,70L720,55L960,65L1200,50L1440,60L1440,0L0,0Z"
            fill="transparent"
            fillOpacity={1}
            style={{ filter: "drop-shadow(0 15px 12px rgba(0,0,0,0.12))" }}
          />
        </svg>
        {/* Mobile shadow */}
        <svg
          className="w-full md:hidden"
          preserveAspectRatio="none"
          viewBox="0 0 1440 80"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,60L360,50L720,55L1080,45L1440,50L1440,0L0,0Z"
            fill="transparent"
            fillOpacity={1}
            style={{ filter: "drop-shadow(0 10px 8px rgba(0,0,0,0.1))" }}
          />
        </svg>
      </div>
      <main className="relative z-10 px-2 sm:px-4 lg:px-8 w-full">
        <ProblemText />
        <ProblemSubject />
      </main>

      {/* Bottom wave shadow */}
      <div
        className="absolute bottom-0 left-0 w-full overflow-hidden leading-none"
        style={{ transform: "translateY(1px)", marginTop: "-1px" }}
      >
        {/* Desktop shadow */}
        <svg
          className="w-full hidden lg:block"
          preserveAspectRatio="none"
          viewBox="0 0 1440 320"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,160L48,176C96,192,192,224,288,250.7C384,277,480,299,576,309.3C672,320,768,320,864,309.3C960,299,1056,277,1152,261.3C1248,245,1344,235,1392,229.3L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            fill="transparent"
            fillOpacity={1}
            style={{ filter: "drop-shadow(0 -20px 16px rgba(0,0,0,0.15))" }}
          />
        </svg>
        {/* Tablet shadow */}
        <svg
          className="w-full hidden md:block lg:hidden"
          preserveAspectRatio="none"
          viewBox="0 0 1440 120"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,40L240,60L480,50L720,65L960,55L1200,70L1440,60L1440,120L0,120Z"
            fill="transparent"
            fillOpacity={1}
            style={{ filter: "drop-shadow(0 -15px 12px rgba(0,0,0,0.12))" }}
          />
        </svg>
        {/* Mobile shadow */}
        <svg
          className="w-full md:hidden"
          preserveAspectRatio="none"
          viewBox="0 0 1440 80"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,20L360,25L720,20L1080,30L1440,25L1440,80L0,80Z"
            fill="transparent"
            fillOpacity={1}
            style={{ filter: "drop-shadow(0 -10px 8px rgba(0,0,0,0.1))" }}
          />
        </svg>
      </div>
    </section>
  );
}
