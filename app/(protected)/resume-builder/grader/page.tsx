import { Metadata } from "next";
import ResumeGrader from "./_components/ResumeGrader";

export const metadata: Metadata = {
  title: "Resume Grader",
};

export default async function Page() {
  return <ResumeGrader />;
}
