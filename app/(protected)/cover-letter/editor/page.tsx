import { Metadata } from "next";
import { CoverLetterEditorContainer } from "./_components/CoverLetterEditorContainer";

export const metadata: Metadata = {
  title: "Cover Letter Editor",
};

export default async function Page() {
  return <CoverLetterEditorContainer />;
}
