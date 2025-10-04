'use client'

import { usePathname } from 'next/navigation'
import { LayoutGrid, Map, Bot } from 'lucide-react'
import { LucideIcon } from 'lucide-react'

interface NavItem {
  id: string
  label: string
  icon: LucideIcon
  href: string
}

interface SidebarNavigationProps {
  isCollapsed: boolean
}

const navItems: NavItem[] = [
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

export default function SidebarNavigation({ isCollapsed }: SidebarNavigationProps) {
  const pathname = usePathname()

  const isActiveRoute = (href: string) => pathname === href

  return (
    <ul className="space-y-2">
      {navItems.map((item) => {
        const isActive = isActiveRoute(item.href)
        return (
          <li key={item.id}>
            <a
              href={item.href}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-colors duration-200 ${
                isCollapsed ? 'justify-center' : ''
              } ${
                isActive
                  ? 'bg-adult-green text-white shadow-md'
                  : 'text-gray-700 hover:bg-white/50'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <item.icon
                size={20}
                className={`flex-shrink-0 ${
                  isActive ? 'text-white' : 'text-adult-green'
                }`}
              />
              {!isCollapsed && (
                <span className={`font-medium text-sm ${
                  isActive ? 'text-white' : ''
                }`}>
                  {item.label}
                </span>
              )}
            </a>
          </li>
        )
      })}
    </ul>
  )
}