'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { FolderOpen, Briefcase, ChevronDown, ChevronRight } from 'lucide-react'

interface SectionItem {
  id: string
  label: string
  href: string
}

interface SidebarCollapsibleSectionProps {
  isCollapsed: boolean
  expandedSections: string[]
  onToggleSection: (sectionId: string) => void
  onExpandSidebar?: (sectionId: string) => void
}

const adultingToolkitItems: SectionItem[] = [
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

const careerCenterItems: SectionItem[] = [
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
    href: '/dashboard/jobs'
  }
]

export default function SidebarCollapsibleSection({
  isCollapsed,
  expandedSections,
  onToggleSection,
  onExpandSidebar
}: SidebarCollapsibleSectionProps) {
  const pathname = usePathname()

  const isActiveRoute = (href: string) => pathname === href

  const renderSection = (
    sectionId: string,
    label: string,
    icon: React.ComponentType<any>,
    items: SectionItem[]
  ) => {
    const Icon = icon

    return (
      <li key={sectionId}>
        {!isCollapsed ? (
          <>
            <button
              onClick={() => onToggleSection(sectionId)}
              className="flex items-center justify-between w-full px-3 py-3 rounded-xl text-gray-700 hover:bg-white/50 transition-colors duration-200"
            >
              <div className="flex items-center gap-3">
                <Icon size={20} className="text-adult-green flex-shrink-0" />
                <span className="font-medium text-sm">{label}</span>
              </div>
              {expandedSections.includes(sectionId) ?
                <ChevronDown size={16} /> :
                <ChevronRight size={16} />
              }
            </button>

            {expandedSections.includes(sectionId) && (
              <ul className="ml-8 space-y-2 mt-2">
                {items.map((item) => {
                  const isActive = isActiveRoute(item.href)
                  return (
                    <li key={item.id}>
                      <a
                        href={item.href}
                        className={`block px-3 py-2 rounded-xl transition-colors duration-200 text-sm ${
                          isActive
                            ? 'bg-adult-green text-white shadow-md'
                            : 'text-gray-600 hover:bg-white/50'
                        }`}
                      >
                        {item.label}
                      </a>
                    </li>
                  )
                })}
              </ul>
            )}
          </>
        ) : (
          <button
            onClick={() => onExpandSidebar?.(sectionId)}
            className="flex items-center justify-center px-3 py-3 rounded-xl text-gray-700 hover:bg-white/50 transition-colors duration-200 w-full"
            title={label}
          >
            <Icon size={20} className="text-adult-green flex-shrink-0" />
          </button>
        )}
      </li>
    )
  }

  return (
    <>
      {renderSection(
        'adulting-toolkit',
        'Adulting Toolkit',
        FolderOpen,
        adultingToolkitItems
      )}
      {renderSection(
        'career-center',
        'Career Center',
        Briefcase,
        careerCenterItems
      )}
    </>
  )
}