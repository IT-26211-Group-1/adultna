interface SidebarStorageProps {
  isCollapsed: boolean
}

export default function SidebarStorage({ isCollapsed }: SidebarStorageProps) {
  return (
    <div className="mt-auto p-6 border-t border-gray-200 rounded-b-xl">
      {!isCollapsed ? (
        <>
          <h3 className="text-sm font-medium text-gray-500 mb-3">Storage</h3>
          <div className="space-y-2">
            <div className="w-full bg-gray-200 rounded-xl h-2">
              <div className="bg-adult-green h-2 rounded-xl" style={{ width: '4.1%' }}></div>
            </div>
            <p className="text-xs text-gray-500">4.1 MB of 100 MB used</p>
          </div>
        </>
      ) : (
        <div className="flex justify-center">
          <div className="w-8 h-2 bg-gray-200 rounded-xl">
            <div className="bg-adult-green h-2 rounded-xl" style={{ width: '4.1%' }}></div>
          </div>
        </div>
      )}
    </div>
  )
}