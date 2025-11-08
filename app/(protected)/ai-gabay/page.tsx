import { ChatContainerOptimized } from "@/app/(protected)/ai-gabay/_components/ChatContainer";

export default function AIGabayPage() {
  return (
    <div className="flex h-screen flex-col">
      {/* Chat Container with integrated header and sidebar */}
      <main className="flex-1 overflow-hidden">
        <ChatContainerOptimized />
      </main>
    </div>
  );
}
