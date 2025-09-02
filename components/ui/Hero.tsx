import { Button } from "@heroui/react";
import Spline from "@splinetool/react-spline";

export const Hero = () => {
  return (
    <section className="w-full min-h-[600px] flex flex-col md:flex-row items-center justify-between px-4 md:px-22 py-16 bg-white relative">
      {/* Left: Text Content */}
      <div className="flex-1 flex flex-col items-start justify-center gap-6 z-10 max-w-2xl">
        <h1 className="text-4xl md:text-5xl lg:text-6xl text-black text-left leading-tight">
          Graduation is just the{" "}
          <span className="italic text-crayola-orange">beginning</span> but
          we&apos;ll help you tackle the rest...
        </h1>
        <p className="text-lg md:text-xl text-ultraViolet text-left max-w-xl leading-relaxed">
          From your first steps to finding that dream career, managing your
          personal milestones, and everything in between.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-2 justify-start w-full">
          <Button className="text-white bg-olivine hover:bg-adult-green/90  hover:text-white border-adult-green border-3 px-6 py-3 rounded-lg font-medium transition-colors">
            Get Started with Us
          </Button>
          <Button className="text-white bg-olivine hover:bg-adult-green/90 hover:text-white border-adult-green border-3 px-6 py-3 rounded-lg transition-colors flex items-center">
            Find out More
            <svg
              className="size-5 w-5 h-5 inline-block ml-1"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                clipRule="evenodd"
                d="M8.25 3.75H19.5a.75.75 0 0 1 .75.75v11.25a.75.75 0 0 1-1.5 0V6.31L5.03 20.03a.75.75 0 0 1-1.06-1.06L17.69 5.25H8.25a.75.75 0 0 1 0-1.5Z"
                fillRule="evenodd"
              />
            </svg>
          </Button>
        </div>
      </div>

      {/* Right: Illustration */}
      <div className="flex-1 flex items-center justify-center md:justify-center relative mt-10 md:mt-0 ">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[300px] md:w-[400px] h-[80px] md:h-[200px] bg-slate-400 rounded-full blur-2xl opacity-30" />
        </div>
        <Spline scene="https://prod.spline.design/bVl9NIhxjaYGVL1N/scene.splinecode" />
      </div>
    </section>
  );
};
