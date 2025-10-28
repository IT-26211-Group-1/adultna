"use client";

interface ResumeScoreGaugeProps {
  score: number;
  verdict: string;
}

export function ResumeScoreGauge({
  score,
  verdict,
}: ResumeScoreGaugeProps) {
  // Determine color based on score
  const getScoreColor = (score: number) => {
    if (score >= 80) return "#10b981";
    if (score >= 60) return "#f59e0b";
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
            strokeWidth="20"
            strokeLinecap="round"
          />
          {/* Progress arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke={getScoreColor(score)}
            strokeWidth="20"
            strokeLinecap="round"
            strokeDasharray={`${(score / 100) * 251.2} 251.2`}
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
          <span className="text-5xl font-bold">{score}%</span>
          <span className="text-lg text-gray-600 mt-2">{verdict}</span>
        </div>
      </div>
    </div>
  );
}
