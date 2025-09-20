'use client'

import React, { useState } from 'react'
import { 
  Menu, 
  X, 
  LayoutGrid, 
  Map, 
  Bot, 
  FolderOpen, 
  Briefcase,
  ChevronDown,
  ChevronRight,
  ChevronLeft
} from 'lucide-react'
import Image from 'next/image'

interface SidebarProps {
  isOpen?: boolean
  onToggle?: () => void
  isCollapsed?: boolean
  onCollapse?: () => void
}

export default function UserSidebar({ 
  isOpen: controlledIsOpen, 
  onToggle,
  isCollapsed: controlledIsCollapsed,
  onCollapse
}: SidebarProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false)
  const [internalIsCollapsed, setInternalIsCollapsed] = useState(false)
  const [expandedSections, setExpandedSections] = useState<string[]>([])
  
  // Use controlled state if provided, otherwise use internal state
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen
  const isCollapsed = controlledIsCollapsed !== undefined ? controlledIsCollapsed : internalIsCollapsed
  const handleToggle = onToggle || (() => setInternalIsOpen(!internalIsOpen))
  const handleCollapse = onCollapse || (() => setInternalIsCollapsed(!internalIsCollapsed))
  
  const toggleSection = (sectionId: string) => {
    if (isCollapsed) return // Don't allow expansion when collapsed
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    )
  }
  
  const navItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: LayoutGrid,
      href: '/dashboard'
    },
    {
      id: 'roadmap',
      label: 'Roadmap',
      icon: Map,
      href: '/roadmap'
    },
    {
      id: 'ai-gabay',
      label: 'AI Gabay Agent',
      icon: Bot,
      href: '/ai-gabay'
    }
  ]
  
  const adultingToolkitItems = [
    {
      id: 'govguides',
      label: 'GovGuides',
      href: '/govguides'
    },
    {
      id: 'adulting-filebox',
      label: 'Adulting Filebox',
      href: '/filebox'
    }
  ]
  
  const careerCenterItems = [
    {
      id: 'resume-builder',
      label: 'Resume Builder',
      href: '/resume-builder'
    },
    {
      id: 'cover-letter',
      label: 'Cover Letter Helper',
      href: '/cover-letter'
    },
    {
      id: 'mock-interview',
      label: 'Mock Interview Coach',
      href: '/mock-interview'
    },
    {
      id: 'job-board',
      label: 'Job Board',
      href: '/job-board'
    }
  ]

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={handleToggle}
        />
      )}
      
      {/* Toggle button for mobile */}
      <button
        onClick={handleToggle}
        className="fixed top-4 left-4 z-50 lg:hidden bg-white p-2 rounded-md shadow-md border"
        aria-label="Toggle sidebar"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-screen bg-white border-r border-gray-200 z-[100]
        transform transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
        ${isCollapsed ? 'lg:w-16' : 'lg:w-80'}
        w-80 flex flex-col
      `}>
        {/* Header */}
        <div className="p-6 flex items-center">
          <Image 
            src={isCollapsed ? "/AdultNa-Logo-Icon.png" : "/AdultNa-Logo.png"}
            alt="AdultNa Logo" 
            width={isCollapsed ? 32 : 120} 
            height={isCollapsed ? 32 : 40}
            className="object-contain"
          />
        </div>

        {/* Collapse/Expand Button - Desktop only */}
        <button
          onClick={handleCollapse}
          className="hidden lg:flex absolute -right-3 top-20 bg-white border border-gray-200 rounded-full p-1.5 shadow-md hover:shadow-lg transition-all duration-200 hover:bg-gray-50 z-10"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight size={16} className="text-gray-600" />
          ) : (
            <ChevronLeft size={16} className="text-gray-600" />
          )}
        </button>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4">
          {/* Main Section */}
          <div className="mb-6">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200 ${
                      isCollapsed ? 'justify-center' : ''
                    }`}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <item.icon size={20} className="text-teal-600 flex-shrink-0" />
                    {!isCollapsed && <span className="font-medium text-sm">{item.label}</span>}
                  </a>
                </li>
              ))}

              {/* Adulting Toolkit Section */}
              <li className="relative group">
                {!isCollapsed ? (
                  <>
                    <button
                      onClick={() => toggleSection('adulting-toolkit')}
                      className="flex items-center justify-between w-full px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <FolderOpen size={20} className="text-teal-600 flex-shrink-0" />
                        <span className="font-medium text-sm">Adulting Toolkit</span>
                      </div>
                      {expandedSections.includes('adulting-toolkit') ? 
                        <ChevronDown size={16} /> : 
                        <ChevronRight size={16} />
                      }
                    </button>
                    
                    {expandedSections.includes('adulting-toolkit') && (
                      <ul className="ml-8 space-y-2 mt-2">
                        {adultingToolkitItems.map((item) => (
                          <li key={item.id}>
                            <a
                              href={item.href}
                              className="block px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors duration-200 text-xs"
                            >
                              {item.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <>
                    <a
                      href="/adulting-toolkit"
                      className="flex items-center justify-center px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                      title="Adulting Toolkit"
                    >
                      <FolderOpen size={20} className="text-teal-600 flex-shrink-0" />
                    </a>
                    
                    {/* Hover dropdown for collapsed state */}
                    <div className="absolute left-full top-0 ml-2 w-56 bg-white border border-gray-200 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[9999]">
                      <div className="p-2">
                        <div className="text-xs font-medium text-gray-900 px-3 py-2 border-b border-gray-100 mb-1">
                          Adulting Toolkit
                        </div>
                        <ul className="space-y-1">
                          {adultingToolkitItems.map((item) => (
                            <li key={item.id}>
                              <a
                                href={item.href}
                                className="block px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors duration-200 text-xs"
                              >
                                {item.label}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </>
                )}
              </li>

              {/* Career Center Section */}
              <li className="relative group">
                {!isCollapsed ? (
                  <>
                    <button
                      onClick={() => toggleSection('career-center')}
                      className="flex items-center justify-between w-full px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <Briefcase size={20} className="text-teal-600 flex-shrink-0" />
                        <span className="font-medium text-sm">Career Center</span>
                      </div>
                      {expandedSections.includes('career-center') ? 
                        <ChevronDown size={16} /> : 
                        <ChevronRight size={16} />
                      }
                    </button>
                    
                    {expandedSections.includes('career-center') && (
                      <ul className="ml-8 space-y-2 mt-2">
                        {careerCenterItems.map((item) => (
                          <li key={item.id}>
                            <a
                              href={item.href}
                              className="block px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors duration-200 text-xs"
                            >
                              {item.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <>
                    <a
                      href="/career-center"
                      className="flex items-center justify-center px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                      title="Career Center"
                    >
                      <Briefcase size={20} className="text-teal-600 flex-shrink-0" />
                    </a>
                    
                    {/* Hover dropdown for collapsed state */}
                    <div className="absolute left-full top-0 ml-2 w-56 bg-white border border-gray-200 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[9999]">
                      <div className="p-2">
                        <div className="text-xs font-medium text-gray-900 px-3 py-2 border-b border-gray-100 mb-1">
                          Career Center
                        </div>
                        <ul className="space-y-1">
                          {careerCenterItems.map((item) => (
                            <li key={item.id}>
                              <a
                                href={item.href}
                                className="block px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors duration-200 text-xs"
                              >
                                {item.label}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </>
                )}
              </li>
            </ul>
          </div>
        </nav>

        {/* Storage Section - Always at bottom */}
        <div className="mt-auto p-4 border-t border-gray-200">
          {!isCollapsed ? (
            <>
              <h3 className="text-sm font-medium text-gray-500 mb-3">Storage</h3>
              <div className="space-y-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-teal-600 h-2 rounded-full" style={{ width: '4.1%' }}></div>
                </div>
                <p className="text-xs text-gray-500">4.1 MB of 100 MB used</p>
              </div>
            </>
          ) : (
            <div className="flex justify-center">
              <div className="w-8 h-2 bg-gray-200 rounded-full">
                <div className="bg-teal-600 h-2 rounded-full" style={{ width: '4.1%' }}></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}