import { Skeleton } from "@/components/ui/Skeletons";

export default function JobCardSkeleton() {
  return (
    <article className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white">
      <header className="mb-2">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </header>

      <div className="mt-2 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>

      <footer className="mt-4 flex items-center justify-between">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-10 w-32 rounded-md" />
      </footer>
    </article>
  );
}
