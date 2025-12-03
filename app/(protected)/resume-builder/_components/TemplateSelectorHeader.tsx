type TemplateSelectorHeaderProps = {
  title?: string;
  subtitle?: string;
};

export function TemplateSelectorHeader({
  title = "Choose Your Resume Template",
  subtitle = "Don't worry — you can customize everything later.",
}: TemplateSelectorHeaderProps) {
  return (
    <div className="text-center space-y-2.5 max-w-2xl mx-auto">
      <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
        {title}
      </h1>
      <p className="text-sm text-gray-600 leading-relaxed">{subtitle}</p>
    </div>
  );
}
