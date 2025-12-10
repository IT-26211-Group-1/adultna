import { memo } from "react";

interface LoadingSpinnerProps {
  fullScreen?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "default" | "dots" | "pulse";
  className?: string;
}

const sizeMap = {
  sm: "h-4 w-4",
  md: "h-8 w-8",
  lg: "h-12 w-12",
  xl: "h-16 w-16",
};

const LoadingSpinnerComponent = ({
  fullScreen = true,
  size = "lg",
  variant = "default",
  className = "",
}: LoadingSpinnerProps) => {
  const getSpinner = () => {
    switch (variant) {
      case "dots":
        return (
          <div className={`flex space-x-1.5 ${className}`}>
            <div className="w-2.5 h-2.5 bg-[#11553F] rounded-full animate-bounce [animation-delay:0ms] [animation-duration:1.4s]" />
            <div className="w-2.5 h-2.5 bg-[#11553F] rounded-full animate-bounce [animation-delay:200ms] [animation-duration:1.4s]" />
            <div className="w-2.5 h-2.5 bg-[#11553F] rounded-full animate-bounce [animation-delay:400ms] [animation-duration:1.4s]" />
          </div>
        );

      case "pulse":
        return (
          <div className={`${sizeMap[size]} relative ${className}`}>
            <div className="absolute inset-0 bg-[#11553F] rounded-full animate-ping opacity-30 [animation-duration:2s]" />
            <div className="absolute inset-1 bg-[#11553F] rounded-full animate-ping opacity-50 [animation-duration:2s] [animation-delay:0.5s]" />
            <div className="relative bg-[#11553F] rounded-full h-full w-full animate-pulse opacity-90 [animation-duration:1.5s]" />
          </div>
        );

      default:
        return (
          <div className={`${sizeMap[size]} relative ${className}`}>
            <div className="absolute inset-0 rounded-full border-4 border-gray-200/30 border-t-[#11553F] animate-spin [animation-duration:0.8s] will-change-transform" />
          </div>
        );
    }
  };

  const spinner = getSpinner();

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {spinner}
      </div>
    );
  }

  return spinner;
};

LoadingSpinnerComponent.displayName = "LoadingSpinner";

export const LoadingSpinner = memo(LoadingSpinnerComponent);
