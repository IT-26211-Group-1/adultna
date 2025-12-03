"use client";

import { ArrowLeft, Plus } from "lucide-react";
import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";

import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { CameraViewSelector, CameraView } from "./CameraViewSelector";

interface RoadmapNavigationProps {
  onAddMilestone?: () => void;
  onCameraViewChange?: (view: CameraView) => void;
  currentCameraView?: string;
  isMobile?: boolean;
}

export function RoadmapNavigation({ onAddMilestone, onCameraViewChange, currentCameraView, isMobile }: RoadmapNavigationProps) {
  const router = useRouter();

  const handleDashboardClick = () => {
    router.push("/dashboard");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40">
      <div className="bg-transparent">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Left Section - Back Button and Title */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Back Button */}
              <Button
                className="text-gray-700 hover:text-gray-900 border-0 bg-transparent p-2 min-w-fit transition-colors duration-200"
                size="sm"
                variant="light"
                startContent={<ArrowLeft className="w-4 h-4" />}
                onPress={handleDashboardClick}
              >
                <span className="hidden sm:inline text-sm font-medium">Back</span>
              </Button>

              {/* Divider */}
              <div className="hidden sm:block w-px h-5 bg-gray-300" />

              {/* Logo and Title */}
              <div className="flex items-center space-x-2 sm:space-x-3">
                <OptimizedImage
                  priority
                  alt="AdultNa Logo"
                  className="object-contain"
                  height={18}
                  sizes="18px"
                  src="/AdultNa-Logo-Icon.png"
                  width={18}
                />
                <h1 className="text-sm sm:text-base font-semibold text-adult-green tracking-tight">
                  Roadmap
                </h1>
              </div>
            </div>

            {/* Right Section - Camera View Selector and Add Milestone Button */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Camera View Selector */}
              {onCameraViewChange && (
                <CameraViewSelector
                  onViewChange={onCameraViewChange}
                  currentView={currentCameraView}
                  isMobile={isMobile}
                />
              )}

              {/* Add Milestone Button */}
              <Button
                className="bg-adult-green hover:bg-adult-green-600 text-white font-medium text-xs sm:text-sm px-2 sm:px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-150 border-0"
                size="sm"
                startContent={<Plus className="w-3 h-3 sm:w-4 sm:h-4" />}
                onPress={onAddMilestone}
              >
                <span className="hidden sm:inline">Add Milestone</span>
                <span className="sm:hidden">Add</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
