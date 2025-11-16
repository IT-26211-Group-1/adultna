type TemplateSelectorHeaderProps = {
  title?: string;
  subtitle?: string;
};

export function TemplateSelectorHeader({
  title = "Choose Your Resume Template",
  subtitle = "Don't worry — you can customize everything later.",
}: TemplateSelectorHeaderProps) {
  return (
    <div className="text-center space-y-2">
      <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
      <p className="text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
    </div>
  );
}
