export function FeatureText() {
  return (
    <section className="w-full py-12 bg-transparent relative flex flex-col gap-4 px-4 md:px-22 max-w-6xl mx-auto text-center">
      <h1 className="mt-16 text-3xl md:text-4xl lg:text-5xl text-black leading-tight font-playfair">
        What <span className="text-adult-green italic">AdultNa</span> Has To Offer
      </h1>
      <div className="space-y-4 text-sm md:text-base text-gray-700 max-w-5xl mx-auto font-inter">
        <p>
          This application is built on the belief that nobody has to go through the motions of starting adulthood clueless and alone.
          AdultNa is your all-in-one guide, mentor, and organizer—ready to equip you with the tools, knowledge, and resources
          that you would need to confidently face the obstacles of this new stage in your life.
        </p>
        <p>
          Whether it's securing your new job, managing vital documents, tracking personal goals/milestones, or building essential
          life skills, AdultNa is prepared to walk with your every step of the way as you're launched to the great beyond.
        </p>
      </div>
    </section>
  );
}
