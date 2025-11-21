interface ProfileSectionProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export function ProfileSection({
  title,
  description,
  children,
}: ProfileSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
      {/* Left side - Title and Description */}
      <div>
        <h2 className="text-xl font-semibold text-adult-green">{title}</h2>
        <p className="text-sm text-gray-600 mt-2">{description}</p>
      </div>

      {/* Right side - Content */}
      <div className="border-l-4 border-gray-200 pl-6 py-2">{children}</div>
    </div>
  );
}
