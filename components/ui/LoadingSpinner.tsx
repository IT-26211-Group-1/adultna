import { memo } from "react";

interface LoadingSpinnerProps {
  fullScreen?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "h-6 w-6",
  md: "h-10 w-10",
  lg: "h-16 w-16",
};

const LoadingSpinnerComponent = ({
  fullScreen = true,
  size = "lg",
}: LoadingSpinnerProps) => {
  const spinner = (
    <div className="relative">
      <div className={`${sizeMap[size]} relative`}>
        <div className="absolute inset-0 rounded-full border-4 border-olivine/30" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-adultGreen animate-spin" />
        <div
          className="absolute inset-2 rounded-full border-4 border-transparent border-r-olivine animate-spin animation-delay-150"
          style={{ animationDuration: "1s", animationDirection: "reverse" }}
        />
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ivory/50">
        {spinner}
      </div>
    );
  }

  return spinner;
};

LoadingSpinnerComponent.displayName = "LoadingSpinner";

export const LoadingSpinner = memo(LoadingSpinnerComponent);
