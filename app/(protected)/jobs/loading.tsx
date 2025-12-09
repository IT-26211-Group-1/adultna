import JobCardSkeleton from "@/app/(protected)/jobs/_components/JobCardSkeleton";

export default function Loading() {
  const JOBS_PER_PAGE = 9;

  return (
    <div className="p-6 space-y-6">
      <div className="mb-8">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm p-2 h-20 animate-pulse" />
      </div>

      <div className="max-w-6xl mx-auto mb-6 h-10 animate-pulse bg-gray-200 rounded" />

      <div
        aria-label="Loading jobs"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
      >
        {[...Array(JOBS_PER_PAGE)].map((_, index) => (
          <JobCardSkeleton key={index} index={index} />
        ))}
      </div>
    </div>
  );
}
