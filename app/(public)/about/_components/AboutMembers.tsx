import { MemberCard } from "./MemberCard";

export function AboutMembers() {
    return (
        <section className="w-full min-h-[500px] top-10 py-16 bg-white relative flex flex-col gap-8 px-4 md:px-22 max-w-6xl text-justify">
            <h2 className="text-3xl md:text-4xl lg:text-5xl text-ultra-violet leading-tight font-playfair text-center ">
                The <span className="text-crayola-orange">Team</span> Behind The Dream
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MemberCard 
              name="Patricia Bianca Arellano"
              description="Member Description"
              linkedin="https://linkedin.com/"
              github="https://github.com/"
              bg="bg-olivine/50"
            />
            <MemberCard
                name="Kurt Emmanuel Duterte"
                description="Member Description"
                linkedin="https://linkedin.com/"
                github="https://github.com/"
                bg="bg-periwinkle"
            />
            <MemberCard
                name="Lewis Dominique Nilo"
                description="Member Description"
                linkedin="https://linkedin.com/"
                github="https://github.com/"
                bg="bg-olivine/50"
            />
            <MemberCard
                name="Adrian Dale Relevo"
                description="Member Description"
                linkedin="https://linkedin.com/"
                github="https://github.com/"
                bg="bg-periwinkle"
            />
            </div>
        </section>
    );
}
