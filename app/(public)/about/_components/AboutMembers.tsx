import { MemberCard } from "./MemberCard";

export function AboutMembers() {
  const membersInfo = [
    {
      name: "Patricia Bianca Arellano",
      description: "Project Manager and Frontend Developer",
      github: "https://github.com/",
      linkedin: "https://linkedin.com/",
      bg: "bg-olivine/50",
    },
    {
      name: "Kurt Emmanuel Duterte",
      description: "Lead Backend Developer and Database Administrator",
      github: "https://github.com/",
      linkedin: "https://linkedin.com/",
      bg: "bg-periwinkle",
    },
    {
      name: "Lewis Dominique Nilo",
      description: "Frontend Developer and Quality Assurance Engineer",
      github: "https://github.com/",
      linkedin: "https://linkedin.com/",
      bg: "bg-olivine/50",
    },
    {
      name: "Adrian Dale Relevo",
      description: "Frontend Developer and Quality Assurance Engineer",
      github: "https://github.com/",
      linkedin: "https://linkedin.com/",
      bg: "bg-periwinkle",
    }
  ];

  return (
    <section className="w-full min-h-[500px] top-10 py-16 bg-white relative flex flex-col gap-8 px-4 md:px-22 max-w-6xl text-justify">
      <h2 className="text-3xl md:text-4xl lg:text-5xl text-ultra-violet leading-tight font-playfair text-center ">
        The <span className="text-crayola-orange">Team</span> Behind The Dream
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {membersInfo.map((member) => (
          <MemberCard
            key={member.name}
            bg={member.bg}
            description={member.description}
            github={member.github}
            linkedin={member.linkedin}
            name={member.name}
          />
        ))}
      </div>
    </section>
  );
}
