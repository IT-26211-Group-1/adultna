"use client";

import { ChevronRight, Plus, Home } from "lucide-react";
import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";

import { OptimizedImage } from "@/components/ui/OptimizedImage";

interface RoadmapNavigationProps {
  onAddMilestone?: () => void;
}

export function RoadmapNavigation({ onAddMilestone }: RoadmapNavigationProps) {
  const router = useRouter();

  const handleDashboardClick = () => {
    router.push("/dashboard");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40">
      <div className="relative">
        {/* Gradient background that fades to pure transparent */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/50 to-transparent" />
        {/* Blur effect only on the top portion */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-transparent backdrop-blur-md" />

        <div className="relative flex items-center justify-between px-4 sm:px-6 py-4">
          {/* Left Section - Logo and Breadcrumb */}
          <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0">
              <OptimizedImage
                priority
                alt="AdultNa Logo"
                className="object-contain"
                height={24}
                sizes="24px"
                src="/AdultNa-Logo-Icon.png"
                width={24}
              />
            </div>

            {/* Breadcrumb */}
            <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm min-w-0">
              <button
                className="flex items-center text-slate-600 hover:text-slate-900 transition-colors whitespace-nowrap"
                onClick={handleDashboardClick}
              >
                <Home className="w-3 h-3 sm:w-4 sm:h-4 mr-0.5 sm:mr-1" />
                <span className="hidden sm:inline">Dashboard</span>
                <span className="sm:hidden">Home</span>
              </button>
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400 flex-shrink-0" />
              <span className="text-slate-900 font-semibold truncate">Roadmap</span>
            </div>
          </div>

          {/* Right Section - Add Milestone Button */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            <Button
              className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-lg text-xs sm:text-sm font-semibold px-2 sm:px-4 py-2"
              startContent={<Plus className="w-3 h-3 sm:w-4 sm:h-4" />}
              onPress={onAddMilestone}
            >
              <span className="hidden sm:inline">Add Milestone</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
