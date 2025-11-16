import { Suspense } from "react";
import { ChatContainerOptimized } from "@/app/(protected)/ai-gabay/_components/ChatContainer";

function AIGabayContent() {
  return (
    <div className="fixed inset-0 bg-white">
      <ChatContainerOptimized />
    </div>
  );
}

export default function AIGabayPage() {
  return (
    <Suspense fallback={
      <div className="fixed inset-0 bg-white flex items-center justify-center">
        <div className="flex gap-1">
          <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.3s]" />
          <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.15s]" />
          <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" />
        </div>
      </div>
    }>
      <AIGabayContent />
    </Suspense>
  );
}
