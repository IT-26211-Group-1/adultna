import { Skeleton } from "@/components/ui/Skeletons";

export default function JobCardSkeleton({ index = 0 }: { index?: number }) {

  const cardColors = [
    'from-[#ACBD6F]/10 to-[#ACBD6F]/5', // Olivine
    'from-[#F16F33]/10 to-[#F16F33]/5', // Crayola Orange
    'from-[#FCE2A9]/15 to-[#FCE2A9]/5', // Peach Yellow
    'from-[#CBCBE7]/12 to-[#CBCBE7]/4', // Periwinkle
  ];

  const cardColor = cardColors[index % cardColors.length];

  return (
    <article className={`bg-gradient-to-br ${cardColor} border border-gray-200 rounded-2xl overflow-hidden h-full flex flex-col animate-pulse`}>
      
      {/* Header Section */}
      <div className="p-5 flex-grow">

        {/* Date Badge Skeleton */}
        <div className="mb-4">
          <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full inline-block">
            <Skeleton className="h-3 w-16 bg-gray-300" />
          </div>
        </div>

        {/* Company Name Skeleton */}
        <div className="mb-2">
          <Skeleton className="h-4 w-24 bg-gray-300" />
        </div>

        {/* Job Title Skeleton */}
        <div className="mb-4">
          <Skeleton className="h-6 w-4/5 mb-1 bg-gray-300" />
          <Skeleton className="h-6 w-3/5 bg-gray-300" />
        </div>

        {/* Job Tags Skeleton */}
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full border border-white/40">
            <Skeleton className="h-3 w-16 bg-gray-300" />
          </div>
          <div className="bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full border border-white/40">
            <Skeleton className="h-3 w-12 bg-gray-300" />
          </div>
          <div className="bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full border border-white/40">
            <Skeleton className="h-3 w-20 bg-gray-300" />
          </div>
        </div>
      </div>

      <div className="bg-white p-4 flex items-center justify-between mt-auto border-t border-gray-100">
        <Skeleton className="h-4 w-20 bg-gray-300" />
        <Skeleton className="h-8 w-24 rounded-full bg-gray-300" />
      </div>
    </article>
  );
}
