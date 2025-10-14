import Image from "next/image";

interface SidebarHeaderProps {
  isCollapsed: boolean;
}

export default function SidebarHeader({ isCollapsed }: SidebarHeaderProps) {
  return (
    <div className="p-6 flex items-center rounded-t-xl">
      {isCollapsed ? (
        <Image
          alt="AdultNa Logo"
          className="object-contain"
          height={40}
          src="/AdultNa-Logo-Icon.png"
          width={40}
        />
      ) : (
        <Image
          alt="AdultNa Logo"
          className="object-contain"
          height={40}
          src="/AdultNa-Logo.png"
          width={120}
        />
      )}
    </div>
  );
}
