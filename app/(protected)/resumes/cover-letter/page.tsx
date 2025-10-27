import { Metadata } from "next";
import CoverLetterEditor from "./_components/CoverLetterEditor";

export const metadata: Metadata = {
  title: "Cover Letter Generator",
};

export default async function Page() {
  return <CoverLetterEditor />;
}
