import { memo } from "react";

function DashboardHeader() {
  return (
    <div className="mb-4 sm:mb-6 lg:mb-8">
      <h1 className="text-3xl sm:text-4xl md:text-4xl font-bold text-gray-600 mb-6 sm:mb-8 md:mb-12 mt-4 sm:mt-8 md:mt-15 leading-tight sm:leading-relaxed md:leading-[3rem]">
        Everything You Need for Career, Civic,{" "}
        <br className="hidden sm:block" /> and Life Readiness is{" "}
        <span className="italic text-adult-green">Here.</span>
      </h1>
    </div>
  );
}

export default memo(DashboardHeader);
