import Image from 'next/image'

interface SidebarHeaderProps {
  isCollapsed: boolean
}

export default function SidebarHeader({ isCollapsed }: SidebarHeaderProps) {
  return (
    <div className="p-6 flex items-center rounded-t-xl">
      {isCollapsed ? (
        <Image
          src="/AdultNa-Logo-Icon.png"
          alt="AdultNa Logo"
          width={40}
          height={40}
          className="object-contain"
        />
      ) : (
        <Image
          src="/AdultNa-Logo.png"
          alt="AdultNa Logo"
          width={120}
          height={40}
          className="object-contain"
        />
      )}
    </div>
  )
}