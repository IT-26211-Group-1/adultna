"use client";

interface ResumeScoreGaugeProps {
  score: number;
  maxPossibleScore: number;
  verdict: string;
}

export function ResumeScoreGauge({
  score,
  maxPossibleScore,
  verdict,
}: ResumeScoreGaugeProps) {
  // Calculate percentage
  const percentage = (score / maxPossibleScore) * 100;

  // Determine color based on percentage
  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "#10b981";
    if (percentage >= 60) return "#f59e0b";

    return "#ef4444";
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-semibold mb-4">Your Resume Score</h2>
      <div className="relative w-56 h-56">
        <svg className="w-full h-full" viewBox="0 0 200 120">
          {/* Background arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#e5e7eb"
            strokeLinecap="round"
            strokeWidth="20"
          />
          {/* Progress arc */}
          <path
            className="transition-all duration-1000"
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke={getScoreColor(percentage)}
            strokeDasharray={`${(percentage / 100) * 251.2} 251.2`}
            strokeLinecap="round"
            strokeWidth="20"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
          <span className="text-5xl font-bold">{Math.round(percentage)}%</span>
          <span className="text-sm text-gray-500">
            {score}/{maxPossibleScore}
          </span>
          <span className="text-lg text-gray-600 mt-1">{verdict}</span>
        </div>
      </div>
    </div>
  );
}
