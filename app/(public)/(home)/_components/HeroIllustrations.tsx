import Spline from "@splinetool/react-spline";

export function HeroIllustration() {
  return (
    <div className="flex-1 flex items-center justify-center md:justify-center relative mt-10 md:mt-0">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[300px] md:w-[400px] h-[80px] md:h-[200px] bg-slate-400 rounded-full blur-2xl opacity-30" />
      </div>
      <Spline scene="https://prod.spline.design/bVl9NIhxjaYGVL1N/scene.splinecode" />
    </div>
  );
}
