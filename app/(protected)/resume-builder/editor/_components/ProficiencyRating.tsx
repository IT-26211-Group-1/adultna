"use client";

type ProficiencyRatingProps = {
  value?: number;
  onChange: (value: number) => void;
  color?: string;
};

export default function ProficiencyRating({
  value = 0,
  onChange,
  color = "#7c3aed",
}: ProficiencyRatingProps) {
  const maxLevel = 5;

  const handleBarClick = (level: number) => {
    if (value === level) {
      onChange(0);
    } else {
      onChange(level);
    }
  };

  return (
    <div className="flex gap-1">
      {[...Array(maxLevel)].map((_, index) => {
        const level = index + 1;
        const isFilled = level <= value;

        return (
          <button
            key={index}
            aria-label={`Set proficiency to ${level} out of ${maxLevel}`}
            className="w-4 h-4 border transition-all hover:scale-110"
            style={{
              backgroundColor: isFilled ? color : "white",
              borderColor: color,
            }}
            type="button"
            onClick={() => handleBarClick(level)}
          />
        );
      })}
    </div>
  );
}
