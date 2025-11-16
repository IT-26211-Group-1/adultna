"use client";

import { ChevronRight, Plus, Home } from "lucide-react";
import { Button } from "@heroui/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

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

        <div className="relative flex items-center justify-between px-6 py-4">
          {/* Left Section - Logo and Breadcrumb */}
          <div className="flex items-center space-x-4">
            {/* Logo */}
            <div className="flex items-center">
              <Image
                alt="AdultNa Logo"
                className="object-contain"
                height={32}
                src="/AdultNa-Logo-Icon.png"
                width={32}
              />
            </div>

            {/* Breadcrumb */}
            <div className="flex items-center space-x-2 text-sm">
              <button
                className="flex items-center text-slate-600 hover:text-slate-900 transition-colors"
                onClick={handleDashboardClick}
              >
                <Home className="w-4 h-4 mr-1" />
                Dashboard
              </button>
              <ChevronRight className="w-4 h-4 text-slate-400" />
              <span className="text-slate-900 font-semibold">Roadmap</span>
            </div>
          </div>

          {/* Right Section - Add Milestone Button */}
          <div className="flex items-center space-x-3">
            <Button
              className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-lg text-sm font-semibold px-4 py-2"
              startContent={<Plus className="w-4 h-4" />}
              onPress={onAddMilestone}
            >
              Add Milestone
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
