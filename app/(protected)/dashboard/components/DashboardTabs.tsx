'use client'

interface Tab {
  id: string
  label: string
}

interface DashboardTabsProps {
  activeTab: string
  onTabChange: (tabId: string) => void
}

const tabs: Tab[] = [
  { id: 'all', label: 'All' },
  { id: 'roadmap', label: 'Adulting Roadmap Progress' },
  { id: 'activities', label: 'Recent Activities' },
  { id: 'deadlines', label: 'Upcoming Deadlines' }
]

export default function DashboardTabs({ activeTab, onTabChange }: DashboardTabsProps) {
  return (
    <div className="flex justify-end space-x-2 mb-8">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${
            activeTab === tab.id
              ? 'bg-adult-green text-white'
              : 'bg-adult-green/10 backdrop-blur-sm text-gray-600 hover:bg-adult-green/20'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}