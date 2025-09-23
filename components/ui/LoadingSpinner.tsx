import { memo } from "react";

const LoadingSpinnerComponent = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" />
  </div>
);

LoadingSpinnerComponent.displayName = "LoadingSpinner";

export const LoadingSpinner = memo(LoadingSpinnerComponent);
