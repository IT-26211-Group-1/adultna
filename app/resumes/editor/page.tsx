import { Metadata } from "next";
import ResumeEditor from "./_components/ResumeEditor";

export const metadata: Metadata = {
  title: "Design your resume",
};

export default async function Page() {
    return <ResumeEditor />;
}