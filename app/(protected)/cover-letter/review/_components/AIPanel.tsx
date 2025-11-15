"use client";

import AIRecommendations from "./AIRecommendations";
import ToneSelector from "./ToneSelector";

type AIPanelProps = {
  coverLetterId: string;
  currentTone: string;
};

export default function AIPanel({ coverLetterId, currentTone }: AIPanelProps) {
  return (
    <div className="space-y-4">
      <AIRecommendations coverLetterId={coverLetterId} />
      <ToneSelector coverLetterId={coverLetterId} currentTone={currentTone} />
    </div>
  );
}
