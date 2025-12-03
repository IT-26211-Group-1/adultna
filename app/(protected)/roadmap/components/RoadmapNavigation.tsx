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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left Section - Back Button and Title */}
            <div className="flex items-center space-x-4">
              {/* Back Button */}
              <Button
                className="text-gray-700 hover:text-gray-900 hover:bg-white/60 border-0 bg-white/40 p-2 min-w-fit transition-colors duration-200 backdrop-blur-sm"
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
              <div className="flex items-center space-x-3">
                <OptimizedImage
                  priority
                  alt="AdultNa Logo"
                  className="object-contain"
                  height={20}
                  sizes="20px"
                  src="/AdultNa-Logo-Icon.png"
                  width={20}
                />
                <h1 className="text-base font-semibold text-gray-800 tracking-tight">
                  Roadmap
                </h1>
              </div>
            </div>

            {/* Right Section - Camera View Selector and Add Milestone Button */}
            <div className="flex items-center space-x-3">
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
                className="bg-green-600 hover:bg-green-700 text-white font-medium text-sm px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-150 border-0"
                size="sm"
                startContent={<Plus className="w-4 h-4" />}
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
