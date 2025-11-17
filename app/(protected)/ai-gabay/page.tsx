import { Suspense } from "react";
import { ChatContainerOptimized } from "@/app/(protected)/ai-gabay/_components/ChatContainer";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

function AIGabayContent() {
  return (
    <div className="fixed inset-0 bg-white">
      <ChatContainerOptimized />
    </div>
  );
}

export default function AIGabayPage() {
  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 bg-white">
          <LoadingSpinner fullScreen={true} variant="dots" />
        </div>
      }
    >
      <AIGabayContent />
    </Suspense>
  );
}
