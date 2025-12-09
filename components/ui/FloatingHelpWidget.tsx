"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle, X, HelpCircle, MessageSquare } from "lucide-react";
import FeedbackModal from "./FeedbackModal";

export default function FloatingHelpWidget() {
  const [isHelpMenuOpen, setIsHelpMenuOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const router = useRouter();

  const handleFeedbackClick = () => {
    setIsHelpMenuOpen(false);
    setIsFeedbackModalOpen(true);
  };

  const handleHelpClick = () => {
    setIsHelpMenuOpen(false);
    router.push("/ai-gabay");
  };

  return (
    <>
      {/* Floating Help Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {/* Help Menu */}
        {isHelpMenuOpen && (
          <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-xl border border-gray-200 py-2 min-w-[180px] mb-2">
            <div className="px-4 py-2 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900">
                Need Help?
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                We&apos;re here to assist you
              </p>
            </div>
            <button
              className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 flex items-center gap-3 transition-colors"
              onClick={handleFeedbackClick}
            >
              <MessageSquare className="w-4 h-4 text-adult-green" />
              <div>
                <div className="font-medium text-gray-900">Send Feedback</div>
                <div className="text-xs text-gray-500">
                  Report issues or suggestions
                </div>
              </div>
            </button>
            <button
              className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 flex items-center gap-3 transition-colors"
              onClick={handleHelpClick}
            >
              <HelpCircle className="w-4 h-4 text-adult-green" />
              <div>
                <div className="font-medium text-gray-900">Get Help</div>
                <div className="text-xs text-gray-500">
                  Questions or assistance
                </div>
              </div>
            </button>
          </div>
        )}

        {/* Main Help Button */}
        <button
          aria-label="Help and support"
          className={`
            group relative flex items-center justify-center
            w-14 h-14 bg-adult-green text-white rounded-full
            shadow-lg hover:shadow-xl transition-all duration-300
            hover:scale-110 active:scale-95
            ${isHelpMenuOpen ? "bg-adult-green/90" : ""}
          `}
          onClick={() => setIsHelpMenuOpen(!isHelpMenuOpen)}
        >
          <div className="relative">
            <MessageCircle
              className={`transition-all duration-300 ${
                isHelpMenuOpen
                  ? "opacity-0 rotate-45 scale-75"
                  : "opacity-100 rotate-0 scale-100"
              }`}
              size={24}
            />
            <X
              className={`absolute top-0 left-0 transition-all duration-300 ${
                isHelpMenuOpen
                  ? "opacity-100 rotate-0 scale-100"
                  : "opacity-0 -rotate-45 scale-75"
              }`}
              size={24}
            />
          </div>

          {/* Pulse animation when not open */}
          {!isHelpMenuOpen && (
            <div className="absolute -inset-1 bg-adult-green rounded-full animate-pulse opacity-30" />
          )}

          {/* Tooltip */}
          <div className="absolute right-full mr-4 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
            Need help?
            <div className="absolute top-1/2 -translate-y-1/2 left-full w-0 h-0 border-l-4 border-l-gray-900 border-t-4 border-t-transparent border-b-4 border-b-transparent" />
          </div>
        </button>
      </div>

      {/* Feedback Modal */}
      <FeedbackModal
        open={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
      />

      {/* Click outside to close */}
      {isHelpMenuOpen && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-40"
          onClick={() => setIsHelpMenuOpen(false)}
        />
      )}
    </>
  );
}
