import React from "react";
import clsx from "clsx";

interface LoadingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  children: React.ReactNode;
}

export const LoadingButton = ({
  loading = false,
  disabled,
  children,
  className,
  type = "button",
  ...rest
}: LoadingButtonProps) => {
  return (
    <button
      type={type}
      className={clsx(
        "flex items-center justify-center gap-2 px-4 py-2 rounded text-white bg-indigo-500 hover:bg-indigo-600 disabled:opacity-60",
        className
      )}
      disabled={disabled || loading}
      aria-busy={loading}
      {...rest}
    >
      {loading && (
        <svg
          className="mr-3 size-5 animate-spin text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M12 2a10 10 0 00-3.16 19.48 1 1 0 01-.68-1.88A8 8 0 1112 4a1 1 0 010-2z"
          />
        </svg>
      )}
      <span>{children}</span>
    </button>
  );
};
