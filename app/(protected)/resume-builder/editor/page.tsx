import { Metadata } from "next";
import { Suspense } from "react";
import ResumeEditor from "./_components/ResumeEditor";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export const metadata: Metadata = {
  title: "Design your resume",
};

export default async function Page() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ResumeEditor />
    </Suspense>
  );
}
