import { Metadata } from "next";
import ResumeGrader from "./_components/ResumeGrader";

export const metadata: Metadata = {
  title: "Resume Grader",
};

export default async function Page() {
  return (
    <div className="flex h-screen w-full">
      {/* Main Content */}
      <div className="flex flex-col flex-1">
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <ResumeGrader />
        </main>
      </div>
    </div>
  );
}
