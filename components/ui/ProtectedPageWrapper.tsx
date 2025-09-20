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
      className="min-h-screen"
      style={{
        background: `linear-gradient(135deg,
          rgba(20, 184, 166, 0.08) 0%,
          rgba(134, 239, 172, 0.12) 20%,
          rgba(253, 224, 71, 0.1) 40%,
          rgba(251, 146, 60, 0.08) 60%,
          rgba(236, 72, 153, 0.06) 80%,
          rgba(139, 92, 246, 0.08) 100%
        )`
      }}
    >
      {/* Sidebar */}
      <UserSidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        isCollapsed={sidebarCollapsed}
        onCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content Wrapper */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-80'}`}>
        {children}
      </div>
    </div>
  )
}