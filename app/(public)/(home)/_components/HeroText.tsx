import { HeroActions } from "./HeroActions";

export function HeroText() {
  return (
    <div className="flex-1 flex flex-col items-start justify-center gap-6 z-10 max-w-2xl pl-20">
      <h1 className="text-4xl md:text-5xl lg:text-6xl text-black text-left leading-tight font-playfair">
        Graduation is just the{" "}
        <span className="italic text-crayola-orange">beginning</span> but
        we&apos;ll help you tackle the rest...
      </h1>
      <p className="text-lg md:text-xl text-ultraViolet text-left max-w-xl leading-relaxed font-inter">
        From your first steps to finding that dream career, managing your
        personal milestones, and everything in between.
      </p>
      <HeroActions />
    </div>
  );
}
