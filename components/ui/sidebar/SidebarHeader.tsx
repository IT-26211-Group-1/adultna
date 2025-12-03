import { OptimizedImage } from "@/components/ui/OptimizedImage";

interface SidebarHeaderProps {
  isCollapsed: boolean;
}

export default function SidebarHeader({ isCollapsed }: SidebarHeaderProps) {
  return (
    <div className="p-6 flex items-center rounded-t-xl">
      {isCollapsed ? (
        <OptimizedImage
          priority
          alt="AdultNa Logo"
          className="object-contain"
          height={40}
          sizes="40px"
          src="/AdultNa-Logo-Icon.png"
          width={40}
        />
      ) : (
        <OptimizedImage
          priority
          alt="AdultNa Logo"
          className="object-contain"
          height={40}
          sizes="120px"
          src="/AdultNa-Logo.png"
          width={120}
        />
      )}
    </div>
  );
}
