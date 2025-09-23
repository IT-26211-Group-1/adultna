import { Metadata } from "next";
import ResumeEditor from "./_components/ResumeEditor";
interface PageProps {
  searchParams: Promise<{ resumeId?: string }>;
}

export const metadata: Metadata = {
  title: "Design your resume",
};

export default async function Page({ searchParams }: PageProps) {
//   const { resumeId } = await searchParams;

//   const { userId } = await auth();

//   if (!userId) {
//     return null;
//   }

//   const resumeToEdit = resumeId
//     ? await prisma.resume.findUnique({
//         where: { id: resumeId, userId },
//         include: resumeDataInclude,
//       })
//     : null;
    return <ResumeEditor />;
//   return <ResumeEditor resumeToEdit={resumeToEdit} />;
}