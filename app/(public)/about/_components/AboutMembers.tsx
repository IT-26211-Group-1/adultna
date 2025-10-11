import { MemberCard } from "./MemberCard";

export function AboutMembers() {
  return (
    <section className="w-full min-h-[500px] top-10 py-16 bg-transparent relative flex flex-col gap-8 px-4 md:px-22 max-w-6xl text-justify">
      <h2 className="text-3xl md:text-4xl lg:text-5xl text-ultra-violet leading-tight font-playfair text-center ">
        The <span className="text-crayola-orange">Team</span> Behind The Dream
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MemberCard
          bg="bg-olivine/50"
          description="Member Description"
          github="https://github.com/"
          linkedin="https://linkedin.com/"
          name="Patricia Bianca Arellano"
        />
        <MemberCard
          bg="bg-periwinkle"
          description="Member Description"
          github="https://github.com/"
          linkedin="https://linkedin.com/"
          name="Kurt Emmanuel Duterte"
        />
        <MemberCard
          bg="bg-olivine/50"
          description="Member Description"
          github="https://github.com/"
          linkedin="https://linkedin.com/"
          name="Lewis Dominique Nilo"
        />
        <MemberCard
          bg="bg-periwinkle"
          description="Member Description"
          github="https://github.com/"
          linkedin="https://linkedin.com/"
          name="Adrian Dale Relevo"
        />
      </div>
    </section>
  );
}
