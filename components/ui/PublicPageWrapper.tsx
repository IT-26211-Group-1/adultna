"use client";

import React from "react";

interface PublicPageWrapperProps {
  children: React.ReactNode;
}

export default function PublicPageWrapper({
  children,
}: PublicPageWrapperProps) {
  return (
    <div
      className="min-h-screen relative"
      style={{
        background: `
          linear-gradient(135deg,
            rgba(20, 184, 166, 0.02) 0%,
            rgba(134, 239, 172, 0.03) 20%,
            rgba(253, 224, 71, 0.03) 40%,
            rgba(251, 146, 60, 0.02) 60%,
            rgba(236, 72, 153, 0.02) 80%,
            rgba(139, 92, 246, 0.02) 100%
          )
        `,
      }}
    >
      {/* Fixed Background Circles */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `
            radial-gradient(circle at 95% 30%, rgba(34, 197, 94, 0.25) 0%, rgba(34, 197, 94, 0.1) 25%, transparent 90%),
            radial-gradient(circle at 15% 80%, rgba(139, 92, 246, 0.15) 0%, rgba(139, 92, 246, 0.05) 30%, transparent 70%)
          `,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
