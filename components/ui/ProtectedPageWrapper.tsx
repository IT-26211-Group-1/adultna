'use client'

import React, { useState } from "react"
import UserSidebar from "./UserSidebar"

interface ProtectedPageWrapperProps {
  children: React.ReactNode
}

export default function ProtectedPageWrapper({ children }: ProtectedPageWrapperProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div
      className="min-h-screen relative"
      style={{
        background: `
          linear-gradient(135deg,
            rgba(20, 184, 166, 0.01) 0%,
            rgba(134, 239, 172, 0.015) 20%,
            rgba(253, 224, 71, 0.015) 40%,
            rgba(251, 146, 60, 0.01) 60%,
            rgba(236, 72, 153, 0.01) 80%,
            rgba(139, 92, 246, 0.01) 100%
          )
        `
      }}
    >
      {/* Fixed Background Circles */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `
            radial-gradient(circle at 95% 30%, rgba(34, 197, 94, 0.12) 0%, rgba(34, 197, 94, 0.05) 25%, transparent 90%),
            radial-gradient(circle at 15% 80%, rgba(139, 92, 246, 0.08) 0%, rgba(139, 92, 246, 0.03) 30%, transparent 70%),
            radial-gradient(circle at 60% 60%, rgba(251, 146, 60, 0.06) 0%, rgba(251, 146, 60, 0.02) 35%, transparent 75%)
          `
        }}
      />
      {/* Sidebar */}
      <UserSidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        isCollapsed={sidebarCollapsed}
        onCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content Wrapper */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'} relative z-10`}>
        {children}
      </div>
    </div>
  )
}