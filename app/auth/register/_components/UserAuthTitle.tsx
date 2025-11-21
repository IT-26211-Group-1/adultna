interface UserAuthTitleProps {
  title: string;
  subtitle: string;
}

export const UserAuthTitle = ({ title, subtitle }: UserAuthTitleProps) => {
  return (
    <div className="mb-6">
      <h1 className="text-4xl font-bold text-adult-green mb-2 font-playfair">
        {title}
      </h1>
      <p className="text-gray-600 text-sm">{subtitle}</p>
    </div>
  );
};
