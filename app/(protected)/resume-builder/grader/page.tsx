import { Metadata } from "next";
import { Suspense } from "react";
import ResumeGrader from "./_components/ResumeGrader";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export const metadata: Metadata = {
  title: "Resume Grader",
};

export default async function Page() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ResumeGrader />
    </Suspense>
  );
}
