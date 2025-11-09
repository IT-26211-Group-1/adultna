import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

type SaveStatusIndicatorProps = {
  isSaving: boolean;
  hasSaved: boolean;
};

export function SaveStatusIndicator({ isSaving, hasSaved }: SaveStatusIndicatorProps) {
  if (isSaving) {
    return (
      <span className="text-gray-500 flex items-center gap-2">
        <LoadingSpinner fullScreen={false} size="sm" />
        Saving...
      </span>
    );
  }

  if (hasSaved) {
    return (
      <span className="text-green-600 flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        Saved
      </span>
    );
  }

  return null;
}
