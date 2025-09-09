export function AboutText() {
  return (
    <section className="w-full min-h-[500px] top-10 py-16 bg-white relative flex flex-col gap-8 px-4 md:px-22 max-w-6xl text-justify">
      <h2 className="text-3xl md:text-4xl lg:text-5xl text-ultra-violet leading-tight font-playfair text-center ">
        The Journey of <span className="text-olivine">AdultNa</span>
      </h2>
      <p className="text-base md:text-lg text-ultra-violet leading-relaxed font-inter">
        The concept for this application is rooted in four students’ desire to
        make the transition into adulthood less overwhelming and more
        empowering. Like many of our peers, we recognized the common struggles
        young adults face—navigating government processes, managing important
        documents, building careers, and staying organized with personal goals.
        AdultNa was born out of the belief that these challenges don’t have to
        be faced alone.
      </p>
      <p className="text-base md:text-lg text-ultra-violet leading-relaxed font-inter">
        With tools like the Adulting FileBox, Milestone Tracker, Personalized
        Roadmap, and the ever helpful GovGuides, our mission is to provide a
        reliable companion for every Filipino youth stepping into adulthood.
        What began as a simple idea in a classroom has grown into a platform
        designed to guide, support, and inspire the journey toward independence.
      </p>
    </section>
  );
}
