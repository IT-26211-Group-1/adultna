import { Metadata } from "next";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

const ResumeEditor = dynamic(() => import("./_components/ResumeEditor"), {
  loading: () => <LoadingSpinner fullScreen />,
  ssr: true,
});

export const metadata: Metadata = {
  title: "Design your resume",
};

export default async function Page() {
  return (
    <Suspense fallback={<LoadingSpinner fullScreen />}>
      <ResumeEditor />
    </Suspense>
  );
}
