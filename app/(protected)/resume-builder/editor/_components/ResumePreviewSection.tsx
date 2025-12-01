import { memo, useCallback } from "react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { ResumeData } from "@/validators/resumeSchema";
import ColorPicker from "./ColorPicker";

const ResumePreview = dynamic(() => import("./ResumePreview"), {
  loading: () => <div className="w-full h-full flex items-center justify-center">Loading...</div>,
});

interface ResumePreviewSectionProps {
  resumeData: ResumeData & { colorHex?: string };
  setResumeData: (data: ResumeData & { colorHex?: string }) => void;
  className?: string;
}

function ResumePreviewSection({
  resumeData,
  setResumeData,
  className,
}: ResumePreviewSectionProps) {
  const handleColorChange = useCallback(
    (color: { hex: string }) => {
      setResumeData({ ...resumeData, colorHex: color.hex });
    },
    [resumeData, setResumeData]
  );
  return (
    <div className={cn("group relative w-full h-full flex", className)}>
      <div className="absolute left-1 top-1 flex flex-none flex-col gap-3 opacity-50 transition-opacity group-hover:opacity-100 lg:left-3 lg:top-3 xl:opacity-100 z-10">
        <ColorPicker
          color={resumeData.colorHex}
          onChange={handleColorChange}
        />
      </div>
      <div className="flex w-full justify-center overflow-y-auto">
        <ResumePreview
          className="max-w-4xl shadow-md"
          resumeData={resumeData}
        />
      </div>
    </div>
  );
}

export default memo(ResumePreviewSection);
