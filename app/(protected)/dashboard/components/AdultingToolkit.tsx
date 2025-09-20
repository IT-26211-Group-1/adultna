'use client'

import React from "react"
import { Search } from "lucide-react"

const adultingTools = [
  "How to get Government IDs",
  "What to wear in a Job Interview",
  "Job Board Listings",
  "Interview Tips"
]

export default function AdultingToolkit() {
  return (
    <div className="backdrop-blur-md bg-white/30 rounded-2xl p-5 border border-white/20 shadow-lg min-h-[320px] flex flex-col">
      <h3 className="text-base font-semibold text-gray-900 mb-3">Adulting Toolkit</h3>

      {/* Search Bar */}
      <div className="relative mb-4">
        <Search size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search for guides, tools, or tips..."
          className="w-full pl-9 pr-3 py-2 backdrop-blur-sm bg-white/50 border border-white/30 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
        />
      </div>

      {/* Quick Links */}
      <div className="space-y-2 flex-1">
        {adultingTools.map((tool, index) => (
          <div key={index} className="flex items-center space-x-2 p-2 hover:bg-white/40 rounded-lg cursor-pointer transition-colors">
            <Search size={14} className="text-gray-400" />
            <span className="text-gray-700 text-sm">{tool}</span>
          </div>
        ))}
      </div>
    </div>
  )
}