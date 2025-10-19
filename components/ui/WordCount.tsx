import React from "react";

interface WordCountProps {
  text?: string;
  maxCount: number;
  type?: "words" | "characters";
  className?: string;
}

export const WordCount: React.FC<WordCountProps> = ({
  text = "",
  maxCount,
  type = "characters",
  className = "",
}) => {
  const count =
    type === "words"
      ? text
          .trim()
          .split(/\s+/)
          .filter((word) => word.length > 0).length
      : text.length;

  const isOverLimit = count > maxCount;
  const isNearLimit = count >= maxCount * 0.9 && !isOverLimit;

  const colorClass = isOverLimit
    ? "text-red-600"
    : isNearLimit
      ? "text-yellow-600"
      : "text-gray-500";

  return (
    <p className={`text-xs ${colorClass} ${className}`}>
      {count}/{maxCount} {type}
    </p>
  );
};

export default WordCount;
