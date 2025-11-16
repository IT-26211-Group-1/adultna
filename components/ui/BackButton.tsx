import { ArrowLeft } from "lucide-react";

type BackButtonProps = {
  onClick: () => void;
  label?: string;
  className?: string;
};

export function BackButton({
  onClick,
  label = "Back",
  className = "",
}: BackButtonProps) {
  return (
    <button
      className={`flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors ${className}`}
      onClick={onClick}
    >
      <ArrowLeft className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </button>
  );
}
