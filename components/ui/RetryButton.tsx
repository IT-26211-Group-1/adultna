import React from "react";
import clsx from "clsx";

interface RetryButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onRetry: () => void;
  children?: React.ReactNode;
}

export const RetryButton = ({
  onRetry,
  children = "Retry",
  className,
  ...rest
}: RetryButtonProps) => {
  return (
    <button
      className={clsx(
        "px-4 py-2 bg-adult-green text-white rounded-lg hover:bg-adult-green/90 transition-colors",
        className,
      )}
      onClick={onRetry}
      type="button"
      {...rest}
    >
      {children}
    </button>
  );
};
