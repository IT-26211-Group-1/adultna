import { Metadata } from "next";
import { Suspense } from "react";
import { CoverLetterEditorContainer } from "./_components/CoverLetterEditorContainer";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export const metadata: Metadata = {
  title: "Cover Letter Editor",
};

export default async function Page() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <CoverLetterEditorContainer />
    </Suspense>
  );
}
