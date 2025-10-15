import { ChatContainer } from "@/app/(protected)/ai-gabay/_components/ChatContainer";
import ProtectedPageWrapper from "@/components/ui/ProtectedPageWrapper";

export default function AIGabayPage() {
  return (
    <ProtectedPageWrapper>
      <div className="flex h-screen flex-col">
        {/* Header */}
        <header className="border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-700 dark:bg-gray-900">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            AI Gabay Agent
          </h1>
        </header>

        {/* Chat Container */}
        <main className="flex-1 overflow-hidden">
          <ChatContainer />
        </main>
      </div>
    </ProtectedPageWrapper>
  );
}
